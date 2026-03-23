// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ADIVoting} from "../src/ADIVoting.sol";
import {GaslessPaymaster} from "../src/GaslessPaymaster.sol";

/**
 * @notice Deploy ADIVoting + GaslessPaymaster to ADI Chain.
 *
 * Usage:
 *   forge script script/Deploy.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast --private-key $TESTNET_PRIVATE_KEY
 *
 * Windows PowerShell:
 *   $env:TESTNET_PRIVATE_KEY="0x..."
 *   forge script script/Deploy.s.sol `
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai `
 *     --broadcast --private-key $env:TESTNET_PRIVATE_KEY
 *
 * After deploying:
 *   1. Copy VOTING_ADDRESS and PAYMASTER_ADDRESS into .env
 *   2. Fund the paymaster (it needs ADI to sponsor gas):
 *        cast send <PAYMASTER_ADDRESS> --value 0.05ether \
 *          --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *          --private-key $TESTNET_PRIVATE_KEY
 *   3. Paste both addresses into frontend/index.html
 *   4. Serve: npx serve frontend
 */
contract Deploy is Script {
    // ─── Default poll configuration ───────────────────────────────────────────
    // Override by setting POLL_TITLE, PROPOSAL_0, PROPOSAL_1, PROPOSAL_2 in .env

    string constant DEFAULT_TITLE = "Which ADI feature should ship next?";
    string constant DEFAULT_P0    = "Native mobile SDK";
    string constant DEFAULT_P1    = "WebAssembly runtime";
    string constant DEFAULT_P2    = "Cross-chain bridge UI";

    /// @dev Amount of ADI to send to the paymaster on deploy (0.05 ADI = 50_000 gas sponsorships at ~1000 gwei)
    uint256 constant PAYMASTER_INITIAL_FUNDING = 0.05 ether;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("TESTNET_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // ── Read optional env overrides ────────────────────────────────────────
        string memory title = _envOr("POLL_TITLE", DEFAULT_TITLE);
        string[] memory proposals = new string[](3);
        proposals[0] = _envOr("PROPOSAL_0", DEFAULT_P0);
        proposals[1] = _envOr("PROPOSAL_1", DEFAULT_P1);
        proposals[2] = _envOr("PROPOSAL_2", DEFAULT_P2);

        // ── Pre-flight check ──────────────────────────────────────────────────
        uint256 balance = deployer.balance;
        console.log("Deployer:", deployer);
        console.log("Balance: ", balance / 1e18, "ADI");
        require(balance >= PAYMASTER_INITIAL_FUNDING + 0.01 ether, "Insufficient balance — get testnet ADI from faucet: http://faucet.ab.testnet.adifoundation.ai");

        vm.startBroadcast(deployerPrivateKey);

        // ── Deploy voting contract ─────────────────────────────────────────────
        ADIVoting voting = new ADIVoting(title, proposals);
        console.log("\n[1/3] ADIVoting deployed:");
        console.log("      Address:", address(voting));
        console.log("      Title:  ", title);
        console.log("      Proposals:", proposals[0], "/", proposals[1], "/", proposals[2]);

        // ── Deploy paymaster ──────────────────────────────────────────────────
        GaslessPaymaster paymaster = new GaslessPaymaster(address(voting));
        console.log("\n[2/3] GaslessPaymaster deployed:");
        console.log("      Address:           ", address(paymaster));
        console.log("      Sponsored contract:", address(voting));

        // ── Fund the paymaster ────────────────────────────────────────────────
        (bool sent,) = payable(address(paymaster)).call{value: PAYMASTER_INITIAL_FUNDING}("");
        require(sent, "Failed to fund paymaster");
        console.log("\n[3/3] Paymaster funded with", PAYMASTER_INITIAL_FUNDING / 1e18, "ADI");

        vm.stopBroadcast();

        // ── Summary ───────────────────────────────────────────────────────────
        console.log("\n─────────────────────────────────────────────────────");
        console.log(" DEPLOYMENT COMPLETE");
        console.log("─────────────────────────────────────────────────────");
        console.log(" VOTING_ADDRESS  =", address(voting));
        console.log(" PAYMASTER_ADDRESS =", address(paymaster));
        console.log("─────────────────────────────────────────────────────");
        console.log(" Next steps:");
        console.log("   1. Paste both addresses into frontend/index.html");
        console.log("   2. npx serve frontend");
        console.log("   3. Open http://localhost:3000");
        console.log("   4. Vote gaslessly — users pay 0 ADI!");
        console.log("─────────────────────────────────────────────────────");
    }

    function _envOr(string memory key, string memory defaultVal) internal view returns (string memory) {
        try vm.envString(key) returns (string memory val) {
            if (bytes(val).length > 0) return val;
        } catch {}
        return defaultVal;
    }
}
