# Troubleshooting

Common errors and how to fix them. Click any heading to expand.

---

## Installation

<details>
<summary><strong>npm install fails - ENOENT: package.json not found</strong></summary>

You ran `npm install` in the wrong directory. `cd` into your project first:

```bash
cd my-dapp
npm install
```

</details>

<details>
<summary><strong>pnpm build (monorepo) fails - Cannot find module '@adi-devtools/sdk'</strong></summary>

A package earlier in the build chain failed silently. Build packages individually to find the problem:

```bash
pnpm --filter @adi-devtools/sdk build
pnpm --filter hardhat-adi-network build
pnpm --filter @adi-devtools/contracts build
pnpm --filter create-adi-app build
```

Fix each in order - later packages depend on earlier ones.

</details>

---

## MetaMask and browser

<details>
<summary><strong>MetaMask does not appear / window.ethereum is undefined</strong></summary>

MetaMask does not inject into `file://` URLs. Serve the frontend over HTTP:

```bash
npx serve frontend
# Open http://localhost:3000 - NOT file:///path/to/index.html
```

</details>

<details>
<summary><strong>Wrong network / transactions fail silently</strong></summary>

Make sure MetaMask is on ADI Testnet (Chain ID 99999). The `switchToADITestnet()` helper will do this automatically:

```javascript
import { switchToADITestnet } from "@adi-devtools/sdk";
await switchToADITestnet();
```

</details>

---

## Deployment

<details>
<summary><strong>Frontend connects but contract calls fail / revert</strong></summary>

The scaffold ships with a zero placeholder address. After deploying, paste your address:

```javascript
// frontend/index.html  (around line 56)
const CONTRACT_ADDRESS = "0xYourDeployedAddressHere";
```

</details>

<details>
<summary><strong>Zero balance / deployment reverts immediately</strong></summary>

Get free testnet ADI before deploying:

```
http://faucet.ab.testnet.adifoundation.ai
```

The `deploy.mjs` script checks balance and exits with a clear message if it is zero.

</details>

<details>
<summary><strong>hardhat ignition deploy fails - odd number of digits or nonce error</strong></summary>

The ADI testnet RPC does not support the `pending` block tag that Hardhat Ignition uses for nonce sync. Use `deploy.mjs` instead:

```bash
npm run deploy
CONTRACT=Voting npm run deploy
```

</details>

<details>
<summary><strong>Private key error - invalid arrayify value or invalid hex string</strong></summary>

Your key must be 64 hex characters. Both formats work - `deploy.mjs` normalises them:

```bash
# Both work in .env:
TESTNET_PRIVATE_KEY=abc123...      # without 0x
TESTNET_PRIVATE_KEY=0xabc123...    # with 0x
```

</details>

---

## Hardhat

<details>
<summary><strong>hardhat-adi-network plugin not loading / network not found</strong></summary>

The plugin requires Hardhat v3 and the `plugins: []` array syntax:

```typescript
import { defineConfig } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";

export default defineConfig({
  plugins: [adiNetworkPlugin],  // v3 style - NOT require()
  // ...
});
```

Do not use `require("hardhat-adi-network")` (Hardhat v2 pattern).

</details>

<details>
<summary><strong>Node.js version warning from Hardhat</strong></summary>

```
WARNING: You are using Node.js 25.x which is not supported by Hardhat.
```

This is cosmetic - everything compiles and deploys on Node 25. To suppress it, switch to Node 22 LTS via `nvm` or `fnm`.

</details>

---

## Foundry

<details>
<summary><strong>forge build fails - forge-std/Script.sol not found</strong></summary>

Foundry dependencies are git submodules. Install them first:

```bash
git init
git add .
git commit -m "init"
forge install foundry-rs/forge-std
forge build
```

> As of `create-adi-app@0.1.16` this step is done automatically during scaffold.

</details>

<details>
<summary><strong>Failed to decode private key on Windows (CRLF issue)</strong></summary>

Windows saves `.env` files with CRLF line endings. The `\r` gets appended to the key. Load the `.env` with explicit trimming in PowerShell:

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match "^([^#][^=]*)=(.*)$") {
    [System.Environment]::SetEnvironmentVariable(
      $matches[1].Trim(),
      $matches[2].Trim().TrimEnd("`r")
    )
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

</details>

<details>
<summary><strong>Installing Foundry on Windows</strong></summary>

The bash installer does not work in PowerShell. Download `foundry_nightly_win32_amd64.zip` from [GitHub Releases](https://github.com/foundry-rs/foundry/releases), extract the three executables to `~/.foundry/bin`, and add that folder to your PATH:

```powershell
$env:PATH += ";$env:USERPROFILE\.foundry\bin"
# To persist: System - Environment Variables - Path - New
```

</details>

---

## SDK / ethers.js

<details>
<summary><strong>zksync-ethers CDN does not work in browser</strong></summary>

`zksync-ethers` is a Node.js library. Its CDN bundle does not work in browsers. Use plain `ethers@6` instead:

```html
<script type="module">
import { BrowserProvider, Contract }
  from "https://esm.sh/ethers@6?bundle";
</script>
```

</details>

<details>
<summary><strong>Type-113 transactions rejected</strong></summary>

ADI Chain OS does not accept type-113 (ZKSync native AA) transactions. Use standard EIP-1559:

```typescript
// This works
const tx = await signer.sendTransaction({ to, value, data });

// This will fail
const tx = await signer.sendTransaction({ to, value, data, customData: { ... } });
```

</details>

<details>
<summary><strong>BASE_TOKEN_ABI.balanceOf returns garbage or throws</strong></summary>

`balanceOf` on the base token system contract takes `uint256`, not `address`. Do not call it directly. Use:

```typescript
const balance = await provider.getBalance("0xYourAddress");
```

</details>

---

## System contracts

<details>
<summary><strong>SYSTEM_CONTEXT_ABI calls return 0x or revert</strong></summary>

`SYSTEM_CONTEXT` is bootloader-internal. It cannot be called via external `eth_call`. Use provider methods directly:

```typescript
const chainId = (await provider.getNetwork()).chainId;
const blockNumber = await provider.getBlockNumber();
const feeData = await provider.getFeeData();
```

</details>

<details>
<summary><strong>Paymaster transactions not working</strong></summary>

Paymaster support (`AA_ENABLED`) is not active on current ADI Chain OS (Airbender). Transactions with paymaster data are submitted as plain EIP-1559. See [[ADI Chain Internals]].

</details>
