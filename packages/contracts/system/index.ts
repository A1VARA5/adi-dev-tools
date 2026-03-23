/**
 * @adi-devtools/contracts/system
 *
 * System contract addresses and ABIs for ADI Chain.
 *
 * These are identical on every ZKsync-based chain (testnet and mainnet).
 * Sourced from: github.com/ADI-Foundation-Labs/ADI-Stack-Contracts
 *
 * @example
 * ```typescript
 * import {
 *   BASE_TOKEN_ADDRESS,
 *   BASE_TOKEN_ABI,
 *   SYSTEM_CONTEXT_ADDRESS,
 *   SYSTEM_CONTEXT_ABI,
 *   NONCE_HOLDER_ADDRESS,
 *   NONCE_HOLDER_ABI,
 *   ENTRYPOINT_V07_ADDRESS,
 * } from "@adi-devtools/contracts/system";
 *
 * // Read current ADI gas price from the chain
 * const ctx = new ethers.Contract(SYSTEM_CONTEXT_ADDRESS, SYSTEM_CONTEXT_ABI, provider);
 * const gasPrice = await ctx.gasPrice();
 *
 * // Encode paymaster input for a sponsored transaction
 * const iface = new ethers.Interface(PAYMASTER_FLOW_ABI);
 * const paymasterInput = iface.encodeFunctionData("general", ["0x"]);
 * ```
 */

export * from "./addresses";
export * from "./abis";
