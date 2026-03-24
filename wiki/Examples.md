# Examples

Six complete, deployable dApps in `examples/`. Each has a Foundry or Hardhat project, a single-file HTML frontend (ethers@6, no bundler), and a `README.md` with deploy instructions.

---

## At a glance

| Example | Stack | What you learn | Testnet |
|---|---|---|---|
| counter-dapp | Hardhat + HTML | Minimal Hardhat setup, deploy.mjs pattern | Live |
| voting-dapp | Foundry + HTML | Foundry workflow, full voting UI, MetaMask "add chain" | Live |
| gasless-voting-dapp | Foundry + HTML | Paymaster contract structure, future AA pattern | Live |
| nft-mint | Foundry + HTML | ERC-721 on ADI, payable mint, NFT gallery | Live |
| simple-dao | Foundry + HTML | On-chain governance, treasury, multi-step UI | Live |
| token-faucet | Foundry + HTML | Rate-limiting, cooldown timer, claims history | Live |

---

## counter-dapp

> Simplest possible ADI Chain dApp. On-chain counter: read, increment, set.

**Stack**: Hardhat v3 + single-file HTML frontend

```
examples/counter-dapp/
+-- contracts/Counter.sol
+-- frontend/index.html
+-- deploy.mjs
+-- hardhat.config.ts
+-- package.json
```

```bash
cd examples/counter-dapp
npm install
cp .env.example .env   # set TESTNET_PRIVATE_KEY
npm run deploy
```

Paste the printed address into `frontend/index.html` line 56, then:
```bash
npx serve frontend
```

**Best reference for**: minimal Hardhat setup, `deploy.mjs` pattern, counter contract.

---

## voting-dapp

> Production-ready on-chain poll. Proposals with live progress bars, one vote per wallet, owner closes voting, winner shown.

**Stack**: Foundry + single-file HTML frontend

```
examples/voting-dapp/
+-- src/Voting.sol
+-- script/Voting.s.sol
+-- frontend/index.html
+-- foundry.toml
```

```bash
cd examples/voting-dapp
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/Voting.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

**Deployed testnet address**: `0xCf3c96c15AA11aD470C923d4e580b73c171B1595`

**Best reference for**: Foundry + ADI Chain end-to-end, full voting UI, MetaMask "add the chain" flow.

---

## gasless-voting-dapp

> Voting dApp plus a deployed paymaster contract skeleton. Frontend uses plain EIP-1559 today because `AA_ENABLED=false` on current ADI Chain OS.

**Stack**: Foundry + single-file HTML frontend

> This is a reference for when paymaster support ships. Gasless transactions do not work today - see [[ADI Chain Internals]].

```
examples/gasless-voting-dapp/
+-- src/ADIVoting.sol
+-- src/GaslessPaymaster.sol
+-- script/Deploy.s.sol
+-- frontend/index.html
```

**Deployed testnet addresses**:

| Contract | Address |
|---|---|
| ADIVoting | `0xCf3c96c15AA11aD470C923d4e580b73c171B1595` |
| GaslessPaymaster | `0x0cb9523eC2b81042664B0D99F075C3BdD7f3cD18` |

**Best reference for**: paymaster contract interface, future AA integration pattern.

---

## nft-mint

> ERC-721 NFT collection with public mint (price-gated), token gallery, owner controls.

**Stack**: Foundry + single-file HTML frontend

```
examples/nft-mint/
+-- src/NFT.sol
+-- script/NFT.s.sol
+-- frontend/index.html
+-- foundry.toml
```

```bash
cd examples/nft-mint
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/NFT.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

**Best reference for**: ERC-721 on ADI Chain, NFT gallery frontend, payable mint.

---

## simple-dao

> On-chain DAO: join with a membership fee, create proposals, vote FOR/AGAINST, finalize, execute treasury releases.

**Stack**: Foundry + single-file HTML frontend

```
examples/simple-dao/
+-- src/DAO.sol
+-- script/DAO.s.sol
+-- frontend/index.html
+-- foundry.toml
```

```bash
cd examples/simple-dao
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/DAO.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

**Best reference for**: governance contracts, treasury management, multi-step UI flows.

---

## token-faucet

> Testnet ADI faucet with per-wallet cooldown timer, live claims history, and owner panel.

**Stack**: Foundry + single-file HTML frontend

```
examples/token-faucet/
+-- src/Faucet.sol
+-- script/Faucet.s.sol
+-- frontend/index.html
+-- foundry.toml
```

```bash
cd examples/token-faucet
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/Faucet.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

**Best reference for**: rate-limiting patterns, faucet design, cooldown timer UI.

---

## Serving frontends

All frontends are single HTML files. MetaMask requires HTTP (not `file://`).

```bash
# Python (no extra install)
python -m http.server 8080 --directory frontend

# npx
npx serve frontend
```

---

## Frontend pattern

All examples share this import (no bundler, no build step):

```html
<script type="module">
import { BrowserProvider, Contract, formatEther, parseEther }
  from "https://esm.sh/ethers@6?bundle";
</script>
```

> Do NOT use `zksync-ethers` from CDN - it is Node.js-only. Do NOT use type-113 transactions - they are rejected by ADI Chain.

---

## Quick reference

| Example | Stack | Contracts | Live on testnet |
|---|---|---|---|
| `counter-dapp` | Hardhat + HTML | `Counter.sol` | Yes |
| `voting-dapp` | Foundry + HTML | `ADIVoting.sol` | Yes |
| `gasless-voting-dapp` | Foundry + HTML | `ADIVoting.sol`, `GaslessPaymaster.sol` | Yes (paymaster deployed but not invoked) |
| `nft-mint` | Foundry + HTML | `NFT.sol` (ERC-721) | Yes |
| `simple-dao` | Foundry + HTML | `DAO.sol` | Yes |
| `token-faucet` | Foundry + HTML | `Faucet.sol` | Yes |

---

## counter-dapp

**Stack**: Hardhat v3 + single-file HTML frontend

The simplest possible ADI Chain dApp. On-chain counter: read the value, call `increment()`, call `setNumber(n)`.

```
examples/counter-dapp/
+-- contracts/Counter.sol
+-- frontend/index.html
+-- deploy.mjs
+-- hardhat.config.ts
+-- package.json
+-- README.md
```

**Deploy:**
```bash
cd examples/counter-dapp
npm install
cp .env.example .env  # set TESTNET_PRIVATE_KEY
npm run deploy
```

Paste the printed address into `frontend/index.html` line 56, then `npx serve frontend`.

Best reference for: minimal Hardhat setup, `deploy.mjs` pattern, counter contract pattern.

---

## voting-dapp

**Stack**: Foundry + single-file HTML frontend

Production-ready on-chain poll. Proposals with live vote counts and progress bars, single vote per wallet, owner can close voting, winner displayed.

```
examples/voting-dapp/
+-- src/Voting.sol
+-- script/Voting.s.sol
+-- frontend/index.html
+-- foundry.toml
+-- README.md
```

**Deploy:**
```bash
cd examples/voting-dapp
cp .env.example .env  # set TESTNET_PRIVATE_KEY
forge install foundry-rs/forge-std
forge build
forge script script/Voting.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

Paste the address into `frontend/index.html`, then `python -m http.server 8080`.

**Deployed testnet address**: `0xCf3c96c15AA11aD470C923d4e580b73c171B1595`

Best reference for: Foundry + ADI Chain, full voting UI, "add the chain" MetaMask flow.

---

## gasless-voting-dapp

**Stack**: Foundry + single-file HTML frontend + `GaslessPaymaster.sol`

Same voting dApp plus a deployed paymaster contract skeleton. The frontend uses plain EIP-1559 (not type-113) because `AA_ENABLED=false` on current ADI Chain OS. The paymaster contract is deployed and funded but is not invoked by the chain.

> This is a reference implementation for when paymaster support ships. Do not expect gasless transactions to work today.

```
examples/gasless-voting-dapp/
+-- src/ADIVoting.sol
+-- src/GaslessPaymaster.sol
+-- script/Deploy.s.sol
+-- frontend/index.html
+-- README.md
```

**Deployed testnet addresses**:
- `ADIVoting`: `0xCf3c96c15AA11aD470C923d4e580b73c171B1595`
- `GaslessPaymaster`: `0x0cb9523eC2b81042664B0D99F075C3BdD7f3cD18`

Best reference for: paymaster contract interface, future AA integration pattern.

---

## nft-mint

**Stack**: Foundry + single-file HTML frontend

ERC-721 NFT collection with public mint (price-gated), token gallery, owner controls for price and max supply.

```
examples/nft-mint/
+-- src/NFT.sol
+-- script/NFT.s.sol
+-- frontend/index.html
+-- foundry.toml
+-- README.md
```

**Deploy:**
```bash
cd examples/nft-mint
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/NFT.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

Best reference for: ERC-721 on ADI Chain, NFT gallery frontend, payable mint.

---

## simple-dao

**Stack**: Foundry + single-file HTML frontend

On-chain DAO: join with a membership fee, create proposals, vote FOR/AGAINST, finalize results, execute treasury releases.

```
examples/simple-dao/
+-- src/DAO.sol
+-- script/DAO.s.sol
+-- frontend/index.html
+-- foundry.toml
+-- README.md
```

**Deploy:**
```bash
cd examples/simple-dao
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/DAO.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

Best reference for: governance contracts, treasury management, multi-step UI flows.

---

## token-faucet

**Stack**: Foundry + single-file HTML frontend

Testnet ADI faucet with per-wallet cooldown timer, live claims history, and owner panel for deposits and parameter changes.

```
examples/token-faucet/
+-- src/Faucet.sol
+-- script/Faucet.s.sol
+-- frontend/index.html
+-- foundry.toml
+-- README.md
```

**Deploy:**
```bash
cd examples/token-faucet
cp .env.example .env
forge install foundry-rs/forge-std
forge build
forge script script/Faucet.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

Best reference for: rate-limiting patterns, faucet design, cooldown timer UI.

---

## Serving frontends

All frontends are single HTML files. MetaMask requires HTTP (not `file://`).

**Quickest way:**
```bash
python -m http.server 8080 --directory frontend
# http://localhost:8080
```

Or:
```bash
npx serve frontend
# http://localhost:3000
```

---

## Frontend pattern used in all examples

All examples use this import (no bundler, no build step):

```html
<script type="module">
import { BrowserProvider, Contract, formatEther, parseEther }
  from "https://esm.sh/ethers@6?bundle";
</script>
```

> Do NOT use `zksync-ethers` from CDN - it is Node.js-only and the bundle does not work in browsers. Do NOT use type-113 transactions - they are rejected by ADI Chain.
