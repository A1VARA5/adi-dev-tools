/**
 * ADI Chain system contract addresses.
 *
 * These are identical on every ZKsync-based chain (testnet and mainnet).
 * Source: ADI-Stack-Contracts/system-contracts/contracts/Constants.sol
 *
 * System contracts live in the kernel space (addresses < 0xffff).
 * User-space predeploys live at 0x10000+.
 */

// ─── Kernel-space system contracts (0x8000 ... 0x8015) ─────────────────────

/** The formal address of the bootloader (sender for bootloader-initiated calls). */
export const BOOTLOADER_FORMAL_ADDRESS =
  "0x0000000000000000000000000000000000008001" as const;

/** Stores contract bytecode hashes for every deployed account. */
export const ACCOUNT_CODE_STORAGE_ADDRESS =
  "0x0000000000000000000000000000000000008002" as const;

/** Stores transaction nonces and deployment nonces for all accounts. */
export const NONCE_HOLDER_ADDRESS =
  "0x0000000000000000000000000000000000008003" as const;

/** Tracks bytecode hashes that are known to the sequencer. */
export const KNOWN_CODES_STORAGE_ADDRESS =
  "0x0000000000000000000000000000000000008004" as const;

/** Stores immutable variables for contracts. */
export const IMMUTABLE_SIMULATOR_ADDRESS =
  "0x0000000000000000000000000000000000008005" as const;

/** Responsible for deploying all smart contracts on ADI Chain. */
export const CONTRACT_DEPLOYER_ADDRESS =
  "0x0000000000000000000000000000000000008006" as const;

/** Can force-deploy bytecode to any address during protocol upgrades. */
export const FORCE_DEPLOYER_ADDRESS =
  "0x0000000000000000000000000000000000008007" as const;

/** Sends messages from ADI Chain (L2) to Ethereum (L1). */
export const L1_MESSENGER_ADDRESS =
  "0x0000000000000000000000000000000000008008" as const;

/** Handles msg.value forwarding in system calls. */
export const MSG_VALUE_SIMULATOR_ADDRESS =
  "0x0000000000000000000000000000000000008009" as const;

/**
 * The ADI gas token contract.
 * ADI Chain uses a custom gas token (ADI) instead of ETH.
 * Use this to read balances, handle withdrawals, etc.
 */
export const BASE_TOKEN_ADDRESS =
  "0x000000000000000000000000000000000000800a" as const;

/** Stores per-block and per-batch context (chainId, gasPrice, block number, timestamp…). */
export const SYSTEM_CONTEXT_ADDRESS =
  "0x000000000000000000000000000000000000800b" as const;

/** Utilities used by the bootloader for transaction validation. */
export const BOOTLOADER_UTILITIES_ADDRESS =
  "0x000000000000000000000000000000000000800c" as const;

/** Writes EVM-compatible events. */
export const EVENT_WRITER_ADDRESS =
  "0x000000000000000000000000000000000000800d" as const;

/** Compresses pubdata to reduce L1 data costs. */
export const COMPRESSOR_ADDRESS =
  "0x000000000000000000000000000000000000800e" as const;

/** Runs complex upgrade logic during protocol upgrades. */
export const COMPLEX_UPGRADER_ADDRESS =
  "0x000000000000000000000000000000000000800f" as const;

/** Native Keccak256 precompile (hardcoded address). */
export const KECCAK256_ADDRESS =
  "0x0000000000000000000000000000000000008010" as const;

/** Publishes pubdata chunks to L1. */
export const PUBDATA_CHUNK_PUBLISHER_ADDRESS =
  "0x0000000000000000000000000000000000008011" as const;

// ─── User-space predeploys (0x10000+) ────────────────────────────────────────

/** CREATE2 factory available in user space. */
export const L2_CREATE2_FACTORY_ADDRESS =
  "0x0000000000000000000000000000000000010000" as const;

/** BridgeHub — top-level bridge router for L2↔L1 communication. */
export const L2_BRIDGEHUB_ADDRESS =
  "0x0000000000000000000000000000000000010002" as const;

/** Asset Router — routes bridged assets between L1 and L2. */
export const L2_ASSET_ROUTER_ADDRESS =
  "0x0000000000000000000000000000000000010003" as const;

/** Native Token Vault — holds bridged token balances on L2. */
export const L2_NATIVE_TOKEN_VAULT_ADDRESS =
  "0x0000000000000000000000000000000000010004" as const;

/** Message Root — aggregates L2→L1 message tree roots. */
export const L2_MESSAGE_ROOT_ADDRESS =
  "0x0000000000000000000000000000000000010005" as const;

// ─── ERC-4337 EntryPoints ─────────────────────────────────────────────────────

/** ERC-4337 EntryPoint v0.7 */
export const ENTRYPOINT_V07_ADDRESS =
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as const;

/** ERC-4337 EntryPoint v0.8 */
export const ENTRYPOINT_V08_ADDRESS =
  "0x4337084d9e255ff0702461cf8895ce9e3b5ff108" as const;
