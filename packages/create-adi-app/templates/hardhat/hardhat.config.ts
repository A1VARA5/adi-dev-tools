import { vars } from "hardhat/config";
import "hardhat-adi-network"; // auto-injects adi-testnet and adi-mainnet

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
  solidity: "0.8.24",
  networks: {
    // hardhat-adi-network plugin already adds adi-testnet and adi-mainnet.
    // You only need to set your private key here:
    "adi-testnet": {
      accounts: [vars.get("TESTNET_PRIVATE_KEY", "")],
    },
    // MAINNET_START
    "adi-mainnet": {
      accounts: [vars.get("MAINNET_PRIVATE_KEY", "")],
    },
    // MAINNET_END
  },
  ignition: {
    requiredConfirmations: 1,
  },
};

export default config;
