# Contributing to adi-dev-tools

Thanks for your interest in contributing! This repo is the developer tooling ecosystem for [ADI Chain](https://docs.adi.foundation) - contributions that improve the developer experience are very welcome.

---

## What you can contribute

- Bug fixes in any package or example
- Improvements to existing example frontends or contracts
- New example dApps (see guidelines below)
- Documentation improvements
- Better TypeScript types or SDK helpers
- Fixes for Windows/Linux/macOS compatibility issues

---

## Getting started

### Prerequisites

- Node.js 22 LTS (Hardhat does not officially support v25+)
- pnpm 8+ (`npm i -g pnpm`)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for Foundry-based examples)
- MetaMask (for testing frontends)
- ADI Testnet wallet with some ADI - get some from the [faucet](http://faucet.ab.testnet.adifoundation.ai)

### Setup

```bash
git clone https://github.com/A1VARA5/adi-dev-tools
cd adi-dev-tools
pnpm install
```

Build packages in order:

```bash
cd packages/sdk && pnpm build
cd ../hardhat-plugin && pnpm build
cd ../contracts && pnpm build
cd ../create-adi-app && pnpm build
```

---

## Making changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Test manually - deploy to ADI Testnet and verify it works
4. Open a pull request with a clear description of what you changed and why

### Branch naming

- `fix/short-description` - bug fixes
- `feat/short-description` - new features or examples
- `docs/short-description` - documentation only

---

## Adding a new example dApp

New examples must follow the same pattern as existing ones:

- Foundry project (preferred) or Hardhat
- Single-file HTML frontend using `ethers@6` from CDN (`https://esm.sh/ethers@6?bundle`)
- No build step, no bundler, no framework
- Works with MetaMask on ADI Testnet
- Has a `README.md` with deploy instructions and a testnet explorer link
- Uses plain EIP-1559 transactions only - no `zksync-ethers`, no type-113, no `customData`

See `examples/voting-dapp` as the reference implementation.

---

## ADI Chain constraints to keep in mind

These are not bugs - they are how the chain currently works:

- **EIP-1559 only** - type-113 (ZKSync native AA) transactions are rejected
- **`AA_ENABLED=false`** - paymaster contracts are deployed but never invoked
- **No `zksync-ethers` in browser** - Node.js only library; CDN bundle does not work
- **`BASE_TOKEN_ABI.balanceOf`** takes `uint256` not `address` - use `provider.getBalance()` instead
- **`SYSTEM_CONTEXT_ABI`** is bootloader-internal - returns `0x` via `eth_call`

Full details in [`packages/contracts/system/abis.ts`](packages/contracts/system/abis.ts).

---

## Style rules

- No em dashes (`-`) anywhere - use a plain hyphen (`-`) instead
- Plain English, no jargon beyond standard EVM/Solidity terms
- Code comments should explain *why*, not *what*

---

## Pull request checklist

- [ ] Tested on ADI Testnet (contract deployed, frontend works)
- [ ] No em dashes in any file
- [ ] `README.md` updated if you added or changed something user-facing
- [ ] No `zksync-ethers` added to any frontend

---

## Questions?

Open a [GitHub Discussion](https://github.com/A1VARA5/adi-dev-tools/discussions) or an issue.
