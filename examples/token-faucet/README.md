# token-faucet - ADI Chain Example

A testnet ADI faucet - deploy the contract, fund it, and let developers claim free ADI tokens through a polished single-file HTML frontend. No build step required.

## What's included

| File | Purpose |
|---|---|
| `src/Faucet.sol` | Faucet contract - drip + cooldown + owner controls |
| `script/Faucet.s.sol` | Foundry deploy script |
| `frontend/index.html` | Claim UI with cooldown timer + recent claims history |

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- A funded testnet wallet (needs ADI to deploy and fund the faucet)

## Deploy the contract

```bash
cd examples/token-faucet

# Build
forge build

# Deploy (0.5 ADI drip, 24-hour cooldown)
forge script script/Faucet.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast \
  --private-key $TESTNET_PRIVATE_KEY
```

The script prints the deployed faucet address.

## Fund the faucet

```bash
cast send <FAUCET_ADDRESS> --value 10ether \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --private-key $TESTNET_PRIVATE_KEY
```

## Wire up the frontend

Open `frontend/index.html` and paste your deployed address:

```js
const CONTRACT_ADDRESS = "0xYourDeployedAddress";
```

## Run locally

```bash
cd frontend
python -m http.server 8084
```

Open [http://localhost:8084](http://localhost:8084) in your browser.

## Faucet defaults

| Parameter | Value |
|---|---|
| Drip amount | 0.5 ADI per claim |
| Cooldown | 24 hours per address |

## Owner controls

Connect with the deployer wallet to unlock the owner panel:

- **Set Drip Amount** - change how much ADI per claim
- **Set Cooldown** - change the wait time between claims
- **Fund (1 ADI)** - top up the faucet from the UI
- **Withdraw All** - drain remaining ADI back to owner

## Network info

| | |
|---|---|
| Chain ID | 99 999 |
| RPC | https://rpc.ab.testnet.adifoundation.ai |
| Explorer | https://explorer.ab.testnet.adifoundation.ai |
