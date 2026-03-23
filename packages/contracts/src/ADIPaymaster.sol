// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ADIPaymaster
 * @notice ERC-4337 Paymaster template for ADI Chain.
 *         Sponsors gas fees for users — they transact without holding ADI.
 *
 * @dev Important ADI-specific notes:
 *      - ADI uses ADI token as the native gas token, NOT ETH.
 *      - ERC-4337 Account Abstraction is supported via Pimlico.
 *      - ERC-7702 is NOT supported on ADI Chain.
 *      - Bundlers must run in non-safe mode (debug_traceCall not available on public RPC).
 *
 *      EntryPoint addresses (same on testnet and mainnet):
 *        v0.7 — 0x0000000071727De22E5E9d8BAf0edAc6f37da032
 *        v0.8 — 0x4337084d9e255ff0702461cf8895ce9e3b5ff108
 *
 *      This is a minimal sponsoring paymaster. For production use, extend with:
 *        - Allowlist/denylist of sponsorable contracts
 *        - Per-user gas limits
 *        - ERC-20 token payment (user pays in ERC-20, paymaster covers ADI gas)
 *
 * @example
 *   // Deploy against EntryPoint v0.7
 *   const paymaster = await deployContract("ADIPaymaster",
 *     ["0x0000000071727De22E5E9d8BAf0edAc6f37da032"]
 *   );
 *   // Fund via depositToEntryPoint()
 *   // Stake via addStake() before going live
 */

/// @dev Minimal IEntryPoint interface — only what the paymaster needs.
interface IEntryPoint {
    function depositTo(address account) external payable;
    function getDepositInfo(address account) external view returns (
        uint112 deposit, bool staked, uint112 stake, uint32 unstakeDelaySec, uint48 withdrawTime
    );
    function addStake(uint32 unstakeDelaySec) external payable;
    function unlockStake() external;
    function withdrawStake(address payable withdrawAddress) external;
    function withdrawTo(address payable withdrawAddress, uint256 withdrawAmount) external;
}

/// @dev Minimal UserOperation struct (v0.7).
struct PackedUserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    bytes32 accountGasLimits;
    uint256 preVerificationGas;
    bytes32 gasFees;
    bytes paymasterAndData;
    bytes signature;
}

contract ADIPaymaster {
    address public immutable owner;
    IEntryPoint public immutable entryPoint;

    event Deposited(address indexed depositor, uint256 amount);
    event PolicyUpdated(address indexed target, bool allowed);

    error Unauthorized();
    error NotEntryPoint();
    error PolicyDenied(address target);

    /// @dev Allowlist: if any policy is set, only allowed targets are sponsored.
    ///      If empty (default), all UserOps are sponsored.
    mapping(address => bool) public allowedTargets;
    bool public policyEnabled;

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyEntryPoint() {
        if (msg.sender != address(entryPoint)) revert NotEntryPoint();
        _;
    }

    constructor(address _entryPoint) {
        owner = msg.sender;
        entryPoint = IEntryPoint(_entryPoint);
    }

    // ─── ERC-4337 Paymaster Interface ─────────────────────────────────────────

    /**
     * @notice Called by EntryPoint before execution.
     *         Returns context passed to postOp. Reverts to reject sponsorship.
     */
    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32, /* userOpHash */
        uint256 /* maxCost */
    ) external onlyEntryPoint returns (bytes memory context, uint256 validationData) {
        if (policyEnabled) {
            // Extract the target address from callData (first 4 bytes = selector, next 32 = address)
            // This is a simplified check — production paymasters decode callData properly.
            address target = userOp.sender;
            if (!allowedTargets[target]) revert PolicyDenied(target);
        }
        // validationData = 0 means valid immediately, no time bounds
        return (abi.encode(userOp.sender), 0);
    }

    /**
     * @notice Called by EntryPoint after execution. Used for post-op accounting.
     */
    function postOp(
        uint8, /* mode */
        bytes calldata, /* context */
        uint256, /* actualGasCost */
        uint256  /* actualUserOpFeePerGas */
    ) external onlyEntryPoint {
        // No post-op action needed for a simple sponsoring paymaster.
    }

    // ─── Funding ──────────────────────────────────────────────────────────────

    /// @notice Deposit ADI into the EntryPoint to cover sponsored gas.
    function depositToEntryPoint() external payable onlyOwner {
        entryPoint.depositTo{value: msg.value}(address(this));
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Withdraw ETH/ADI deposited in the EntryPoint back to owner.
    function withdrawFromEntryPoint(uint256 amount) external onlyOwner {
        entryPoint.withdrawTo(payable(owner), amount);
    }

    /// @notice Stake ADI in the EntryPoint (required for paymasters).
    function addStake(uint32 unstakeDelaySec) external payable onlyOwner {
        entryPoint.addStake{value: msg.value}(unstakeDelaySec);
    }

    function unlockStake() external onlyOwner { entryPoint.unlockStake(); }
    function withdrawStake() external onlyOwner { entryPoint.withdrawStake(payable(owner)); }

    /// @notice Returns this paymaster's deposit in the EntryPoint.
    function getDeposit() external view returns (uint256) {
        (uint112 deposit,,,, ) = entryPoint.getDepositInfo(address(this));
        return uint256(deposit);
    }

    // ─── Policy ───────────────────────────────────────────────────────────────

    function setPolicy(address target, bool allowed) external onlyOwner {
        allowedTargets[target] = allowed;
        emit PolicyUpdated(target, allowed);
    }

    function setPolicyEnabled(bool enabled) external onlyOwner {
        policyEnabled = enabled;
    }

    // ─── Receive ──────────────────────────────────────────────────────────────

    receive() external payable {}
}
