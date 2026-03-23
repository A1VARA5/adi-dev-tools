/**
 * hardhat-adi-network
 *
 * A Hardhat plugin that automatically injects ADI testnet and mainnet
 * network configurations. Install once, then use --network adi-testnet
 * or --network adi-mainnet in every project.
 *
 * Usage in hardhat.config.ts:
 *
 *   import "hardhat-adi-network";
 *
 *   // That's it. The following networks are now available:
 *   //   npx hardhat compile --network adi-testnet
 *   //   npx hardhat ignition deploy ... --network adi-testnet
 *   //   npx hardhat ignition deploy ... --network adi-mainnet
 *
 * You can still override any setting manually in your config:
 *
 *   networks: {
 *     "adi-testnet": {
 *       ...adiTestnetConfig,
 *       accounts: [process.env.PRIVATE_KEY!],
 *     }
 *   }
 */

import { extendConfig } from "hardhat/config";
import { ADI_TESTNET, ADI_MAINNET } from "@adi-foundation/sdk";

// Augment Hardhat's type system so TypeScript knows about our network names
import "hardhat/types/config";

declare module "hardhat/types/config" {
  interface HardhatNetworksUserConfig {
    "adi-testnet"?: HttpNetworkUserConfig;
    "adi-mainnet"?: HttpNetworkUserConfig;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HttpNetworkUserConfig = any;

extendConfig((config, userConfig) => {
  // Build base configs from the SDK constants
  const testnetBase: HttpNetworkUserConfig = {
    type: "http",
    chainType: "generic",
    url: ADI_TESTNET.rpcUrl,
    chainId: ADI_TESTNET.chainId,
  };

  const mainnetBase: HttpNetworkUserConfig = {
    type: "http",
    chainType: "generic",
    url: ADI_MAINNET.rpcUrl,
    chainId: ADI_MAINNET.chainId,
  };

  // Merge: user config overrides our defaults, but only if they've defined the key
  if (!config.networks["adi-testnet"]) {
    config.networks["adi-testnet"] = {
      ...testnetBase,
      ...(userConfig.networks?.["adi-testnet"] ?? {}),
    };
  }

  if (!config.networks["adi-mainnet"]) {
    config.networks["adi-mainnet"] = {
      ...mainnetBase,
      ...(userConfig.networks?.["adi-mainnet"] ?? {}),
    };
  }
});

// Re-export constants so plugin consumers can import from one place
export { ADI_TESTNET, ADI_MAINNET } from "@adi-foundation/sdk";
