/**
 * ABIs for ADI Chain system contracts.
 *
 * Sourced from: ADI-Stack-Contracts/system-contracts/contracts/interfaces/
 *
 * These are compatible with ethers.js v6, viem, and wagmi.
 *
 * Usage:
 *   import { BASE_TOKEN_ABI, BASE_TOKEN_ADDRESS } from "@adi-devtools/contracts/system";
 *   const token = new ethers.Contract(BASE_TOKEN_ADDRESS, BASE_TOKEN_ABI, provider);
 */

// ─── IBaseToken ───────────────────────────────────────────────────────────────
/**
 * The ADI gas token interface.
 * ADI Chain uses ADI as its native gas token instead of ETH.
 *
 * ⚠️  TRAP: balanceOf(uint256) takes a uint256, NOT an address.
 *     Passing an address will silently return 0. This is a ZKsync-inherited quirk.
 *     For normal balance reads always use: provider.getBalance(address)
 *
 * Use this ABI only for: withdraw() and withdrawWithMessage() (L2 → L1 bridging).
 */
export const BASE_TOKEN_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferFromTo",
    inputs: [
      { name: "_from", type: "address", internalType: "address" },
      { name: "_to", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "_account", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "_l1Receiver", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdrawWithMessage",
    inputs: [
      { name: "_l1Receiver", type: "address", internalType: "address" },
      { name: "_additionalData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "Mint",
    inputs: [
      { name: "account", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" },
      { name: "value", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdrawal",
    inputs: [
      { name: "_l2Sender", type: "address", indexed: true, internalType: "address" },
      { name: "_l1Receiver", type: "address", indexed: true, internalType: "address" },
      { name: "_amount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WithdrawalWithMessage",
    inputs: [
      { name: "_l2Sender", type: "address", indexed: true, internalType: "address" },
      { name: "_l1Receiver", type: "address", indexed: true, internalType: "address" },
      { name: "_amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "_additionalData", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
] as const;

// ─── INonceHolder ─────────────────────────────────────────────────────────────
/**
 * Nonce storage for all accounts.
 * Custom smart accounts use this to manage their transaction nonces.
 *
 * ⚠️  External callability: getMinNonce() and getKeyedNonce() can be called via eth_call.
 *     isNonceUsed() and deployment/increment functions are restricted to system callers.
 * For simple nonce reads, prefer: provider.getTransactionCount(address)
 */
export const NONCE_HOLDER_ABI = [
  {
    type: "function",
    name: "getMinNonce",
    inputs: [{ name: "_address", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getKeyedNonce",
    inputs: [
      { name: "_address", type: "address", internalType: "address" },
      { name: "_key", type: "uint192", internalType: "uint192" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRawNonce",
    inputs: [{ name: "_address", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "increaseMinNonce",
    inputs: [{ name: "_value", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "oldMinNonce", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "incrementMinNonceIfEquals",
    inputs: [{ name: "_expectedNonce", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "incrementMinNonceIfEqualsKeyed",
    inputs: [{ name: "_expectedNonce", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDeploymentNonce",
    inputs: [{ name: "_address", type: "address", internalType: "address" }],
    outputs: [{ name: "deploymentNonce", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "incrementDeploymentNonce",
    inputs: [{ name: "_address", type: "address", internalType: "address" }],
    outputs: [{ name: "prevDeploymentNonce", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isNonceUsed",
    inputs: [
      { name: "_address", type: "address", internalType: "address" },
      { name: "_nonce", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "validateNonceUsage",
    inputs: [
      { name: "_address", type: "address", internalType: "address" },
      { name: "_key", type: "uint256", internalType: "uint256" },
      { name: "_shouldBeUsed", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "view",
  },
] as const;

// ─── ISystemContext ───────────────────────────────────────────────────────────
/**
 * Read chain metadata: chainId, gas price, block/batch numbers, timestamps, etc.
 *
 * ⚠️  These functions are BOOTLOADER-INTERNAL — they return 0x when called externally via eth_call.
 *     This ABI is intended for Solidity contracts calling SystemContext on-chain (e.g. require(SystemContext.chainId() == 99999)).
 *
 * For off-chain scripts, use provider methods instead:
 *   - chainId     → provider.getNetwork()  → network.chainId
 *   - gasPrice    → provider.getFeeData()  → feeData.gasPrice
 *   - blockNumber → provider.getBlockNumber()
 */
export const SYSTEM_CONTEXT_ABI = [
  {
    type: "function",
    name: "chainId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "origin",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gasPrice",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "blockGasLimit",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "coinbase",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "difficulty",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "baseFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "txNumberInBlock",
    inputs: [],
    outputs: [{ name: "", type: "uint16", internalType: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBlockHashEVM",
    inputs: [{ name: "_block", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBatchHash",
    inputs: [{ name: "_batchNumber", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "hash", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBlockNumber",
    inputs: [],
    outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBlockTimestamp",
    inputs: [],
    outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBatchNumberAndTimestamp",
    inputs: [],
    outputs: [
      { name: "blockNumber", type: "uint128", internalType: "uint128" },
      { name: "blockTimestamp", type: "uint128", internalType: "uint128" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getL2BlockNumberAndTimestamp",
    inputs: [],
    outputs: [
      { name: "blockNumber", type: "uint128", internalType: "uint128" },
      { name: "blockTimestamp", type: "uint128", internalType: "uint128" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gasPerPubdataByte",
    inputs: [],
    outputs: [{ name: "gasPerPubdataByte", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentPubdataSpent",
    inputs: [],
    outputs: [{ name: "currentPubdataSpent", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

// ─── IL1Messenger ─────────────────────────────────────────────────────────────
/**
 * Send arbitrary messages from ADI Chain (L2) to Ethereum (L1).
 * Emits L1MessageSent which is proved in the ZK batch and verifiable on L1.
 */
export const L1_MESSENGER_ABI = [
  {
    type: "function",
    name: "sendToL1",
    inputs: [{ name: "_message", type: "bytes", internalType: "bytes" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sendL2ToL1Log",
    inputs: [
      { name: "_isService", type: "bool", internalType: "bool" },
      { name: "_key", type: "bytes32", internalType: "bytes32" },
      { name: "_value", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "logIdInMerkleTree", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "L1MessageSent",
    inputs: [
      { name: "_sender", type: "address", indexed: true, internalType: "address" },
      { name: "_hash", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "_message", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
] as const;

// ─── IContractDeployer ────────────────────────────────────────────────────────
/**
 * Compute addresses for CREATE/CREATE2, query AA version, update account type.
 * Useful for smart account factories and contract deployment helpers.
 */
export const CONTRACT_DEPLOYER_ABI = [
  {
    type: "function",
    name: "getNewAddressCreate2",
    inputs: [
      { name: "_sender", type: "address", internalType: "address" },
      { name: "_bytecodeHash", type: "bytes32", internalType: "bytes32" },
      { name: "_salt", type: "bytes32", internalType: "bytes32" },
      { name: "_input", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "newAddress", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNewAddressCreate",
    inputs: [
      { name: "_sender", type: "address", internalType: "address" },
      { name: "_senderNonce", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "newAddress", type: "address", internalType: "address" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getAccountInfo",
    inputs: [{ name: "_address", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "info",
        type: "tuple",
        internalType: "struct IContractDeployer.AccountInfo",
        components: [
          { name: "supportedAAVersion", type: "uint8", internalType: "enum IContractDeployer.AccountAbstractionVersion" },
          { name: "nonceOrdering", type: "uint8", internalType: "enum IContractDeployer.AccountNonceOrdering" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "extendedAccountVersion",
    inputs: [{ name: "_address", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint8", internalType: "enum IContractDeployer.AccountAbstractionVersion" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateAccountVersion",
    inputs: [{ name: "_version", type: "uint8", internalType: "enum IContractDeployer.AccountAbstractionVersion" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowedBytecodeTypesToDeploy",
    inputs: [],
    outputs: [{ name: "mode", type: "uint8", internalType: "enum IContractDeployer.AllowedBytecodeTypes" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ContractDeployed",
    inputs: [
      { name: "deployerAddress", type: "address", indexed: true, internalType: "address" },
      { name: "bytecodeHash", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "contractAddress", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AccountVersionUpdated",
    inputs: [
      { name: "accountAddress", type: "address", indexed: true, internalType: "address" },
      { name: "aaVersion", type: "uint8", indexed: false, internalType: "enum IContractDeployer.AccountAbstractionVersion" },
    ],
    anonymous: false,
  },
] as const;

// ─── IPaymaster ───────────────────────────────────────────────────────────────
/**
 * Interface a paymaster contract must implement to sponsor gas.
 *
 * ⚠️  NOT ACTIVE on ADI Chain OS (Airbender). The bootloader does not call
 *     validateAndPayForPaymasterTransaction on the current protocol version.
 *     Deploying a contract that implements this interface will compile and
 *     deploy normally — it simply will never be invoked by the chain today.
 *
 * This ABI is included for future compatibility when paymaster support lands.
 * See also: ADIPaymaster.sol in @adi-devtools/contracts/src/
 */
export const PAYMASTER_ABI = [
  {
    type: "function",
    name: "validateAndPayForPaymasterTransaction",
    inputs: [
      { name: "_txHash", type: "bytes32", internalType: "bytes32" },
      { name: "_suggestedSignedHash", type: "bytes32", internalType: "bytes32" },
      {
        name: "_transaction",
        type: "tuple",
        internalType: "struct Transaction",
        components: [
          { name: "txType", type: "uint256", internalType: "uint256" },
          { name: "from", type: "uint256", internalType: "uint256" },
          { name: "to", type: "uint256", internalType: "uint256" },
          { name: "gasLimit", type: "uint256", internalType: "uint256" },
          { name: "gasPerPubdataByteLimit", type: "uint256", internalType: "uint256" },
          { name: "maxFeePerGas", type: "uint256", internalType: "uint256" },
          { name: "maxPriorityFeePerGas", type: "uint256", internalType: "uint256" },
          { name: "paymaster", type: "uint256", internalType: "uint256" },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "reserved", type: "uint256[4]", internalType: "uint256[4]" },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "signature", type: "bytes", internalType: "bytes" },
          { name: "factoryDeps", type: "bytes32[]", internalType: "bytes32[]" },
          { name: "paymasterInput", type: "bytes", internalType: "bytes" },
          { name: "reservedDynamic", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [
      { name: "magic", type: "bytes4", internalType: "bytes4" },
      { name: "context", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "postTransaction",
    inputs: [
      { name: "_context", type: "bytes", internalType: "bytes" },
      {
        name: "_transaction",
        type: "tuple",
        internalType: "struct Transaction",
        components: [
          { name: "txType", type: "uint256", internalType: "uint256" },
          { name: "from", type: "uint256", internalType: "uint256" },
          { name: "to", type: "uint256", internalType: "uint256" },
          { name: "gasLimit", type: "uint256", internalType: "uint256" },
          { name: "gasPerPubdataByteLimit", type: "uint256", internalType: "uint256" },
          { name: "maxFeePerGas", type: "uint256", internalType: "uint256" },
          { name: "maxPriorityFeePerGas", type: "uint256", internalType: "uint256" },
          { name: "paymaster", type: "uint256", internalType: "uint256" },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "reserved", type: "uint256[4]", internalType: "uint256[4]" },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "signature", type: "bytes", internalType: "bytes" },
          { name: "factoryDeps", type: "bytes32[]", internalType: "bytes32[]" },
          { name: "paymasterInput", type: "bytes", internalType: "bytes" },
          { name: "reservedDynamic", type: "bytes", internalType: "bytes" },
        ],
      },
      { name: "_txHash", type: "bytes32", internalType: "bytes32" },
      { name: "_suggestedSignedHash", type: "bytes32", internalType: "bytes32" },
      { name: "_txResult", type: "uint8", internalType: "enum ExecutionResult" },
      { name: "_maxRefundedGas", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
] as const;

// ─── IPaymasterFlow ───────────────────────────────────────────────────────────
/**
 * Helper interface for encoding paymaster input.
 *
 * This is NOT implemented by any contract — it is only used for ABI-encoding
 * the paymasterInput field in a transaction.
 *
 * ⚠️  NOT ACTIVE on ADI Chain OS (Airbender). The paymasterInput field is
 *     ignored by the current protocol — there is no bootloader hook that reads it.
 *     Encoding paymasterInput correctly won't cause errors, but it has no effect.
 *
 * Usage with ethers.js (for future use):
 *   const iface = new ethers.Interface(PAYMASTER_FLOW_ABI);
 *   const paymasterInput = iface.encodeFunctionData("general", ["0x"]);
 */
export const PAYMASTER_FLOW_ABI = [
  {
    type: "function",
    name: "general",
    inputs: [{ name: "input", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approvalBased",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_minAllowance", type: "uint256", internalType: "uint256" },
      { name: "_innerInput", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
