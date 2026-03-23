// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ADIFaucet
 * @notice Testnet token faucet for ADI Chain.
 *         Drips a fixed amount of ADI (or any ERC-20 token) to callers on a cooldown.
 *
 * @dev There are two modes:
 *      1. Native ADI drip — fund the contract with ADI, call drip() to receive native tokens.
 *      2. ERC-20 drip    — set token address, fund with ERC-20, call dripToken() to receive tokens.
 *
 * @example
 *   // Deploy with 0.1 ADI drip per claim, 24h cooldown
 *   const faucet = await deployContract("ADIFaucet", [parseEther("0.1"), 86400]);
 *   // Fund it: send ADI to the contract address
 *   // Users claim: faucet.drip()
 */
contract ADIFaucet {
    address public immutable owner;

    uint256 public dripAmount;   // amount of native ADI sent per claim (wei)
    uint256 public cooldown;     // seconds between claims per address

    mapping(address => uint256) public lastClaimTime;

    event Dripped(address indexed recipient, uint256 amount);
    event Funded(address indexed funder, uint256 amount);
    event OwnerWithdraw(uint256 amount);
    event DripAmountUpdated(uint256 newAmount);
    event CooldownUpdated(uint256 newCooldown);

    error Unauthorized();
    error CooldownActive(uint256 availableAt);
    error InsufficientFaucetBalance();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(uint256 _dripAmount, uint256 _cooldown) {
        owner = msg.sender;
        dripAmount = _dripAmount;
        cooldown = _cooldown;
    }

    /// @notice Claim native ADI tokens. Subject to cooldown.
    function drip() external {
        uint256 available = lastClaimTime[msg.sender] + cooldown;
        if (block.timestamp < available) revert CooldownActive(available);
        if (address(this).balance < dripAmount) revert InsufficientFaucetBalance();

        lastClaimTime[msg.sender] = block.timestamp;
        (bool ok, ) = msg.sender.call{value: dripAmount}("");
        require(ok, "Transfer failed");
        emit Dripped(msg.sender, dripAmount);
    }

    /// @notice Returns seconds until the next claim is available (0 if available now).
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 available = lastClaimTime[user] + cooldown;
        if (block.timestamp >= available) return 0;
        return available - block.timestamp;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setDripAmount(uint256 amount) external onlyOwner {
        dripAmount = amount;
        emit DripAmountUpdated(amount);
    }

    function setCooldown(uint256 seconds_) external onlyOwner {
        cooldown = seconds_;
        emit CooldownUpdated(seconds_);
    }

    /// @notice Withdraw all remaining funds back to owner.
    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        (bool ok, ) = owner.call{value: bal}("");
        require(ok, "Withdraw failed");
        emit OwnerWithdraw(bal);
    }

    /// @notice Accept ADI deposits.
    receive() external payable {
        emit Funded(msg.sender, msg.value);
    }
}
