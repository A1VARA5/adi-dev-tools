// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Voting} from "../src/Voting.sol";

/**
 * @notice Deploy Voting contract to ADI Chain.
 *
 * Usage:
 *   forge script script/Voting.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast --private-key $TESTNET_PRIVATE_KEY
 */
contract VotingScript is Script {
    function setUp() public {}

    function run() public {
        string[] memory proposalDescriptions = new string[](3);
        proposalDescriptions[0] = "Option A";
        proposalDescriptions[1] = "Option B";
        proposalDescriptions[2] = "Option C";

        vm.startBroadcast();

        Voting voting = new Voting("My First ADI Chain Vote", proposalDescriptions);
        console.log("Voting deployed at:", address(voting));

        vm.stopBroadcast();
    }
}
