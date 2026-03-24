# Getting Started

Get your first ADI Chain dApp running in under 5 minutes.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org) | 18 LTS or 22 LTS | Node 25 works with a cosmetic Hardhat warning |
| [MetaMask](https://metamask.io) | latest | Browser extension - for testing frontends |
| [Git](https://git-scm.com) | any | Required for Foundry git submodules |
| [Foundry](https://book.getfoundry.sh) | latest | Only needed if you choose the Foundry template |

> **Windows + Foundry**: The bash installer does not work in PowerShell. Download `foundry_nightly_win32_amd64.zip` directly from [GitHub Releases](https://github.com/foundry-rs/foundry/releases), extract `forge.exe`, `cast.exe`, `anvil.exe` to `~/.foundry/bin`, then add that folder to your PATH.

---

## Option A - Scaffold with create-adi-app (recommended)

```bash
npx create-adi-app my-dapp
cd my-dapp
```

The CLI asks three questions:

1. **Template** - Hardhat (beginner-friendly) or Foundry (faster build, better for advanced users)
2. **Include Voting example?** - adds `Voting.sol` + `frontend/voting.html` alongside the Counter
3. **Networks** - testnet only, or testnet + mainnet

Then follow the printed instructions to install, configure, deploy, and serve the frontend.

For a full walkthrough see the [[CLI Reference]] page.

---

## Option B - Use the SDK directly in an existing project

### Install

```bash
npm i @adi-devtools/sdk
```

### Connect to ADI Chain

```typescript
import { ADI_TESTNET, getADIProvider, switchToADITestnet } from "@adi-devtools/sdk";

// Server-side or scripts
const provider = getADIProvider("testnet");
const block = await provider.getBlockNumber();

// Browser - prompt MetaMask to add + switch to ADI Testnet
await switchToADITestnet();
```

See [[SDK Reference]] for the full API.

---

## Option C - Add to a Hardhat project

```bash
npm i hardhat-adi-network
```

```typescript
// hardhat.config.ts
import { defineConfig } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";

export default defineConfig({
  plugins: [adiNetworkPlugin],
  solidity: { version: "0.8.24" },
});
```

```bash
TESTNET_PRIVATE_KEY=0x... npx hardhat deploy --network adi-testnet
```

See [[Hardhat Plugin]] for details.

---

## Get testnet ADI

Before deploying you need testnet ADI for gas. Get it free from the faucet:

```
http://faucet.ab.testnet.adifoundation.ai
```

---

## Add ADI Testnet to MetaMask manually

If the SDK helper is not available, add the network manually:

| Field | Value |
|---|---|
| Network name | ADI Network AB Testnet |
| RPC URL | `https://rpc.ab.testnet.adifoundation.ai` |
| Chain ID | `99999` |
| Currency symbol | ADI |
| Explorer URL | `https://explorer.ab.testnet.adifoundation.ai` |

---

## Next steps

- [[SDK Reference]] - full API for network constants, providers, MetaMask helpers
- [[Hardhat Plugin]] - deploy scripts and network config
- [[Contracts Reference]] - ready-to-use Solidity templates
- [[Examples]] - six complete dApps to clone and customise
- [[Network Reference]] - all RPC, chain ID, and explorer URLs
