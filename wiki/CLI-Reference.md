# CLI Reference

`create-adi-app` scaffolds a complete, ready-to-deploy ADI Chain project in one command.

```bash
npx create-adi-app my-dapp
```

No global install required. Always pulls the latest version from npm.

---

## What it generates

### Hardhat template

```
my-dapp/
+-- contracts/
|   +-- Counter.sol
|   +-- Voting.sol          (if Voting example was opted in)
+-- frontend/
|   +-- index.html          (Counter frontend)
|   +-- voting.html         (Voting frontend, if opted in)
+-- ignition/
|   +-- modules/
|       +-- Counter.ts
+-- deploy.mjs              (ethers.js deploy script - use this, not hardhat ignition)
+-- hardhat.config.ts       (pre-configured with ADI testnet + mainnet)
+-- .env.example
+-- package.json
+-- README.md
```

### Foundry template

```
my-dapp/
+-- src/
|   +-- Counter.sol
+-- script/
|   +-- Counter.s.sol
+-- frontend/
|   +-- index.html
+-- foundry.toml            (pre-configured with ADI RPC)
+-- .env.example
+-- README.md
```

---

## CLI prompts

| Prompt | Options | Default |
|---|---|---|
| Template | Hardhat, Foundry | Hardhat |
| Include Voting example? | Yes, No | No |
| Networks | Testnet only, Testnet + Mainnet | Testnet only |

---

## Post-scaffold steps

### Hardhat

```bash
cd my-dapp
npm install
cp .env.example .env
# Edit .env - set TESTNET_PRIVATE_KEY (without 0x prefix is fine)
npm run compile
npm run deploy
```

The deploy script prints the deployed address. Paste it into the frontend:

```javascript
// frontend/index.html  (line 56)
const CONTRACT_ADDRESS = "0xYourCounterAddressHere";

// frontend/voting.html  (line 234, if you included Voting)
const CONTRACT_ADDRESS = "0xYourVotingAddressHere";
```

Then serve and open:

```bash
npx serve frontend
# http://localhost:3000        -> Counter
# http://localhost:3000/voting.html  -> Voting (if included)
```

### Foundry

```bash
cd my-dapp
cp .env.example .env
forge install foundry-rs/forge-std
# Edit .env - set TESTNET_PRIVATE_KEY
forge build
forge script script/Counter.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast --private-key $TESTNET_PRIVATE_KEY
```

Paste the deployed address into `frontend/index.html`, then:

```bash
python -m http.server 8080
# http://localhost:8080
```

---

## Environment variables

| Variable | Description |
|---|---|
| `TESTNET_PRIVATE_KEY` | Private key for ADI Testnet (with or without 0x prefix) |
| `MAINNET_PRIVATE_KEY` | Private key for ADI Mainnet (only needed if mainnet was selected) |

> Never commit `.env` to source control. `.gitignore` is pre-configured to exclude it.

---

## deploy.mjs flags (Hardhat template)

```bash
npm run deploy                                               # Counter.sol on testnet
CONTRACT=Voting npm run deploy                               # Voting.sol on testnet
NETWORK=mainnet npm run deploy                               # Counter.sol on mainnet
DEPLOY_ARGS='["My Poll",["Yes","No"]]' CONTRACT=Voting npm run deploy  # with constructor args
```

> Always use `npm run deploy` instead of `hardhat ignition deploy`. The ADI testnet RPC does not support the `pending` block tag that Ignition uses for nonce synchronization. The `deploy.mjs` script uses `ethers.js` directly and avoids this issue entirely.

---

## Frontends

Both frontends use `ethers@6` loaded from CDN (`https://esm.sh/ethers@6?bundle`). No build step, no bundler, no framework required. Open the HTML file in any editor, paste your deployed address, and serve over HTTP.

MetaMask does not inject `window.ethereum` into `file://` URLs - always use a local HTTP server.

---

## Testing the CLI locally (contributors)

```bash
# After building create-adi-app
node packages/create-adi-app/dist/index.js my-test-project
```
