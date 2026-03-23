// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Voting} from "../src/Voting.sol";

/**
 * @notice Deploy the Voting example dApp to ADI Chain Testnet.
 *
 * Prerequisites:
 *   export TESTNET_PRIVATE_KEY="0x..."    (bash / WSL2)
 *   $env:TESTNET_PRIVATE_KEY="0x..."     (PowerShell)
 *
 * Deploy:
 *   forge script script/Voting.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 *
 * After deployment: copy the printed contract address into frontend/index.html
 */
contract VotingScript is Script {
    function setUp() public {}

    function run() public {
        // Define your proposals here
        string[] memory proposalDescriptions = new string[](3);
        proposalDescriptions[0] = "Build the SDK first";
        proposalDescriptions[1] = "Build the Hardhat plugin first";
        proposalDescriptions[2] = "Build example dApps first";

        vm.startBroadcast();

        Voting voting = new Voting(
            "ADI Developer Tools — What Should We Build First?",
            proposalDescriptions
        );

        console.log("==========================================================");
        console.log("Voting contract deployed on ADI Testnet!");
        console.log("Address:", address(voting));
        console.log("Title:", voting.title());
        console.log("==========================================================");
        console.log("Next: open frontend/index.html and set CONTRACT_ADDRESS to:");
        console.log(address(voting));
        console.log("Explorer: https://explorer.ab.testnet.adifoundation.ai/address/", address(voting));

        vm.stopBroadcast();
    }
}
