// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GaslessPaymaster
 * @notice Sponsors gas fees for all transactions to a specific contract.
 *         Users interact with the dApp without holding any ADI for gas.
 *
 * @dev Implements ZKsync's native Account Abstraction paymaster interface.
 *      ADI Chain is built on ZKsync — every transaction can optionally include
 *      a `paymaster` address and `paymasterInput`. The network bootloader calls
 *      this contract before execution to validate and pay for gas.
 *
 *      This is NOT ERC-4337. ZKsync native AA is simpler:
 *        - No separate bundler or EntryPoint needed
 *        - Regular EOA wallets (MetaMask) can use paymasters directly
 *        - Paymaster is called at the protocol level by the bootloader
 *
 *      How to fund:
 *        cast send <PAYMASTER_ADDRESS> --value 0.1ether --rpc-url <RPC>
 *        // or send ADI to the paymaster address directly
 *
 * Sourced interfaces from:
 *   ADI-Foundation-Labs/ADI-Stack-Contracts/system-contracts/contracts/interfaces/
 */

// ─── ZKsync system contract addresses ────────────────────────────────────────

/// @dev The bootloader pseudo-address. Only entity allowed to call validateAndPayForPaymasterTransaction.
address constant BOOTLOADER_FORMAL_ADDRESS = 0x0000000000000000000000000000000000008001;

// ─── ZKsync Transaction struct ────────────────────────────────────────────────
// This struct represents a ZKsync L2 transaction passed to the paymaster by the bootloader.
// Sourced from: TransactionHelper.sol in ADI-Stack-Contracts

struct Transaction {
    uint256 txType;
    uint256 from;
    uint256 to;
    uint256 gasLimit;
    uint256 gasPerPubdataByteLimit;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    uint256 paymaster;
    uint256 nonce;
    uint256 value;
    uint256[4] reserved;
    bytes data;
    bytes signature;
    bytes32[] factoryDeps;
    bytes paymasterInput;
    bytes reservedDynamic;
}

enum ExecutionResult {
    Revert,
    Success
}

// ─── IPaymaster interface ─────────────────────────────────────────────────────

interface IPaymaster {
    /**
     * @notice Called by the bootloader before transaction execution.
     *         Returns SUCCESS_MAGIC to approve gas sponsorship, or reverts to reject.
     */
    function validateAndPayForPaymasterTransaction(
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable returns (bytes4 magic, bytes memory context);

    /**
     * @notice Called by the bootloader after execution.
     *         Used for refunds and post-execution accounting.
     */
    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable;
}

// ─── IPaymasterFlow selectors ─────────────────────────────────────────────────
// These match @adi-devtools/contracts/system PAYMASTER_FLOW_ABI selectors.

/// @dev selector of general(bytes) — confirmed 0x8c5a3445
bytes4 constant GENERAL_SELECTOR = 0x8c5a3445;

/// @dev selector of approvalBased(address,uint256,bytes) — confirmed 0x949431dc
bytes4 constant APPROVAL_BASED_SELECTOR = 0x949431dc;

// ─── GaslessPaymaster ────────────────────────────────────────────────────────

contract GaslessPaymaster is IPaymaster {
    /// @dev SUCCESS_MAGIC signals to the bootloader that this paymaster approves the transaction.
    ///      Equals IPaymaster.validateAndPayForPaymasterTransaction.selector.
    bytes4 private constant SUCCESS_MAGIC = IPaymaster.validateAndPayForPaymasterTransaction.selector;

    address public owner;

    /// @notice The contract whose transactions this paymaster will sponsor.
    ///         All vote() calls on the voting contract are paid by this paymaster.
    address public sponsoredContract;

    event Funded(address indexed sender, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event SponsoredContractUpdated(address indexed oldContract, address indexed newContract);

    error OnlyBootloader();
    error OnlyOwner();
    error UnsupportedPaymasterFlow();
    error WrongTargetContract(address got, address expected);
    error InsufficientPaymasterBalance(uint256 required, uint256 available);
    error PaymentFailed();

    modifier onlyBootloader() {
        if (msg.sender != BOOTLOADER_FORMAL_ADDRESS) revert OnlyBootloader();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(address _sponsoredContract) {
        owner = msg.sender;
        sponsoredContract = _sponsoredContract;
    }

    // ─── IPaymaster implementation ────────────────────────────────────────────

    /**
     * @inheritdoc IPaymaster
     * @dev Validates that:
     *   1. The transaction uses "general" paymaster flow
     *   2. The transaction targets the sponsored contract (e.g. the voting contract)
     *   3. This paymaster has enough ADI to cover gas
     *   Then pays the bootloader the required gas amount.
     */
    function validateAndPayForPaymasterTransaction(
        bytes32, /* _txHash */
        bytes32, /* _suggestedSignedHash */
        Transaction calldata _transaction
    ) external payable onlyBootloader returns (bytes4 magic, bytes memory context) {
        // ── Check paymaster flow ───────────────────────────────────────────────
        require(_transaction.paymasterInput.length >= 4, "Paymaster input too short");
        bytes4 flowSelector = bytes4(_transaction.paymasterInput[0:4]);
        if (flowSelector != GENERAL_SELECTOR) revert UnsupportedPaymasterFlow();

        // ── Check target contract ─────────────────────────────────────────────
        address target = address(uint160(_transaction.to));
        if (target != sponsoredContract) {
            revert WrongTargetContract(target, sponsoredContract);
        }

        // ── Pay the bootloader for gas ────────────────────────────────────────
        uint256 gasCost = _transaction.gasLimit * _transaction.maxFeePerGas;
        if (address(this).balance < gasCost) {
            revert InsufficientPaymasterBalance(gasCost, address(this).balance);
        }

        (bool success,) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: gasCost}("");
        if (!success) revert PaymentFailed();

        magic = SUCCESS_MAGIC;
        context = bytes(""); // no post-transaction context needed
    }

    /**
     * @inheritdoc IPaymaster
     * @dev No-op for this simple paymaster. Gas refunds go back to the paymaster automatically.
     */
    function postTransaction(
        bytes calldata, /* _context */
        Transaction calldata, /* _transaction */
        bytes32, /* _txHash */
        bytes32, /* _suggestedSignedHash */
        ExecutionResult, /* _txResult */
        uint256  /* _maxRefundedGas */
    ) external payable override onlyBootloader {}

    // ─── Management ───────────────────────────────────────────────────────────

    /// @notice Update which contract this paymaster sponsors.
    function setSponsoredContract(address _newContract) external onlyOwner {
        emit SponsoredContractUpdated(sponsoredContract, _newContract);
        sponsoredContract = _newContract;
    }

    /// @notice Withdraw the paymaster's ADI balance back to owner.
    function withdraw(address payable _to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = _to.call{value: balance}("");
        require(success, "Withdrawal failed");
        emit Withdrawn(_to, balance);
    }

    /// @notice Returns the paymaster's current ADI balance (available to sponsor gas).
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Fund the paymaster by sending ADI directly to this address.
    receive() external payable {
        emit Funded(msg.sender, msg.value);
    }
}
