import { ADI_MAINNET, ADI_TESTNET, type ADINetwork } from "./chains.js";

// Minimal type for the wallet_addEthereumChain parameter
interface AddEthereumChainParams {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: string[];
}

function buildChainParams(net: ADINetwork): AddEthereumChainParams {
  return {
    chainId: net.chainIdHex,
    chainName: net.name,
    rpcUrls: [net.rpcUrl],
    nativeCurrency: net.nativeCurrency,
    blockExplorerUrls: [net.explorerUrl],
  };
}

function getEthereum(): typeof window.ethereum {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "No injected wallet found. Install MetaMask or another EVM wallet."
    );
  }
  return window.ethereum;
}

/**
 * Asks MetaMask (or any EIP-1193 wallet) to switch to ADI Testnet.
 * If the chain is not yet in the wallet it will call wallet_addEthereumChain first.
 *
 * @example
 * await switchToADITestnet();
 */
export async function switchToADITestnet(): Promise<void> {
  const ethereum = getEthereum();
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ADI_TESTNET.chainIdHex }],
    });
  } catch (switchError: unknown) {
    // Error code 4902 = chain not yet added to wallet
    if ((switchError as { code?: number }).code === 4902) {
      await addADITestnet();
    } else {
      throw switchError;
    }
  }
}

/**
 * Asks MetaMask to switch to ADI Mainnet.
 * If the chain is not yet in the wallet it will call wallet_addEthereumChain first.
 *
 * @example
 * await switchToADIMainnet();
 */
export async function switchToADIMainnet(): Promise<void> {
  const ethereum = getEthereum();
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ADI_MAINNET.chainIdHex }],
    });
  } catch (switchError: unknown) {
    if ((switchError as { code?: number }).code === 4902) {
      await addADIMainnet();
    } else {
      throw switchError;
    }
  }
}

/**
 * Adds ADI Testnet to the connected wallet via wallet_addEthereumChain.
 * Does nothing if the chain is already present.
 *
 * @example
 * await addADITestnet();
 */
export async function addADITestnet(): Promise<void> {
  const ethereum = getEthereum();
  await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [buildChainParams(ADI_TESTNET)],
  });
}

/**
 * Adds ADI Mainnet to the connected wallet via wallet_addEthereumChain.
 *
 * @example
 * await addADIMainnet();
 */
export async function addADIMainnet(): Promise<void> {
  const ethereum = getEthereum();
  await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [buildChainParams(ADI_MAINNET)],
  });
}

/**
 * Requests the user's wallet to connect and returns the first account address.
 *
 * @example
 * const address = await connectWallet();
 * console.log("Connected:", address);
 */
export async function connectWallet(): Promise<string> {
  const ethereum = getEthereum();
  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts returned from wallet.");
  }
  return accounts[0];
}

/**
 * Returns the current chain ID from the injected wallet (numeric).
 *
 * @example
 * const chainId = await getWalletChainId(); // e.g. 99999
 */
export async function getWalletChainId(): Promise<number> {
  const ethereum = getEthereum();
  const chainIdHex = (await ethereum.request({
    method: "eth_chainId",
  })) as string;
  return parseInt(chainIdHex, 16);
}

/**
 * Returns true if the connected wallet is currently on ADI Testnet.
 */
export async function isOnADITestnet(): Promise<boolean> {
  const chainId = await getWalletChainId();
  return chainId === ADI_TESTNET.chainId;
}

/**
 * Returns true if the connected wallet is currently on ADI Mainnet.
 */
export async function isOnADIMainnet(): Promise<boolean> {
  const chainId = await getWalletChainId();
  return chainId === ADI_MAINNET.chainId;
}
