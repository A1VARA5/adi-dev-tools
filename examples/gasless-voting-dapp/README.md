# Voting dApp — ADI Chain

A production-ready on-chain voting dApp built on ADI Chain. Wallets connect via MetaMask, cast votes, and results are stored permanently on-chain and proved by ADI's ZK rollup.

> **Gas note:** ADI Chain fees are extremely cheap (sub-cent). While this example deploys a `GaslessPaymaster` contract for reference, **ADI Chain OS (Airbender) uses standard EVM transaction types** — ZKSync native AA type-113 transactions are not supported on this stack. Votes are sent as regular EIP-1559 transactions. The `GaslessPaymaster.sol` contract is included as an educational reference for when paymaster support is added in a future protocol version.

---

## How it works

```
User clicks "⚡ Vote"
  │
  ▼
Frontend encodes vote(proposalIndex) calldata via ethers.js
  │
  ▼
MetaMask signs a standard EIP-1559 transaction (type 2)
  │
  ▼
vote() executes on ADIVoting.sol
  │  └─ Checks: wallet hasn\'t voted before
  │  └─ Increments proposal.voteCount
  │
  ▼
Airbender generates ZK proof of state transition
proof posted and verified on Ethereum L1
```

---

## Stack

| Layer | Tech |
|---|---|
| Smart contracts | Solidity 0.8.24, Foundry |
| Frontend | Single HTML file — ethers.js v6 (CDN, no build step) |
| Network | ADI Chain testnet (Chain ID 99999) |

---

## Prerequisites

- [Foundry](https://book.getfoundry.sh) installed
- [MetaMask](https://metamask.io) browser extension
- Testnet ADI from the faucet: http://faucet.ab.testnet.adifoundation.ai (deployer needs ~0.1 ADI)

**Windows**: Download `foundry_nightly_win32_amd64.zip` from [GitHub releases](https://github.com/foundry-rs/foundry/releases) and add to PATH. The bash installer does not work in PowerShell.

---

## Quick start

### 1. Install dependencies

```bash
cd examples/gasless-voting-dapp
git init && git add . && git commit -m "init"  # required for forge submodules
forge install foundry-rs/forge-std
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — set TESTNET_PRIVATE_KEY to a funded wallet
```

**Windows PowerShell:**
```powershell
$env:TESTNET_PRIVATE_KEY="0xYourPrivateKeyHere"
```

### 3. Deploy

```bash
forge script script/Deploy.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

**Windows PowerShell:**
```powershell
forge script script/Deploy.s.sol `
  --rpc-url https://rpc.ab.testnet.adifoundation.ai `
  --broadcast --private-key $env:TESTNET_PRIVATE_KEY
```

The deploy script:
1. Deploys `ADIVoting.sol` with 3 default proposals
2. Deploys `GaslessPaymaster.sol` pointing at the voting contract
3. Funds the paymaster with **0.05 ADI** — enough to sponsor ~50,000 gas operations

Output:
```
[1/3] ADIVoting deployed:
      Address: 0xAbc...
[2/3] GaslessPaymaster deployed:
      Address: 0xDef...
[3/3] Paymaster funded with 0 ADI

─────────────────────────────────────────────────────
 DEPLOYMENT COMPLETE
─────────────────────────────────────────────────────
 VOTING_ADDRESS   = 0xAbc...
 PAYMASTER_ADDRESS = 0xDef...
```

### 4. Configure the frontend

Open `frontend/index.html` and replace the two zero addresses (around line 320):

```javascript
// ⚠️  REPLACE THESE after running: forge script script/Deploy.s.sol --broadcast
const VOTING_ADDRESS    = '0xYourVotingContractAddress';
const PAYMASTER_ADDRESS = '0xYourPaymasterAddress';
```

### 5. Serve and test

```bash
npx serve frontend
# Open http://localhost:3000
```

> Must be HTTP, not `file://` — MetaMask doesn't inject into file:// URLs.

---

## Contracts

### `ADIVoting.sol`

Standard on-chain voting. One wallet = one vote. Proposals, vote counts, and results stored on-chain.

```solidity
function vote(uint256 proposalIndex) external whenActive
function proposalCount() external view returns (uint256)
function proposals(uint256) external view returns (string, uint256)
function winningProposal() external view returns (uint256, string, uint256)
function closeVoting() external onlyOwner
```

### `GaslessPaymaster.sol` (reference only)

A ZKsync-style native paymaster contract. Implements `IPaymaster` — on chains where the bootloader invokes it before every transaction, this contract pays gas on behalf of users.

> **ADI Chain OS (Airbender) does not call paymasters today.** This contract is deployed and included as a reference implementation for a future protocol upgrade. It compiles and deploys normally.

```solidity
// Called by bootloader before tx execution (future support)
function validateAndPayForPaymasterTransaction(...) external payable returns (bytes4 magic, bytes memory context)

// Management (owner only)
function withdraw(address payable _to) external
function setSponsoredContract(address _newContract) external
function getBalance() external view returns (uint256)
```

---

## Funding the paymaster

The paymaster needs an ADI balance to cover gas. Send ADI to it at any time:

```bash
cast send <PAYMASTER_ADDRESS> \
  --value 0.1ether \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --private-key $TESTNET_PRIVATE_KEY
```

Or use the "Withdraw Paymaster Funds" button in the frontend to reclaim unused funds.

---

## Customise the poll

Override the default proposals by setting env vars before deploying:

```bash
POLL_TITLE="Best DeFi protocol?" \
PROPOSAL_0="Uniswap" \
PROPOSAL_1="Aave" \
PROPOSAL_2="Curve" \
forge script script/Deploy.s.sol --broadcast --rpc-url ...
```

---

## System contracts reference

This example references `@adi-devtools/contracts/system`:

```typescript
import { PAYMASTER_FLOW_ABI, BOOTLOADER_FORMAL_ADDRESS } from "@adi-devtools/contracts/system";
// PAYMASTER_FLOW_ABI encodes general() and approvalBased() paymaster inputs
// BOOTLOADER_FORMAL_ADDRESS = 0x0000...8001 — used in GaslessPaymaster.sol
```

The `GaslessPaymaster.sol` validates against the `general(bytes)` selector (`0x8c5a3445`) from `PAYMASTER_FLOW_ABI`. This will be relevant when ADI Chain adds bootloader-level paymaster support.

---

## Common errors

### `AlreadyVoted`
Each wallet can vote once per poll. Use a different wallet to test multiple votes.

### MetaMask can't connect
Ensure MetaMask is installed. Click "Connect Wallet" — the dApp automatically adds ADI Testnet (Chain ID 99999) if it's not in MetaMask yet.

### `VotingNotActive`
The poll has been closed by the owner. Deploy a new voting contract to start a new poll.

### Transaction fails with low ADI balance
ADI testnet fees are sub-cent. Get testnet ADI from: http://faucet.ab.testnet.adifoundation.ai

---

## Verifying on explorer

After deploying, view your contracts on the ADI testnet explorer:

```
https://explorer.ab.testnet.adifoundation.ai/address/<CONTRACT_ADDRESS>
```
