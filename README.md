# ADI Dev Tools

[![CI](https://github.com/A1VARA5/adi-dev-tools/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/A1VARA5/adi-dev-tools/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@adi-devtools/sdk?label=%40adi-devtools%2Fsdk)](https://npmjs.com/package/@adi-devtools/sdk)
[![npm](https://img.shields.io/npm/v/hardhat-adi-network?label=hardhat-adi-network)](https://npmjs.com/package/hardhat-adi-network)
[![npm](https://img.shields.io/npm/v/create-adi-app?label=create-adi-app)](https://npmjs.com/package/create-adi-app)
[![npm downloads](https://img.shields.io/npm/dw/@adi-devtools/sdk?label=sdk%20downloads)](https://npmjs.com/package/@adi-devtools/sdk)

The missing developer ecosystem for [ADI Chain](https://docs.adi.foundation) — a ZK rollup L2 secured by Ethereum.

ADI Chain is fully EVM-compatible but had zero developer-facing tooling. This monorepo fills every gap.

## Packages

| Package | npm name | What it does |
|---|---|---|
| [`packages/sdk`](packages/sdk) | `@adi-devtools/sdk` | Network constants, ethers.js/viem providers, MetaMask helpers |
| [`packages/hardhat-plugin`](packages/hardhat-plugin) | `hardhat-adi-network` | Auto-injects ADI testnet + mainnet into Hardhat configs |
| [`packages/contracts`](packages/contracts) | `@adi-devtools/contracts` | Audited Solidity templates (Voting, Token, NFT, Faucet, Paymaster) |
| [`packages/create-adi-app`](packages/create-adi-app) | `create-adi-app` | `npx create-adi-app my-dapp` — one-command project scaffold |

## Examples

| Example | Description |
|---|---|
| [`examples/voting-dapp`](examples/voting-dapp) | Production-ready on-chain voting dApp (Foundry + plain HTML) |

## Quick start

```bash
npx create-adi-app my-dapp
cd my-dapp
npm install
npx hardhat ignition deploy ignition/modules/Counter.ts --network adi-testnet
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
| Faucet | `http://faucet.ab.testnet.adifoundation.ai` | — |

## Monorepo setup

```bash
# Install (pnpm recommended)
pnpm install

# Or npm
npm install

# Build all packages in order
cd packages/sdk && pnpm build
cd ../hardhat-plugin && pnpm build
cd ../create-adi-app && pnpm build
```

Build order is strict: `sdk → hardhat-plugin → contracts → create-adi-app → examples`

## About ADI Chain ZK proofs

Every dApp on ADI Chain is automatically a ZK dApp. You deploy standard Solidity. The Airbender prover batches transactions, generates a STARK proof, wraps it into FFLONK, and posts it to Ethereum L1 — all transparent to developers. You do not write ZK circuits.

## Links

- Docs: https://docs.adi.foundation
- This repo: https://github.com/A1VARA5/adi-dev-tools
- GitHub org: https://github.com/ADI-Foundation-Labs
- Testnet quickstart: https://docs.adi.foundation/how-to-start/adi-network-testnet-quickstart
