// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Faucet} from "../src/Faucet.sol";

/**
 * @notice Deploy the ADI testnet faucet.
 *
 * Prerequisites:
 *   export TESTNET_PRIVATE_KEY="0x..."    (bash / WSL2)
 *   $env:TESTNET_PRIVATE_KEY="0x..."     (PowerShell)
 *
 * Deploy:
 *   forge script script/Faucet.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 *
 * Then fund:
 *   cast send <ADDRESS> --value 10ether \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --private-key $TESTNET_PRIVATE_KEY
 */
contract FaucetScript is Script {
    function setUp() public {}

    function run() public {
        // 0.5 ADI per claim, 24-hour cooldown
        uint256 dripAmount  = 0.5 ether;
        uint256 cooldown    = 24 hours;

        vm.startBroadcast();

        Faucet faucet = new Faucet(dripAmount, cooldown);

        console.log("==========================================================");
        console.log("Faucet deployed on ADI Testnet!");
        console.log("Address:     ", address(faucet));
        console.log("Drip amount: 0.5 ADI");
        console.log("Cooldown:    24 hours");
        console.log("==========================================================");
        console.log("Next: fund the faucet with ADI:");
        console.log("  cast send", address(faucet), "--value 10ether \\");
        console.log("    --rpc-url https://rpc.ab.testnet.adifoundation.ai \\");
        console.log("    --private-key $TESTNET_PRIVATE_KEY");
        console.log("Then set CONTRACT_ADDRESS in frontend/index.html to:");
        console.log(address(faucet));
        console.log("Explorer: https://explorer.ab.testnet.adifoundation.ai/address/", address(faucet));

        vm.stopBroadcast();
    }
}
