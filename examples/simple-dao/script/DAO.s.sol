// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {DAO} from "../src/DAO.sol";

/**
 * @notice Deploy the simple-dao example dApp to ADI Chain Testnet.
 *
 * Prerequisites:
 *   export TESTNET_PRIVATE_KEY="0x..."    (bash / WSL2)
 *   $env:TESTNET_PRIVATE_KEY="0x..."     (PowerShell)
 *
 * Deploy:
 *   forge script script/DAO.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 *
 * After deployment: copy the printed contract address into frontend/index.html
 *
 * Fund the treasury:
 *   cast send <DAO_ADDRESS> --value 0.1ether \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --private-key $TESTNET_PRIVATE_KEY
 */
contract DAOScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        DAO dao = new DAO(
            "ADI Community DAO",   // name shown in frontend
            3 days,                // voting window (3 days per proposal)
            20                     // quorum: 20% of members must vote
        );

        console.log("==========================================================");
        console.log("DAO deployed on ADI Testnet!");
        console.log("Address:", address(dao));
        console.log("Name:", dao.name());
        console.log("Voting duration: 3 days");
        console.log("Quorum: 20%");
        console.log("==========================================================");
        console.log("Next steps:");
        console.log("1. Open frontend/index.html and set CONTRACT_ADDRESS to:");
        console.log(address(dao));
        console.log("2. Fund the treasury with test ADI:");
        console.log("   cast send", address(dao), "--value 0.05ether \\");
        console.log("     --rpc-url https://rpc.ab.testnet.adifoundation.ai \\");
        console.log("     --private-key $TESTNET_PRIVATE_KEY");
        console.log("Explorer: https://explorer.ab.testnet.adifoundation.ai/address/", address(dao));

        vm.stopBroadcast();
    }
}
