/**
 * @adi-devtools/sdk
 *
 * JavaScript/TypeScript SDK for ADI Chain.
 * Provides pre-configured network constants, ethers.js / viem providers,
 * and MetaMask helpers so you don't have to copy-paste RPC URLs and chain IDs.
 *
 * @example
 * import { ADI_TESTNET, getADIProvider, switchToADITestnet } from "@adi-devtools/sdk";
 *
 * const provider = getADIProvider("testnet");
 * const block = await provider.getBlockNumber();
 */

// Network constants
export {
  ADI_TESTNET,
  ADI_MAINNET,
  AA_ENTRY_POINTS,
  L1_TOKEN_CONTRACTS,
  type ADINetwork,
} from "./chains.js";

// ethers.js / viem providers
export {
  getADIProvider,
  getADITestnetProvider,
  getADIMainnetProvider,
  getBrowserProvider,
  getADISigner,
  getADIViemClient,
} from "./provider.js";

// Viem chain definitions (for wagmi/viem users)
export { adiTestnet, adiMainnet } from "./viem-chains.js";

// MetaMask / wallet helpers
export {
  switchToADITestnet,
  switchToADIMainnet,
  addADITestnet,
  addADIMainnet,
  connectWallet,
  getWalletChainId,
  isOnADITestnet,
  isOnADIMainnet,
} from "./metamask.js";
