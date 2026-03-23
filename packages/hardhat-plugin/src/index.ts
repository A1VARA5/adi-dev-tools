/**
 * hardhat-adi-network - Hardhat 3 plugin
 *
 * Automatically injects ADI testnet and mainnet network configs.
 *
 * Usage in hardhat.config.ts:
 *
 *   import { defineConfig } from "hardhat/config";
 *   import adiNetworkPlugin from "hardhat-adi-network";
 *
 *   export default defineConfig({
 *     plugins: [adiNetworkPlugin],
 *     networks: {
 *       "adi-testnet": {
 *         accounts: [process.env.TESTNET_PRIVATE_KEY],
 *       },
 *     },
 *   });
 */

import type { HardhatPlugin } from "hardhat/types/plugins";
import { ADI_TESTNET, ADI_MAINNET } from "@adi-devtools/sdk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (config: any, next: any) => Promise<any>;

const plugin: HardhatPlugin = {
  id: "hardhat-adi-network",
  hookHandlers: {
    // Matches the dynamic-import module shape:
    //   { default: HookHandlerCategoryFactory<"config"> }
    // where HookHandlerCategoryFactory = () => Promise<Partial<ConfigHooks>>
    config: async () => ({
      default: async () => ({
        extendUserConfig: (async (userConfig: any, next: any) => {
          const resolved = await next(userConfig);
          return {
            ...resolved,
            networks: {
              // Preserve other user-defined networks
              ...Object.fromEntries(
                Object.entries(resolved.networks ?? {}).filter(
                  ([k]: [string, unknown]) =>
                    k !== "adi-testnet" && k !== "adi-mainnet"
                )
              ),
              // ADI Testnet: plugin defaults merged with user overrides
              "adi-testnet": {
                type: "http",
                url: ADI_TESTNET.rpcUrl,
                chainId: ADI_TESTNET.chainId,
                ...(resolved.networks?.["adi-testnet"] ?? {}),
              },
              // ADI Mainnet: plugin defaults merged with user overrides
              "adi-mainnet": {
                type: "http",
                url: ADI_MAINNET.rpcUrl,
                chainId: ADI_MAINNET.chainId,
                ...(resolved.networks?.["adi-mainnet"] ?? {}),
              },
            },
          };
        }) as AnyFn,
      }),
    }),
  },
};

export default plugin;

// Re-export constants so plugin consumers can import from one place
export { ADI_TESTNET, ADI_MAINNET } from "@adi-devtools/sdk";