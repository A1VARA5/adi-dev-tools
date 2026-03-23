import { defineConfig } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";
import ignitionPlugin from "@nomicfoundation/hardhat-ignition";

// Normalize private keys: Hardhat requires 0x prefix
function pk(envVar: string | undefined): string[] {
  if (!envVar) return [];
  return [envVar.startsWith("0x") ? envVar : `0x${envVar}`];
}

export default defineConfig({
  plugins: [adiNetworkPlugin, ignitionPlugin],
  solidity: "0.8.24",
  networks: {
    // hardhat-adi-network plugin injects the RPC URL and chainId.
    // You only need to add accounts here.
    "adi-testnet": {
      accounts: pk(process.env.TESTNET_PRIVATE_KEY),
    },
    // MAINNET_START
    "adi-mainnet": {
      accounts: pk(process.env.MAINNET_PRIVATE_KEY),
    },
    // MAINNET_END
  },
  ignition: {
    requiredConfirmations: 1,
  },
});

