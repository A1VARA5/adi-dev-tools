# Contributing

Thanks for your interest in contributing to **adi-dev-tools** - the developer ecosystem for ADI Chain.

---

## What you can contribute

- Bug fixes in any package or example
- Improvements to existing frontends or contracts
- New example dApps
- Documentation improvements
- Better TypeScript types or SDK helpers
- Windows/Linux/macOS compatibility fixes

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 22 LTS |
| pnpm | 8+ (`npm i -g pnpm`) |
| Foundry | latest (for Foundry-based examples) |
| MetaMask | latest (for testing frontends) |
| ADI Testnet wallet | Funded - get ADI from the [faucet](http://faucet.ab.testnet.adifoundation.ai) |

---

## Setup

```bash
git clone https://github.com/A1VARA5/adi-dev-tools
cd adi-dev-tools
pnpm install
```

Build packages in dependency order (SDK first, everything else imports it):

```bash
cd packages/sdk && pnpm build
cd ../hardhat-plugin && pnpm build
cd ../contracts && pnpm build
cd ../create-adi-app && pnpm build
```

Or build everything at once from the root:

```bash
pnpm build
```

---

## Making changes

1. Fork the repo, create a branch from `main`
2. Make your change
3. Test manually on ADI Testnet
4. Open a pull request with a clear description

### Branch naming

| Type | Format |
|---|---|
| Bug fix | `fix/short-description` |
| New feature or example | `feat/short-description` |
| Documentation | `docs/short-description` |

---

## Adding a new example dApp

New examples must follow the same pattern as existing ones:

- Foundry (preferred) or Hardhat project
- Single-file HTML frontend using `ethers@6` from CDN (`https://esm.sh/ethers@6?bundle`)
- No build step, no bundler, no framework
- Works with MetaMask on ADI Testnet
- `README.md` with deploy instructions and testnet explorer link
- Standard EIP-1559 only - no `zksync-ethers`, no type-113, no `customData`

Use `examples/voting-dapp` as the reference implementation.

---

## ADI Chain constraints to keep in mind

These are not bugs - they are how the chain works today:

| Constraint | Detail |
|---|---|
| EIP-1559 only | Type-113 (ZKSync native AA) transactions are rejected |
| `AA_ENABLED=false` | Paymaster contracts deploy but are never invoked by the chain |
| No `zksync-ethers` in browser | Node.js only library - CDN bundle does not work |
| `BASE_TOKEN_ABI.balanceOf` | Takes `uint256` not `address` - use `provider.getBalance()` |
| `SYSTEM_CONTEXT_ABI` | Bootloader-internal - returns `0x` via `eth_call`, use provider methods off-chain |

Full details in [packages/contracts/system/abis.ts](../packages/contracts/system/abis.ts) and [[ADI Chain Internals]].

---

## Style rules

- No em dashes (`-` U+2014) anywhere - use a plain hyphen (`-`) instead
- Plain English, no jargon beyond standard EVM/Solidity terms
- Code comments should explain *why*, not *what*
- No `zksync-ethers` in any frontend

---

## Pull request checklist

- [ ] Tested on ADI Testnet (contract deployed, frontend works with MetaMask)
- [ ] No em dashes in any file
- [ ] `README.md` updated if something user-facing changed
- [ ] No `zksync-ethers` in any frontend file

---

## Publishing to npm (maintainers)

Publish in dependency order so later packages can resolve already-published earlier ones:

```bash
# 1. SDK
cd packages/sdk && npm publish --access public

# 2. Hardhat plugin
cd ../hardhat-plugin && npm publish --access public

# 3. Contracts
cd ../contracts && npm publish --access public

# 4. CLI
cd ../create-adi-app && npm publish --access public
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/A1VARA5/adi-dev-tools/discussions) or a [GitHub Issue](https://github.com/A1VARA5/adi-dev-tools/issues).
