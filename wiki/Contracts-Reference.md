# Contracts Reference

`@adi-devtools/contracts` ships Solidity templates and typed TypeScript exports for all ADI Chain system contracts.

```bash
npm i @adi-devtools/contracts
```

---

## Contract templates

These are auditable, production-ready Solidity contracts for the most common ADI Chain use cases. They use standard OpenZeppelin patterns - no ADI-specific quirks.

| Contract | File | What it does |
|---|---|---|
| `ADIVoting.sol` | `src/ADIVoting.sol` | On-chain poll: one wallet = one vote, proposals array, `closeVoting()`, `winningProposal()` |
| `ADIToken.sol` | `src/ADIToken.sol` | ERC-20 with mint/burn, compatible with ADI's custom gas token model |
| `ADINFT.sol` | `src/ADINFT.sol` | ERC-721 with URI storage, optimised for ADI's low fees |
| `ADIFaucet.sol` | `src/ADIFaucet.sol` | Testnet token faucet - rate-limited per wallet |
| `ADIPaymaster.sol` | `src/ADIPaymaster.sol` | ZKSync-style paymaster skeleton - for when `AA_ENABLED=true` lands |

### Import in Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@adi-devtools/contracts/src/ADIVoting.sol";
import "@adi-devtools/contracts/src/ADIToken.sol";
import "@adi-devtools/contracts/src/ADINFT.sol";
import "@adi-devtools/contracts/src/ADIFaucet.sol";
```

### ADIVoting.sol

```solidity
constructor(string memory _name, string[] memory _proposalNames)

function vote(uint256 proposalIndex) external
function closeVoting() external onlyOwner
function winningProposal() external view returns (uint256 winningIndex)
function getProposals() external view returns (Proposal[] memory)
```

Single-vote-per-wallet enforced. Owner can close voting at any time. Winner is the proposal with the most votes.

### ADIToken.sol

Standard ERC-20 with owner-controlled mint/burn. Fully compatible with ADI gas token model.

```solidity
constructor(string memory name, string memory symbol, uint256 initialSupply)

function mint(address to, uint256 amount) external onlyOwner
function burn(uint256 amount) external
```

### ADINFT.sol

ERC-721 with URI storage, price-gated public mint, owner controls.

```solidity
constructor(string memory name, string memory symbol, uint256 _mintPrice, uint256 _maxSupply)

function mint(string memory tokenURI) external payable
function setMintPrice(uint256 newPrice) external onlyOwner
function withdraw() external onlyOwner
```

### ADIFaucet.sol

Testnet ADI faucet with wallet-level cooldown.

```solidity
constructor(uint256 _claimAmount, uint256 _cooldown)

function claim() external
function deposit() external payable
function setClaimAmount(uint256 _amount) external onlyOwner
```

### ADIPaymaster.sol (future)

IPaymaster skeleton that will be invokable when `AA_ENABLED=true` is enabled on ADI Chain OS. Currently deployed but never invoked. See [[ADI Chain Internals]].

---

## System contract ABIs

> **Read this before using system ABIs.** Most system contracts are bootloader-internal and cannot be called via `eth_call` from outside the chain. For the majority of use cases you do **not** need these - use `provider.getBalance()`, `provider.getBlockNumber()`, and `provider.getFeeData()` instead.

```typescript
import {
  // Addresses
  BASE_TOKEN_ADDRESS,
  NONCE_HOLDER_ADDRESS,
  CONTRACT_DEPLOYER_ADDRESS,
  L1_MESSENGER_ADDRESS,
  ENTRYPOINT_V07_ADDRESS,
  ENTRYPOINT_V08_ADDRESS,

  // ABIs
  BASE_TOKEN_ABI,
  NONCE_HOLDER_ABI,
  SYSTEM_CONTEXT_ABI,
  L1_MESSENGER_ABI,
  CONTRACT_DEPLOYER_ABI,
  PAYMASTER_ABI,
  PAYMASTER_FLOW_ABI,
} from "@adi-devtools/contracts/system";
```

### What each system contract does

| Contract | Callable externally? | Use case |
|---|---|---|
| `BASE_TOKEN` | Yes - `withdraw`, `withdrawWithMessage` | Withdraw ADI from L2 to L1 |
| `NONCE_HOLDER` | Yes - `getMinNonce`, `getRawNonce` | Custom smart account nonce management |
| `SYSTEM_CONTEXT` | No (bootloader-internal) | Use in Solidity only. Off-chain: use provider methods |
| `L1_MESSENGER` | Yes - `sendToL1` | Send ZK-proved L2-to-L1 messages |
| `CONTRACT_DEPLOYER` | Yes - `getNewAddressCreate2`, `getAccountInfo` | Compute CREATE2 addresses pre-deploy |
| `PAYMASTER_ABI` | Future (AA_ENABLED=false) | Paymaster interface - not invoked on current OS |
| `PAYMASTER_FLOW_ABI` | Future (AA_ENABLED=false) | Encodes paymaster input selector |

### Critical trap: BASE_TOKEN balanceOf

`BASE_TOKEN_ABI.balanceOf(uint256)` takes a **uint256**, not an address. Calling it with an address will fail.

For reading ADI balances always use:

```typescript
const balance = await provider.getBalance("0xYourAddress");
```

### L2 to L1 messaging

```typescript
import { L1_MESSENGER_ADDRESS, L1_MESSENGER_ABI } from "@adi-devtools/contracts/system";
import { ethers } from "ethers";

const messenger = new ethers.Contract(L1_MESSENGER_ADDRESS, L1_MESSENGER_ABI, signer);
const tx = await messenger.sendToL1(ethers.toUtf8Bytes("hello from L2"));
await tx.wait();
```

### Compute a CREATE2 address before deploying

```typescript
import { CONTRACT_DEPLOYER_ADDRESS, CONTRACT_DEPLOYER_ABI } from "@adi-devtools/contracts/system";

const deployer = new ethers.Contract(CONTRACT_DEPLOYER_ADDRESS, CONTRACT_DEPLOYER_ABI, provider);
const predicted = await deployer.getNewAddressCreate2(sender, bytecodeHash, salt, constructorInput);
```

### Gasless transactions (future)

Paymaster support is not active on current ADI Chain OS. The encoding below is correct and will apply when `AA_ENABLED=true` ships.

```typescript
import { PAYMASTER_FLOW_ABI } from "@adi-devtools/contracts/system";
import { ethers } from "ethers";

const iface = new ethers.Interface(PAYMASTER_FLOW_ABI);

// General paymaster - paymaster pays all gas
const input = iface.encodeFunctionData("general", ["0x"]);

// Approval-based - user pays gas in an ERC-20 token
const input = iface.encodeFunctionData("approvalBased", [tokenAddress, minAllowance, "0x"]);
```

See [[ADI Chain Internals]] for the full AA/paymaster status.
