# Gasless Voting dApp — ADI Chain

A production-ready voting dApp where **users pay zero gas**. The dApp operator funds a paymaster contract that covers gas fees on behalf of voters.

Built on **ADI Chain's native Account Abstraction** — no external bundler or ERC-4337 EntryPoint needed. Any wallet (MetaMask, injected) works out of the box.

---

## How it works

```
User clicks "Vote Free"
  │
  ▼
Frontend builds a ZKsync type-113 (EIP-712) transaction
  │  └─ normal vote() calldata
  │  └─ paymaster: GaslessPaymaster address
  │  └─ paymasterInput: general("0x")
  │
  ▼
MetaMask signs the typed data (eth_signTypedData_v4)
  │
  ▼
ADI Chain bootloader calls GaslessPaymaster.validateAndPayForPaymasterTransaction()
  │  └─ Checks: correct paymaster flow (general)
  │  └─ Checks: transaction targets the voting contract
  │  └─ Pays bootloader the gas cost from paymaster balance
  │
  ▼
vote() executes on ADIVoting.sol
Voter's wallet is charged ZERO ADI
  │
  ▼
Airbender generates ZK proof → posted to Ethereum L1
```

---

## Stack

| Layer | Tech |
|---|---|
| Smart contracts | Solidity 0.8.24, Foundry |
| Paymaster interface | ZKsync native AA (not ERC-4337) |
| Frontend | Single HTML file — viem v2 + viem/zksync (CDN) |
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

### `GaslessPaymaster.sol`

ZKsync native paymaster. Implements `IPaymaster` — the bootloader calls this before every transaction.

```solidity
// Called by bootloader before tx execution — pays gas on user's behalf
function validateAndPayForPaymasterTransaction(...) external payable returns (bytes4 magic, bytes memory context)

// Called by bootloader after tx — no-op for this simple paymaster
function postTransaction(...) external payable

// Management (owner only)
function withdraw(address payable _to) external
function setSponsoredContract(address _newContract) external
function getBalance() external view returns (uint256)
```

**Validation logic:**
1. Ensures `paymasterInput` starts with `general(bytes)` selector (`0x8c5a3445`)
2. Ensures transaction targets the `sponsoredContract` (voting contract)
3. Pays `gasLimit × maxFeePerGas` to the bootloader
4. Returns `SUCCESS_MAGIC` to approve

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

## System contracts used

This example uses `@adi-devtools/contracts/system`:

```typescript
import { PAYMASTER_FLOW_ABI } from "@adi-devtools/contracts/system";
// PAYMASTER_FLOW_ABI encodes general() and approvalBased() paymaster inputs
```

The `GaslessPaymaster.sol` validates against the `general(bytes)` selector (`0x8c5a3445`) sourced from `PAYMASTER_FLOW_ABI`. The `getGeneralPaymasterInput()` utility from `viem/zksync` encodes the same value in the frontend.

---

## Common errors

### `InsufficientPaymasterBalance`
The paymaster has run out of ADI. Fund it: `cast send <PAYMASTER_ADDRESS> --value 0.05ether ...`

### `WrongTargetContract`
The paymaster only sponsors transactions to `sponsoredContract`. Check that `PAYMASTER_ADDRESS` and `VOTING_ADDRESS` match your deployed contracts.

### `AlreadyVoted`
Each wallet can vote once per poll. Use a different wallet to test multiple votes.

### MetaMask shows unknown transaction type
Ensure MetaMask is connected to ADI Testnet (Chain ID 99999). Click "Connect Wallet" — the dApp adds it automatically.

### `VotingNotActive`
The poll has been closed by the owner. Deploy a new voting contract to start a new poll.

---

## Verifying on explorer

After deploying, view your contracts on the ADI testnet explorer:

```
https://explorer.ab.testnet.adifoundation.ai/address/<CONTRACT_ADDRESS>
```
