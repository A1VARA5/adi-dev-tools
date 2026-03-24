# Hardhat Plugin

`hardhat-adi-network` auto-injects ADI testnet and mainnet network configs into any Hardhat v3 project. No manual RPC URLs or chain IDs needed.

```bash
npm i hardhat-adi-network
```

> **Hardhat v3 only.** This plugin uses the `defineConfig` + `plugins: []` API introduced in Hardhat v3. It will not work with Hardhat v2 `require()` style configs.

---

## Setup

```typescript
// hardhat.config.ts
import { defineConfig } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";

export default defineConfig({
  plugins: [adiNetworkPlugin],
  solidity: { version: "0.8.24" },
});
```

That is the entire configuration change required.

---

## Available networks

After installing the plugin, two networks are available:

| Network name | Chain ID | RPC |
|---|---|---|
| `adi-testnet` | 99999 | `https://rpc.ab.testnet.adifoundation.ai` |
| `adi-mainnet` | 36900 | `https://rpc.adifoundation.ai` |

---

## Deploying

```bash
# Set your private key
export TESTNET_PRIVATE_KEY=0xYourKeyHere

# Deploy to testnet
npx hardhat deploy --network adi-testnet

# Deploy to mainnet
npx hardhat deploy --network adi-mainnet
```

---

## Full hardhat.config.ts (with accounts)

```typescript
import { defineConfig, vars } from "hardhat/config";
import adiNetworkPlugin from "hardhat-adi-network";

export default defineConfig({
  plugins: [adiNetworkPlugin],

  solidity: { version: "0.8.24" },

  networks: {
    // Override plugin defaults to add your private key
    "adi-testnet": {
      type: "http",
      chainType: "generic",
      url: "https://rpc.ab.testnet.adifoundation.ai",
      accounts: [vars.get("TESTNET_PRIVATE_KEY")],
    },
    "adi-mainnet": {
      type: "http",
      chainType: "generic",
      url: "https://rpc.adifoundation.ai",
      accounts: [vars.get("MAINNET_PRIVATE_KEY")],
    },
  },

  ignition: {
    requiredConfirmations: 1,  // Required for ADI testnet - do not remove
  },
});
```

> `chainType: "generic"` and `requiredConfirmations: 1` are both required for ADI Chain. Missing either will cause deployment failures.

---

## Using Hardhat Ignition vs deploy.mjs

> **Important**: `hardhat ignition deploy` fails on ADI testnet with a nonce sync error because the ADI RPC does not support the `pending` block tag that Ignition uses internally.

Use the `deploy.mjs` script included in the `create-adi-app` Hardhat template instead:

```bash
npm run deploy                     # deploys Counter.sol
CONTRACT=Voting npm run deploy      # deploys Voting.sol
NETWORK=mainnet npm run deploy      # deploys to mainnet
```

The script uses `ethers.js` directly and has no `pending` block tag dependency.

---

## Verifying the plugin loaded

```bash
npx hardhat networks
# Should list adi-testnet and adi-mainnet in the output
```

---

## Troubleshooting

**Plugin not loading / network not found**

Make sure you are on Hardhat v3 and using the `plugins: []` array in `defineConfig`, not `require("hardhat-adi-network")`.

**`ENOENT .env` or private key undefined**

Use `vars.get("TESTNET_PRIVATE_KEY")` (Hardhat v3 config variables) or set `process.env.TESTNET_PRIVATE_KEY` before running the command.

More errors in [[Troubleshooting]].
