// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";

/**
 * @notice Deploy the NFT example dApp to ADI Chain Testnet.
 *
 * Prerequisites:
 *   export TESTNET_PRIVATE_KEY="0x..."    (bash / WSL2)
 *   $env:TESTNET_PRIVATE_KEY="0x..."     (PowerShell)
 *
 * Deploy:
 *   forge script script/NFT.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 *
 * After deployment: copy the printed contract address into frontend/index.html
 */
contract NFTScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        NFT nft = new NFT(
            "ADI Chain Collectibles",   // name
            "ADIC",                      // symbol
            "https://metadata.example.com/adic/", // baseTokenURI (replace with your IPFS/API)
            1000,                        // maxSupply
            0                            // mintPrice in ADI wei (0 = free mint)
        );

        console.log("==========================================================");
        console.log("NFT contract deployed on ADI Testnet!");
        console.log("Address:", address(nft));
        console.log("Name:", nft.name());
        console.log("Symbol:", nft.symbol());
        console.log("Max supply:", nft.maxSupply());
        console.log("==========================================================");
        console.log("Next: open frontend/index.html and set CONTRACT_ADDRESS to:");
        console.log(address(nft));
        console.log("Explorer: https://explorer.ab.testnet.adifoundation.ai/address/", address(nft));

        vm.stopBroadcast();
    }
}
