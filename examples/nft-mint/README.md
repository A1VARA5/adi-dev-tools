# nft-mint - ADI Chain Example

A minimal NFT collection example on ADI Chain Testnet. Deploy an ERC-721 contract and mint/browse tokens through a single-file HTML frontend - no build step required.

## What's included

| File | Purpose |
|---|---|
| `src/NFT.sol` | ERC-721 contract - configurable supply, price, metadata |
| `script/NFT.s.sol` | Foundry deploy script |
| `frontend/index.html` | Mint + gallery UI (ethers@6 CDN) |

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- MetaMask with ADI Testnet (the frontend will prompt you to add it)
- A funded testnet wallet - get ADI from the [faucet](https://faucet.adifoundation.ai)

## Deploy the contract

```bash
cd examples/nft-mint

# Install OpenZeppelin (first time only)
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Build
forge build

# Deploy
forge script script/NFT.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast \
  --private-key $TESTNET_PRIVATE_KEY
```

The script prints the deployed contract address.

## Wire up the frontend

Open `frontend/index.html` and paste your deployed address:

```js
const CONTRACT_ADDRESS = "0xYourDeployedAddress";
```

## Run locally

```bash
cd frontend
python -m http.server 8081
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

## Collection defaults

| Parameter | Value |
|---|---|
| Name | ADI Chain Collectibles |
| Symbol | ADIC |
| Max supply | 1 000 |
| Mint price | 0 ADI (free) |
| Minting | Open on deploy |

To customise, edit the constructor arguments in `script/NFT.s.sol`.

## Owner functions

Connect with the deployer wallet to unlock the owner panel:

- **Toggle minting** - open or close the mint window
- **Set mint price** - charge ADI per token
- **Withdraw** - pull contract balance to owner address

## Network info

| | |
|---|---|
| Chain ID | 99 999 |
| RPC | https://rpc.ab.testnet.adifoundation.ai |
| Explorer | https://explorer.ab.testnet.adifoundation.ai |
