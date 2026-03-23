/**
 * Direct ethers.js deployment script for ADI Chain.
 *
 * Use this instead of `hardhat ignition deploy` — the ADI testnet RPC does
 * not support the `pending` block tag that Ignition's nonce-sync requires.
 *
 * Usage:
 *   node deploy.mjs                            # deploys Counter.sol
 *   CONTRACT=Voting node deploy.mjs            # deploys Voting.sol
 */

import { ethers } from "ethers";
import { readFileSync } from "fs";
import { config } from "dotenv";

config();

const CONTRACT_NAME = process.env.CONTRACT ?? "Counter";
const NETWORK = process.env.NETWORK ?? "testnet";

const RPC_URLS = {
  testnet: "https://rpc.ab.testnet.adifoundation.ai",
  mainnet: "https://rpc.ab.mainnet.adifoundation.ai",
};

const EXPLORER_URLS = {
  testnet: "https://explorer.ab.testnet.adifoundation.ai",
  mainnet: "https://explorer.ab.mainnet.adifoundation.ai",
};

const PRIVATE_KEY_ENV = NETWORK === "mainnet" ? "MAINNET_PRIVATE_KEY" : "TESTNET_PRIVATE_KEY";
const rawKey = process.env[PRIVATE_KEY_ENV];

if (!rawKey) {
  console.error(`\n  Error: ${PRIVATE_KEY_ENV} is not set in .env\n`);
  process.exit(1);
}

const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;

// Load compiled artifact
const artifactPath = `./artifacts/contracts/${CONTRACT_NAME}.sol/${CONTRACT_NAME}.json`;
let artifact;
try {
  artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
} catch {
  console.error(`\n  Error: Artifact not found at ${artifactPath}`);
  console.error("  Run 'npm run compile' first.\n");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URLS[NETWORK]);
const wallet = new ethers.Wallet(privateKey, provider);

console.log(`\n  Deploying ${CONTRACT_NAME} to ADI ${NETWORK}...`);
console.log(`  Deployer: ${wallet.address}`);

const balance = await provider.getBalance(wallet.address);
console.log(`  Balance:  ${ethers.formatEther(balance)} ADI\n`);

if (balance === 0n) {
  console.error("  Error: Deployer has zero balance. Get testnet ADI from:");
  console.error("  http://faucet.ab.testnet.adifoundation.ai\n");
  process.exit(1);
}

const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
const contract = await factory.deploy();
const tx = contract.deploymentTransaction();
console.log(`  Tx hash: ${tx?.hash}`);

await contract.waitForDeployment();
const address = await contract.getAddress();

console.log(`\n  ✔ ${CONTRACT_NAME} deployed to: ${address}`);
console.log(`  Explorer: ${EXPLORER_URLS[NETWORK]}/address/${address}\n`);
