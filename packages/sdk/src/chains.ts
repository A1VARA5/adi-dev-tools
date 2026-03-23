/**
 * ADI Chain network constants — sourced directly from
 * https://docs.adi.foundation/how-to-start/adi-network-mainnet-details
 * https://docs.adi.foundation/how-to-start/adi-network-testnet-details
 */

export interface ADINetwork {
  /** Human-readable name shown in wallets */
  name: string;
  /** Numeric chain ID */
  chainId: number;
  /** Chain ID encoded as 0x-prefixed hex (for wallet_addEthereumChain) */
  chainIdHex: string;
  /** JSON-RPC endpoint */
  rpcUrl: string;
  /** Block explorer base URL */
  explorerUrl: string;
  /** Faucet URL (testnet only) */
  faucetUrl?: string;
  /** Bridge URL */
  bridgeUrl?: string;
  /** Native currency metadata */
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

/**
 * ADI Network Mainnet
 * Chain ID: 36900 | RPC: https://rpc.adifoundation.ai
 */
export const ADI_MAINNET: ADINetwork = {
  name: "ADI Network",
  chainId: 36900,
  chainIdHex: "0x9024",
  rpcUrl: "https://rpc.adifoundation.ai",
  explorerUrl: "https://explorer.adifoundation.ai",
  bridgeUrl: "https://bridge.adifoundation.ai",
  nativeCurrency: {
    name: "ADI",
    symbol: "ADI",
    decimals: 18,
  },
} as const;

/**
 * ADI Network AB Testnet
 * Chain ID: 99999 | RPC: https://rpc.ab.testnet.adifoundation.ai
 */
export const ADI_TESTNET: ADINetwork = {
  name: "ADI Network AB Testnet",
  chainId: 99999,
  chainIdHex: "0x1869F",
  rpcUrl: "https://rpc.ab.testnet.adifoundation.ai",
  explorerUrl: "https://explorer.ab.testnet.adifoundation.ai",
  faucetUrl: "http://faucet.ab.testnet.adifoundation.ai",
  bridgeUrl: "https://bridge.ab.testnet.adifoundation.ai",
  nativeCurrency: {
    name: "ADI",
    symbol: "ADI",
    decimals: 18,
  },
} as const;

/**
 * ERC-4337 Account Abstraction EntryPoints deployed on ADI Chain.
 * Source: https://docs.adi.foundation/how-to-start/gas-abstraction-and-account-abstraction
 *
 * Note: ERC-7702 is NOT supported. Bundler safe-mode doesn't work
 * (missing debug_traceCall on the public RPC).
 */
export const AA_ENTRY_POINTS = {
  v07: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
  v08: "0x4337084d9e255ff0702461cf8895ce9e3b5ff108",
} as const;

/**
 * Known L1 token contract addresses.
 */
export const L1_TOKEN_CONTRACTS = {
  /** ADI token on Ethereum Mainnet (L1) */
  mainnet: "0x8b1484d57abbe239bb280661377363b03c89caea",
  /** ADI token on Ethereum Sepolia (L1 for testnet) */
  sepolia: "0x2a98b46fe31ba8be05ef1ce3d36e1f80db04190d",
} as const;
