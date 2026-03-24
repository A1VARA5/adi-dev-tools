# ADI Dev Tools Wiki

Welcome to the **adi-dev-tools** developer wiki - the missing ecosystem for [ADI Chain](https://docs.adi.foundation), a ZK rollup L2 secured by Ethereum.

ADI Chain is fully EVM-compatible. Every standard Solidity contract, ethers.js script, and Hardhat/Foundry workflow works without modification. This monorepo fills the gap between "EVM-compatible" and "actually easy to build on".

---

## What is in this repo?

| Package | npm | What it does |
|---|---|---|
| `@adi-devtools/sdk` | `npm i @adi-devtools/sdk` | Network constants, ethers.js providers, MetaMask helpers, viem chain definitions |
| `hardhat-adi-network` | `npm i hardhat-adi-network` | Hardhat plugin - auto-injects ADI testnet + mainnet network configs |
| `@adi-devtools/contracts` | `npm i @adi-devtools/contracts` | Solidity templates (Voting, ERC-20, ERC-721, Faucet, Paymaster skeleton) + typed ABIs for all ADI system contracts |
| `create-adi-app` | `npx create-adi-app my-dapp` | One-command project scaffold (Hardhat or Foundry + HTML frontend) |

Six fully-working example dApps are included in `examples/` - no npm publish, just clone and deploy.

---

## Jump in

- **New to ADI?** Start with [[Getting Started]] - scaffold a project in under 2 minutes.
- **Just need the chain details?** See [[Network Reference]].
- **Building a frontend or script?** See [[SDK Reference]].
- **Using Hardhat?** See [[Hardhat Plugin]].
- **Deploying a contract template?** See [[Contracts Reference]].
- **Running an example?** See [[Examples]].
- **Something broken?** See [[Troubleshooting]].
- **Want to contribute?** See [[Contributing]].

---

## Current status

All planned tooling is complete and published to npm. ADI Chain mainnet launched March 2026.

| Item | Status |
|---|---|
| `@adi-devtools/sdk` | Published |
| `hardhat-adi-network` | Published |
| `@adi-devtools/contracts` v0.1.3 | Published |
| `create-adi-app` v0.1.17 | Published |
| `examples/counter-dapp` | Live on testnet |
| `examples/voting-dapp` | Live on testnet |
| `examples/gasless-voting-dapp` | Live on testnet (paymaster contract deployed, not invoked - see [[ADI Chain Internals]]) |
| `examples/nft-mint` | Live on testnet |
| `examples/simple-dao` | Live on testnet |
| `examples/token-faucet` | Live on testnet |
| Native AA / Paymaster support | Future - `AA_ENABLED` flag not yet active on ADI Chain OS |

---

## Links

- Repo: https://github.com/A1VARA5/adi-dev-tools
- ADI docs: https://docs.adi.foundation
- Testnet faucet: http://faucet.ab.testnet.adifoundation.ai
- Testnet explorer: https://explorer.ab.testnet.adifoundation.ai
- Mainnet explorer: https://explorer.adifoundation.ai
- Discord: https://discord.gg/dHMNTjwNcM
- npm org: https://npmjs.com/org/adi-devtools
