import { defineConfig } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";

export default defineConfig({
  plugins: [adiNetworkPlugin],
  solidity: "0.8.24",
  networks: {
    // hardhat-adi-network plugin injects the RPC URL and chainId.
    // You only need to add accounts here.
    "adi-testnet": {
      accounts: process.env.TESTNET_PRIVATE_KEY ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    // MAINNET_START
    "adi-mainnet": {
      accounts: process.env.MAINNET_PRIVATE_KEY ? [process.env.MAINNET_PRIVATE_KEY] : [],
    },
    // MAINNET_END
  },
  ignition: {
    requiredConfirmations: 1,
  },
});

