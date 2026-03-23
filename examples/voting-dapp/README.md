# ADI Chain Voting dApp

A production-ready on-chain voting example built on ADI Chain.

## What it demonstrates

- Deploying a Solidity contract to ADI Testnet with Foundry
- Reading contract state with ethers.js
- Sending transactions from a browser (MetaMask)
- Auto-adding ADI Testnet to MetaMask via `wallet_addEthereumChain`
- Live vote count progress bars + winner detection

ZK proofs happen automatically - Airbender proves every batch and posts it to Ethereum L1. You don't write any ZK code.

## Quick start

### 1. Get testnet ADI

```
http://faucet.ab.testnet.adifoundation.ai
```

### 2. Set your private key

```bash
# bash / WSL2
export TESTNET_PRIVATE_KEY="0x..."

# PowerShell (Windows)
$env:TESTNET_PRIVATE_KEY="0x..."
```

### 3. Deploy the contract

```bash
forge script script/Voting.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast \
  --private-key $TESTNET_PRIVATE_KEY
```

Copy the deployed contract address from the output.

### 4. Update the frontend

Open `frontend/index.html` and paste your address into:

```js
const CONTRACT_ADDRESS = "0xYourDeployedAddressHere";
```

### 5. Open the dApp

Open `frontend/index.html` in your browser. No server needed.

## Network details

| | |
|---|---|
| RPC | `https://rpc.ab.testnet.adifoundation.ai` |
| Chain ID | `99999` |
| Explorer | `https://explorer.ab.testnet.adifoundation.ai` |
| Faucet | `http://faucet.ab.testnet.adifoundation.ai` |
