# ADI Dev Tools

[![CI](https://github.com/A1VARA5/adi-dev-tools/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/A1VARA5/adi-dev-tools/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@adi-devtools/sdk?label=%40adi-devtools%2Fsdk)](https://npmjs.com/package/@adi-devtools/sdk)
[![npm](https://img.shields.io/npm/v/@adi-devtools/contracts?label=%40adi-devtools%2Fcontracts)](https://npmjs.com/package/@adi-devtools/contracts)
[![npm](https://img.shields.io/npm/v/hardhat-adi-network?label=hardhat-adi-network)](https://npmjs.com/package/hardhat-adi-network)
[![npm](https://img.shields.io/npm/v/create-adi-app?label=create-adi-app)](https://npmjs.com/package/create-adi-app)
[![npm downloads](https://img.shields.io/npm/dw/@adi-devtools/sdk?label=sdk%20downloads)](https://npmjs.com/package/@adi-devtools/sdk)

The missing developer ecosystem for [ADI Chain](https://docs.adi.foundation) - a ZK rollup L2 secured by Ethereum.

ADI Chain is fully EVM-compatible but had zero developer-facing tooling. This monorepo fills every gap.

## Packages

| Package | Install | What it does |
|---|---|---|
| [`packages/sdk`](packages/sdk) | `npm i @adi-devtools/sdk` | Network constants, ethers.js/viem providers, MetaMask helpers |
| [`packages/hardhat-plugin`](packages/hardhat-plugin) | `npm i hardhat-adi-network` | Auto-injects ADI testnet + mainnet into Hardhat configs |
| [`packages/contracts`](packages/contracts) | `npm i @adi-devtools/contracts` | Solidity templates (Voting, ERC-20, ERC-721, Faucet, Paymaster) |
| [`packages/create-adi-app`](packages/create-adi-app) | `npx create-adi-app my-dapp` | One-command project scaffold (Hardhat or Foundry) |

## Examples

| Example | Description |
|---|---|
| [`examples/voting-dapp`](examples/voting-dapp) | Production-ready on-chain voting dApp (Foundry + plain HTML) |

## Quick start

```bash
npx create-adi-app my-dapp
cd my-dapp
npm install
# Edit .env — set TESTNET_PRIVATE_KEY=<your private key>
npm run compile
npm run deploy
```

After deploying, serve the frontend locally and open it in your browser:

```bash
npx serve frontend
# Open http://localhost:3000
```

Then paste your deployed contract address into `frontend/index.html`:

```javascript
// line 56 — replace the zero address with your deployed address
const CONTRACT_ADDRESS = "0xYourDeployedAddressHere";
```

Or use the SDK directly:

```typescript
import { ADI_TESTNET, getADIProvider, switchToADITestnet } from "@adi-devtools/sdk";

const provider = getADIProvider("testnet");
const block = await provider.getBlockNumber();

// In browser — MetaMask
await switchToADITestnet();
```

## Network

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | `99999` | `36900` |
| RPC | `https://rpc.ab.testnet.adifoundation.ai` | `https://rpc.adifoundation.ai` |
| Explorer | `https://explorer.ab.testnet.adifoundation.ai` | `https://explorer.adifoundation.ai` |
| Faucet | `http://faucet.ab.testnet.adifoundation.ai` | - |

## Monorepo setup

```bash
# Install all dependencies from root
pnpm install   # or: npm install

# Build all packages (strict order: sdk → hardhat-plugin → contracts → create-adi-app)
pnpm build
```

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

The frontend ships with a zero placeholder address:

```javascript
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```

After running `npm run deploy`, copy the printed address and paste it into `frontend/index.html` line 56:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedAddressHere";
```

---

### `hardhat ignition deploy` fails with `odd number of digits` or nonce error

The ADI testnet RPC does not support the `pending` block tag that Hardhat Ignition uses for nonce sync. Use the included `deploy.mjs` script instead — it deploys via ethers.js directly and has no such limitation:

```bash
npm run deploy            # deploys Counter.sol to testnet
CONTRACT=Voting npm run deploy    # deploys Voting.sol
NETWORK=mainnet npm run deploy    # deploys to mainnet
```

---

### Private key error: `invalid arrayify value` or `invalid hex string`

Your private key must be 64 hex characters. Both formats work — the deploy script normalises them automatically:

```bash
# Both of these work in .env:
TESTNET_PRIVATE_KEY=abc123...     # without 0x
TESTNET_PRIVATE_KEY=0xabc123...   # with 0x
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

Windows saves `.env` files with CRLF line endings. The `\r` gets appended to the key, making it invalid. Load the `.env` with explicit trimming:

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

Foundry dependencies are installed as git submodules. As of `create-adi-app@0.1.16`, a git repo is initialised automatically during scaffold so this should not happen. If you scaffolded with an older version, run:

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



---

## About ADI Chain ZK proofs

Every dApp on ADI Chain is automatically a ZK dApp. You deploy standard Solidity. The Airbender prover batches transactions, generates a STARK proof, wraps it into FFLONK, and posts it to Ethereum L1 - all transparent to developers. You do not write ZK circuits.

## Links

- ADI Chain docs: https://docs.adi.foundation
- GitHub: https://github.com/A1VARA5/adi-dev-tools
- npm org: https://npmjs.com/org/adi-devtools
- This repo: https://github.com/A1VARA5/adi-dev-tools
- GitHub org: https://github.com/ADI-Foundation-Labs
- Testnet quickstart: https://docs.adi.foundation/how-to-start/adi-network-testnet-quickstart
