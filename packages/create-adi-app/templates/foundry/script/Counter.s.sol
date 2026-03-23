// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

/**
 * @notice Deploy Counter to ADI Chain.
 *
 * Usage:
 *   forge script script/Counter.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast --private-key $TESTNET_PRIVATE_KEY
 */
contract CounterScript is Script {
    Counter public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new Counter();
        console.log("Counter deployed at:", address(counter));

        vm.stopBroadcast();
    }
}
