// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Faucet
 * @notice Testnet ADI faucet — drips a fixed amount of native ADI to callers on a cooldown.
 *
 * Deploy:
 *   forge script script/Faucet.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 *
 * After deploying, fund the contract:
 *   cast send <FAUCET_ADDRESS> --value 10ether \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --private-key $TESTNET_PRIVATE_KEY
 */
contract Faucet {
    address public immutable owner;

    uint256 public dripAmount; // native ADI per claim (wei)
    uint256 public cooldown;   // seconds between claims per address

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

    /// @notice Claim native ADI tokens. Subject to per-address cooldown.
    function drip() external {
        uint256 available = lastClaimTime[msg.sender] + cooldown;
        if (block.timestamp < available) revert CooldownActive(available);
        if (address(this).balance < dripAmount) revert InsufficientFaucetBalance();

        lastClaimTime[msg.sender] = block.timestamp;
        (bool ok, ) = msg.sender.call{value: dripAmount}("");
        require(ok, "Transfer failed");
        emit Dripped(msg.sender, dripAmount);
    }

    /// @notice Returns seconds until next claim for a user (0 = claimable now).
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 available = lastClaimTime[user] + cooldown;
        if (block.timestamp >= available) return 0;
        return available - block.timestamp;
    }

    // ─── Owner ────────────────────────────────────────────────────────────────

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
