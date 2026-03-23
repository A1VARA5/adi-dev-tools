import { ethers } from "ethers";
import { ADI_MAINNET, ADI_TESTNET, type ADINetwork } from "./chains.js";

/**
 * Returns a read-only ethers.js JsonRpcProvider connected to ADI Chain.
 *
 * @param network - "testnet" (default) | "mainnet" | a custom ADINetwork object
 *
 * @example
 * const provider = getADIProvider();                    // testnet
 * const provider = getADIProvider("mainnet");           // mainnet
 * const block = await provider.getBlockNumber();
 */
export function getADIProvider(
  network: "testnet" | "mainnet" | ADINetwork = "testnet"
): ethers.JsonRpcProvider {
  const net =
    network === "testnet"
      ? ADI_TESTNET
      : network === "mainnet"
        ? ADI_MAINNET
        : network;

  return new ethers.JsonRpcProvider(net.rpcUrl);
}

/**
 * Returns a read-only ethers.js provider for ADI Testnet.
 * Convenience wrapper — same as getADIProvider("testnet").
 */
export function getADITestnetProvider(): ethers.JsonRpcProvider {
  return getADIProvider("testnet");
}

/**
 * Returns a read-only ethers.js provider for ADI Mainnet.
 * Convenience wrapper — same as getADIProvider("mainnet").
 */
export function getADIMainnetProvider(): ethers.JsonRpcProvider {
  return getADIProvider("mainnet");
}

/**
 * Returns an ethers.js BrowserProvider wrapping window.ethereum (MetaMask / injected wallet).
 * Throws if no injected wallet is detected.
 *
 * @example
 * const provider = getBrowserProvider();
 * const signer = await provider.getSigner();
 * const contract = new ethers.Contract(address, abi, signer);
 */
export function getBrowserProvider(): ethers.BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "No injected wallet found. Install MetaMask or another EVM wallet."
    );
  }
  return new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
}

/**
 * Returns a signer from the browser wallet after requesting account access.
 *
 * @example
 * const signer = await getADISigner();
 * const tx = await contract.connect(signer).myMethod();
 */
export async function getADISigner(): Promise<ethers.JsonRpcSigner> {
  const provider = getBrowserProvider();
  return provider.getSigner();
}

/**
 * Returns a viem PublicClient for ADI Chain if viem is installed.
 * Viem is an optional peer dependency — this will throw at runtime if not installed.
 *
 * @example
 * const client = getADIViemClient();
 * const block = await client.getBlockNumber();
 */
export function getADIViemClient(network: "testnet" | "mainnet" = "testnet") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createPublicClient, http } = require("viem") as typeof import("viem");
  const net = network === "testnet" ? ADI_TESTNET : ADI_MAINNET;
  return createPublicClient({
    transport: http(net.rpcUrl),
  });
}
