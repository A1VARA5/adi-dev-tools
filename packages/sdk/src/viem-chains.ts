/**
 * Viem chain definitions for ADI Chain.
 * Use with wagmi or viem directly.
 *
 * @example
 * import { adiTestnet } from "@adi-devtools/sdk/viem";
 * import { createPublicClient, http } from "viem";
 *
 * const client = createPublicClient({ chain: adiTestnet, transport: http() });
 */

// These types mirror viem's Chain interface so consumers don't need viem installed
// to import the constants — only when actually calling viem functions.

export const adiTestnet = {
  id: 99999,
  name: "ADI Network AB Testnet",
  nativeCurrency: { name: "ADI", symbol: "ADI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ab.testnet.adifoundation.ai"] },
    public: { http: ["https://rpc.ab.testnet.adifoundation.ai"] },
  },
  blockExplorers: {
    default: {
      name: "ADI Explorer",
      url: "https://explorer.ab.testnet.adifoundation.ai",
    },
  },
  testnet: true,
} as const;

export const adiMainnet = {
  id: 36900,
  name: "ADI Network",
  nativeCurrency: { name: "ADI", symbol: "ADI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.adifoundation.ai"] },
    public: { http: ["https://rpc.adifoundation.ai"] },
  },
  blockExplorers: {
    default: {
      name: "ADI Explorer",
      url: "https://explorer.adifoundation.ai",
    },
  },
  testnet: false,
} as const;
