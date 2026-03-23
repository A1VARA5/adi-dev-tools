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
| [`packages/contracts`](packages/contracts) | `npm i @adi-devtools/contracts` | Solidity templates (Voting, ERC-20, ERC-721, Faucet, Paymaster) |
| [`packages/create-adi-app`](packages/create-adi-app) | `npx create-adi-app my-dapp` | One-command project scaffold (Hardhat or Foundry) |

---

## Examples

| Example | Stack | Description |
|---|---|---|
| [`examples/counter-dapp`](examples/counter-dapp) | Hardhat + HTML | Simple on-chain counter — increment, set value, read state |
| [`examples/voting-dapp`](examples/voting-dapp) | Foundry + HTML | Production-ready on-chain voting dApp with proposals, vote counts and progress bars |

Both examples include a ready-to-use single-file HTML frontend that connects to MetaMask — no build step, no bundler.

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

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | `99999` | `36900` |
| RPC | `https://rpc.ab.testnet.adifoundation.ai` | `https://rpc.ab.mainnet.adifoundation.ai` |
| Explorer | `https://explorer.ab.testnet.adifoundation.ai` | `https://explorer.adifoundation.ai` |
| Faucet | `http://faucet.ab.testnet.adifoundation.ai` | — |
| Bridge | `https://bridge.testnet.adifoundation.ai` | — |

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
│   ├── counter-dapp/      ← Hardhat + Counter + HTML frontend
│   └── voting-dapp/       ← Foundry + Voting + HTML frontend
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

---

## Links

- ADI Chain docs: https://docs.adi.foundation
- Testnet quickstart: https://docs.adi.foundation/how-to-start/adi-network-testnet-quickstart
- Testnet faucet: http://faucet.ab.testnet.adifoundation.ai
- Testnet explorer: https://explorer.ab.testnet.adifoundation.ai
- ADI Foundation GitHub: https://github.com/ADI-Foundation-Labs
- This repo: https://github.com/A1VARA5/adi-dev-tools
- npm org: https://npmjs.com/org/adi-devtools
