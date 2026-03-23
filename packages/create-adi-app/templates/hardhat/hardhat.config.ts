import "hardhat-adi-network"; // auto-injects adi-testnet and adi-mainnet

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
  solidity: "0.8.24",
  networks: {
    // hardhat-adi-network plugin already adds adi-testnet and adi-mainnet.
    // You only need to set your private key here:
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
};

export default config;
