# ADI Dev Tools

[![CI](https://github.com/A1VARA5/adi-dev-tools/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/A1VARA5/adi-dev-tools/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@adi-devtools/sdk?label=%40adi-devtools%2Fsdk)](https://npmjs.com/package/@adi-devtools/sdk)
[![npm](https://img.shields.io/npm/v/@adi-devtools/contracts?label=%40adi-devtools%2Fcontracts)](https://npmjs.com/package/@adi-devtools/contracts)
[![npm](https://img.shields.io/npm/v/hardhat-adi-network?label=hardhat-adi-network)](https://npmjs.com/package/hardhat-adi-network)
[![npm](https://img.shields.io/npm/v/create-adi-app?label=create-adi-app)](https://npmjs.com/package/create-adi-app)
[![npm downloads](https://img.shields.io/npm/dw/@adi-devtools/sdk?label=sdk%20downloads)](https://npmjs.com/package/@adi-devtools/sdk)

The missing developer ecosystem for [ADI Chain](https://docs.adi.foundation) — a ZK rollup L2 secured by Ethereum.

ADI Chain is fully EVM-compatible but had zero developer-facing tooling. This monorepo fills every gap.

---

## Packages

| Package | Install | What it does |
|---|---|---|
| [`packages/sdk`](packages/sdk) | `npm i @adi-devtools/sdk` | Network constants, ethers.js/viem providers, MetaMask helpers |
| [`packages/hardhat-plugin`](packages/hardhat-plugin) | `npm i hardhat-adi-network` | Auto-injects ADI testnet + mainnet into Hardhat configs |
| [`packages/contracts`](packages/contracts) | `npm i @adi-devtools/contracts` | Solidity templates (Voting, ERC-20, ERC-721, Faucet, Paymaster) + typed ABIs and addresses for all ADI system contracts |
| [`packages/create-adi-app`](packages/create-adi-app) | `npx create-adi-app my-dapp` | One-command project scaffold (Hardhat or Foundry) |

---

## Examples

| Example | Stack | Description |
|---|---|---|
| [`examples/counter-dapp`](examples/counter-dapp) | Hardhat + HTML | Simple on-chain counter — increment, set value, read state |
| [`examples/voting-dapp`](examples/voting-dapp) | Foundry + HTML | Production-ready voting dApp — proposals, vote counts, progress bars, single vote per wallet |
| [`examples/gasless-voting-dapp`](examples/gasless-voting-dapp) | Foundry + HTML | Voting dApp + `GaslessPaymaster.sol` reference contract — **paymaster is not active on current ADI Chain OS**, included for future protocol support |

All examples include a single-file HTML frontend (ethers.js from CDN) that connects to MetaMask — no build step, no bundler.

---

## Contract templates

`@adi-devtools/contracts` ships auditable Solidity templates for the most common ADI Chain use cases. These work today — standard EVM, no chain-specific quirks.

| Contract | File | What it does |
|---|---|---|
| `ADIVoting.sol` | `src/ADIVoting.sol` | On-chain poll — one wallet = one vote, proposals array, `closeVoting()`, `winningProposal()` |
| `ADIToken.sol` | `src/ADIToken.sol` | ERC-20 with mint/burn, compatible with ADI's custom gas token model |
| `ADINFT.sol` | `src/ADINFT.sol` | ERC-721 with URI storage, optimised for ADI's low fees |
| `ADIFaucet.sol` | `src/ADIFaucet.sol` | Testnet token faucet — rate-limited per wallet |
| `ADIPaymaster.sol` | `src/ADIPaymaster.sol` | ZKsync-style paymaster skeleton — for when bootloader paymaster support lands |

```bash
npm i @adi-devtools/contracts
```

```solidity
// SPDX-License-Identifier: MIT
import "@adi-devtools/contracts/src/ADIVoting.sol";
import "@adi-devtools/contracts/src/ADIToken.sol";
```

These are the most immediately useful part of this package — the system contract ABIs have important caveats (see below).

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org) | 18 LTS or 22 LTS | Node 25 works with a cosmetic Hardhat warning |
| [pnpm](https://pnpm.io) | 8+ | `npm i -g pnpm` — used by the monorepo |
| [Git](https://git-scm.com) | any | Required for Foundry git submodules |
| [MetaMask](https://metamask.io) | latest | Browser extension, for testing frontends |
| [Foundry](https://book.getfoundry.sh) | latest | Only needed for the Foundry template |

**Installing Foundry on Windows**: The bash installer does not work in PowerShell. Download `foundry_nightly_win32_amd64.zip` directly from [GitHub releases](https://github.com/foundry-rs/foundry/releases) and extract `forge.exe`, `cast.exe`, `anvil.exe` to `~/.foundry/bin`. Then add that folder to your PATH:

```powershell
$env:PATH += ";$env:USERPROFILE\.foundry\bin"
# To persist: System → Environment Variables → Path → New
```

---

## Quick start

### Scaffold a new project

```bash
npx create-adi-app my-dapp
cd my-dapp
```

The CLI asks three questions:
- **Template** — Hardhat (recommended for beginners) or Foundry
- **Include Voting example?** — adds `Voting.sol` and `frontend/voting.html` alongside the Counter
- **Network** — testnet only, or testnet + mainnet

### Install and configure

**Hardhat:**
```bash
npm install
cp .env.example .env
# Edit .env — set TESTNET_PRIVATE_KEY
```

**Foundry:**
```bash
cp .env.example .env
forge install foundry-rs/forge-std
# Edit .env — set TESTNET_PRIVATE_KEY
```

Get free testnet ADI from the faucet before deploying:
```
http://faucet.ab.testnet.adifoundation.ai
```

### Compile and deploy

**Hardhat:**
```bash
npm run compile
npm run deploy                    # deploys Counter.sol
CONTRACT=Voting npm run deploy    # deploys Voting.sol (if included)
```

**Foundry:**
```bash
forge build
forge script script/Counter.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

> **Tip**: Always use `npm run deploy` (not `hardhat ignition deploy`) — the ADI testnet RPC does not support the `pending` block tag that Ignition requires for nonce syncing. The included `deploy.mjs` uses ethers.js directly and has no such limitation.

### Serve the frontend

```bash
npx serve frontend
# Open http://localhost:3000 — must be HTTP, not file://
```

---

## Frontends

Each scaffold includes up to two frontends in `frontend/`:

| File | Contract | Where to paste your deployed address |
|---|---|---|
| `frontend/index.html` | Counter | Line 56 — `CONTRACT_ADDRESS` |
| `frontend/voting.html` | Voting (optional) | Line 234 — `CONTRACT_ADDRESS` |

After deploying, open the file and replace the zero placeholder with your deployed address:

```javascript
// frontend/index.html — line 56
const CONTRACT_ADDRESS = "0xYourCounterAddressHere";

// frontend/voting.html — line 234
const CONTRACT_ADDRESS = "0xYourVotingAddressHere";
```

Then `npx serve frontend` and open `http://localhost:3000`.

- **`index.html`** is always included. It reads the Counter value on load and lets a connected wallet call `increment()` and `setNumber()`.
- **`voting.html`** is included when you opt in to the Voting example. It lists all proposals with live vote counts and progress bars, lets wallets cast one vote each, and lets the contract owner close voting.

Both files use ethers.js from CDN. No build step, no bundler, no framework.

---

## System contract ABIs

`@adi-devtools/contracts` ships a `/system` subpath with typed TypeScript exports for every ADI Chain system contract address and ABI.

> ⚠️ **Before using these ABIs, read this:** Most system contracts are bootloader-internal and cannot be called via `eth_call` from outside the chain. Calling them returns `0x` or reverts silently. The table below marks each one clearly. For the majority of dApp use cases (reading balances, block numbers, gas prices) you do **not** need these — use `provider.getBalance()`, `provider.getBlockNumber()`, and `provider.getFeeData()` instead.
>
> Additionally, **paymaster support (`PAYMASTER_ABI`, `PAYMASTER_FLOW_ABI`) is not active on ADI Chain OS (Airbender).** The bootloader does not invoke paymaster contracts on the current protocol version. These ABIs are included for future compatibility.

```typescript
import {
  // Addresses
  BASE_TOKEN_ADDRESS,        // ADI gas token
  NONCE_HOLDER_ADDRESS,
  CONTRACT_DEPLOYER_ADDRESS,
  L1_MESSENGER_ADDRESS,
  ENTRYPOINT_V07_ADDRESS,    // ERC-4337 v0.7
  ENTRYPOINT_V08_ADDRESS,    // ERC-4337 v0.8

  // ABIs
  BASE_TOKEN_ABI,
  NONCE_HOLDER_ABI,
  SYSTEM_CONTEXT_ABI,
  L1_MESSENGER_ABI,
  CONTRACT_DEPLOYER_ABI,
  PAYMASTER_ABI,
  PAYMASTER_FLOW_ABI,
} from "@adi-devtools/contracts/system";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.ab.testnet.adifoundation.ai");
```

### What each export is for

| Contract | Callable externally? | Use case |
|---|---|---|
| `BASE_TOKEN_ADDRESS` / `BASE_TOKEN_ABI` | ✅ `withdraw`, `withdrawWithMessage` | Withdraw ADI from L2 to L1. Note: `balanceOf` takes `uint256`, not `address` — use `provider.getBalance(address)` for normal balance reads |
| `NONCE_HOLDER_ADDRESS` / `NONCE_HOLDER_ABI` | ✅ `getMinNonce`, `getRawNonce` | Useful only for custom smart account factories |
| `SYSTEM_CONTEXT_ADDRESS` / `SYSTEM_CONTEXT_ABI` | ❌ bootloader-internal | Use in Solidity contracts only. Off-chain: use `provider.getNetwork()`, `provider.getFeeData()`, `provider.getBlockNumber()` |
| `L1_MESSENGER_ADDRESS` / `L1_MESSENGER_ABI` | ✅ `sendToL1` | Send L2→L1 messages — ZK-proved in the batch |
| `CONTRACT_DEPLOYER_ADDRESS` / `CONTRACT_DEPLOYER_ABI` | ✅ `getNewAddressCreate2`, `getAccountInfo` | Compute CREATE2 addresses before deploying |
| `PAYMASTER_ABI` | ⏳ future | Interface for paymaster contracts — **bootloader does not invoke paymasters on current ADI Chain OS** |
| `PAYMASTER_FLOW_ABI` | ⏳ future | Encodes paymaster input selector — only relevant when paymaster support is active |

### Gasless transactions (future — not active on current ADI Chain OS)

> **Note:** ADI Chain OS (Airbender) does not currently invoke paymaster contracts. The bootloader calls paymasters on ZKSync Era but not on this stack. The encoding below is correct and will work when paymaster support is added.

```typescript
import { PAYMASTER_FLOW_ABI } from "@adi-devtools/contracts/system";
import { ethers } from "ethers";

const iface = new ethers.Interface(PAYMASTER_FLOW_ABI);

// General paymaster — paymaster pays gas, no token approval needed
const paymasterInput = iface.encodeFunctionData("general", ["0x"]);

// Approval-based — user pays gas in an ERC-20 token
const paymasterInput = iface.encodeFunctionData("approvalBased", [
  tokenAddress,  // ERC-20 token address
  minAllowance,  // BigInt — minimum token amount to approve
  "0x",          // additional data
]);
```

### L2 → L1 messaging

```typescript
import { L1_MESSENGER_ADDRESS, L1_MESSENGER_ABI } from "@adi-devtools/contracts/system";

const messenger = new ethers.Contract(L1_MESSENGER_ADDRESS, L1_MESSENGER_ABI, signer);
const tx = await messenger.sendToL1(ethers.toUtf8Bytes("hello from ADI L2"));
await tx.wait();
```

### Compute a CREATE2 address before deploying

```typescript
import { CONTRACT_DEPLOYER_ADDRESS, CONTRACT_DEPLOYER_ABI } from "@adi-devtools/contracts/system";

const deployer = new ethers.Contract(CONTRACT_DEPLOYER_ADDRESS, CONTRACT_DEPLOYER_ABI, provider);
const address = await deployer.getNewAddressCreate2(sender, bytecodeHash, salt, constructorInput);
```

> **Note:** `SYSTEM_CONTEXT_ABI` functions (`chainId`, `gasPrice`, `getBlockNumber`, etc.) are bootloader-internal — they are designed for Solidity contracts calling them on-chain, not for external `eth_call`. For off-chain scripts use the provider directly: `provider.getNetwork()`, `provider.getFeeData()`, `provider.getBlockNumber()`.

---

## SDK usage

```typescript
import { ADI_TESTNET, getADIProvider, switchToADITestnet } from "@adi-devtools/sdk";

// Read-only (works in Node or browser)
const provider = getADIProvider("testnet");
const block = await provider.getBlockNumber();
console.log("Chain ID:", ADI_TESTNET.chainId); // 99999

// In browser — add ADI Testnet to MetaMask in one call
await switchToADITestnet();
```

---

## Network

ADI Chain mainnet launched March 2026. Both networks are live.

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | `99999` | `36900` |
| RPC | `https://rpc.ab.testnet.adifoundation.ai` | `https://rpc.ab.mainnet.adifoundation.ai` |
| Explorer | `https://explorer.ab.testnet.adifoundation.ai` | `https://explorer.adifoundation.ai` |
| Faucet | `http://faucet.ab.testnet.adifoundation.ai` | — |
| Bridge | `https://bridge.testnet.adifoundation.ai` | — |

> **Windows developers**: The public RPC endpoints above are all you need. The local ADI node (`docker/`) is Linux-only and is not intended for general use — ADI Foundation runs its own prover infrastructure and is not planning external node providers for the foreseeable future.

---

## Monorepo setup (for contributors)

### 1. Clone and install

```bash
git clone https://github.com/A1VARA5/adi-dev-tools.git
cd adi-dev-tools
pnpm install    # installs all packages and links workspace dependencies
```

### 2. Build

`pnpm build` runs all packages in topological order via pnpm's recursive build (`pnpm -r build`):

```bash
pnpm build
```

Build order: **sdk → hardhat-plugin → contracts → create-adi-app** (SDK first because everything else imports it).

To build a single package:

```bash
pnpm --filter @adi-devtools/sdk build
pnpm --filter hardhat-adi-network build
pnpm --filter @adi-devtools/contracts build
pnpm --filter create-adi-app build
```

### 3. Test locally

After building, you can test the CLI without publishing:

```bash
node packages/create-adi-app/dist/index.js my-test-project
```

### Project structure

```
adi-dev-tools/
├── packages/
│   ├── sdk/               → @adi-devtools/sdk
│   ├── hardhat-plugin/    → hardhat-adi-network
│   ├── contracts/         → @adi-devtools/contracts
│   └── create-adi-app/    → create-adi-app (CLI)
│       └── templates/
│           ├── hardhat/   ← copied into new Hardhat projects
│           └── foundry/   ← copied into new Foundry projects
├── examples/
│   ├── counter-dapp/          ← Hardhat + Counter + HTML frontend
│   ├── voting-dapp/           ← Foundry + Voting + HTML frontend
│   └── gasless-voting-dapp/   ← Foundry + paymaster reference contract + HTML frontend
├── docker/                ← Local ADI node (Linux only)
├── pnpm-workspace.yaml
└── package.json
```

### Publishing to npm

Publish in this order so later packages can install the already-published earlier ones:

```bash
# 1. SDK
cd packages/sdk && npm publish --access public

# 2. Hardhat plugin
cd packages/hardhat-plugin && npm publish --access public

# 3. Contracts
cd packages/contracts && npm publish --access public

# 4. CLI
cd packages/create-adi-app && npm publish --access public
```

---

## Common errors and fixes

### `npm install` fails with `ENOENT: package.json not found`

You ran `npm install` in the wrong directory. Always `cd` into your project first:

```bash
cd my-dapp   # not the parent folder
npm install
```

---

### MetaMask does not appear / `window.ethereum` is undefined

MetaMask does not inject into `file://` URLs. You must serve the frontend over HTTP:

```bash
npx serve frontend
# Open http://localhost:3000 — NOT file:///...
```

---

### Frontend connects but contract calls fail / wrong contract

The frontend ships with a zero placeholder address. After running `npm run deploy`, copy the printed address and paste it into the correct file:

```javascript
// frontend/index.html — line 56 (Counter)
const CONTRACT_ADDRESS = "0xYourCounterAddressHere";

// frontend/voting.html — line 234 (Voting)
const CONTRACT_ADDRESS = "0xYourVotingAddressHere";
```

---

### `hardhat ignition deploy` fails with `odd number of digits` or nonce error

The ADI testnet RPC does not support the `pending` block tag that Hardhat Ignition uses for nonce sync. Use the included `deploy.mjs` script instead:

```bash
npm run deploy                                              # Counter.sol
CONTRACT=Voting npm run deploy                              # Voting.sol
NETWORK=mainnet npm run deploy                              # mainnet
DEPLOY_ARGS='["My Poll",["Yes","No"]]' CONTRACT=Voting npm run deploy   # custom args
```

---

### Private key error: `invalid arrayify value` or `invalid hex string`

Your private key must be 64 hex characters. Both formats work — the deploy script normalises them automatically:

```bash
# Both of these work in .env:
TESTNET_PRIVATE_KEY=abc123...     # without 0x prefix
TESTNET_PRIVATE_KEY=0xabc123...   # with 0x prefix
```

---

### Node.js version warning from Hardhat

```
WARNING: You are using Node.js 25.x which is not supported by Hardhat.
```

Hardhat officially supports Node 22 LTS. The warning is cosmetic — everything compiles and deploys fine on Node 25. To suppress it, install Node 22 via `nvm` or `fnm`.

---

### `hardhat-adi-network` plugin not loading / network not found

The plugin targets Hardhat 3. If you are on Hardhat 2, it will not work. The `hardhat.config.ts` generated by `create-adi-app` uses the Hardhat 3 `defineConfig` + `plugins` API:

```typescript
import { defineConfig } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";

export default defineConfig({
  plugins: [adiNetworkPlugin],
  // ...
});
```

Do not use the Hardhat 2 `require("hardhat-adi-network")` pattern.

---

### `forge`: `Failed to decode private key` on Windows

Windows saves `.env` files with CRLF line endings. The `\r` character gets appended to the key, making it invalid. Load the `.env` with explicit trimming:

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match "^([^#][^=]*)=(.*)$") {
    [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim().TrimEnd("`r"))
  }
}
```

Or pass the key directly to skip `.env` loading entirely:

```powershell
forge script script/Counter.s.sol `
  --rpc-url https://rpc.ab.testnet.adifoundation.ai `
  --broadcast `
  --private-key 0xYourKeyHere
```

---

### `forge build` fails: `forge-std/Script.sol` not found

Foundry dependencies are installed as git submodules. As of `create-adi-app@0.1.16`, a git repo is initialised automatically during scaffold. If you scaffolded with an older version, run:

```bash
git init
git add .
git commit -m "init"
forge install foundry-rs/forge-std
forge build
```

---

### Zero balance / deployment reverts immediately

Get free testnet ADI from the faucet before deploying:

```
http://faucet.ab.testnet.adifoundation.ai
```

The deploy script checks your balance and exits with a clear error if it is zero.

---

### `pnpm build` (monorepo) fails mid-way — package not found

If you see `Cannot find module '@adi-devtools/sdk'` while building `hardhat-plugin` or `create-adi-app`, a previous package in the build chain failed silently. Build packages individually to isolate the problem:

```bash
pnpm --filter @adi-devtools/sdk build        # fix this first if it fails
pnpm --filter hardhat-adi-network build
pnpm --filter @adi-devtools/contracts build
pnpm --filter create-adi-app build
```

---

## About ADI Chain ZK proofs

Every dApp on ADI Chain is automatically a ZK dApp. You write standard Solidity — no ZK circuits, no proof SDK, no extra configuration. The Airbender prover collects transaction batches, generates a STARK proof of the state transition, wraps it into a FFLONK proof, and posts it to Ethereum L1 for verification. Only valid batches are finalised. Developers get cryptographic security for free just by deploying on ADI.

ADI Foundation operates its own prover and sequencer infrastructure. There is no external prover program and none is planned. As a dApp developer you do not need to run any node — just deploy your contracts to the RPC endpoints above.

---

## Links

- ADI Chain docs: https://docs.adi.foundation
- Testnet quickstart: https://docs.adi.foundation/how-to-start/adi-network-testnet-quickstart
- Testnet faucet: http://faucet.ab.testnet.adifoundation.ai
- Testnet explorer: https://explorer.ab.testnet.adifoundation.ai
- ADI Foundation GitHub: https://github.com/ADI-Foundation-Labs
- Discord: https://discord.gg/dHMNTjwNcM
- This repo: https://github.com/A1VARA5/adi-dev-tools
- npm org: https://npmjs.com/org/adi-devtools
