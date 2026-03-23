# ADI Dev Tools

The missing developer ecosystem for [ADI Chain](https://docs.adi.foundation) — a ZK rollup L2 secured by Ethereum.

ADI Chain is fully EVM-compatible but had zero developer-facing tooling. This monorepo fills every gap.

## Packages

| Package | npm name | What it does |
|---|---|---|
| [`packages/sdk`](packages/sdk) | `@adi-foundation/sdk` | Network constants, ethers.js/viem providers, MetaMask helpers |
| [`packages/hardhat-plugin`](packages/hardhat-plugin) | `hardhat-adi-network` | Auto-injects ADI testnet + mainnet into Hardhat configs |
| [`packages/contracts`](packages/contracts) | `@adi-foundation/contracts` | Audited Solidity templates (Voting, Token, NFT, Faucet, Paymaster) |
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
import { ADI_TESTNET, getADIProvider, switchToADITestnet } from "@adi-foundation/sdk";

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
- GitHub org: https://github.com/ADI-Foundation-Labs
- Testnet quickstart: https://docs.adi.foundation/how-to-start/adi-network-testnet-quickstart
