# simple-dao — ADI Chain Example

A minimal DAO with on-chain governance and treasury on ADI Chain Testnet. Members submit proposals, vote by wallet, and execute passing proposals to release funds — all from a single-file HTML frontend.

## What's included

| File | Purpose |
|---|---|
| `src/DAO.sol` | DAO contract — membership, proposals, voting, treasury |
| `script/DAO.s.sol` | Foundry deploy script |
| `frontend/index.html` | Proposals + voting UI (ethers@6 CDN) |

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- MetaMask with ADI Testnet (the frontend will prompt you to add it)
- A funded testnet wallet — get ADI from the [faucet](https://faucet.adifoundation.ai)

## Deploy the contract

```bash
cd examples/simple-dao

# Build
forge build

# Deploy
forge script script/DAO.s.sol \
  --rpc-url https://rpc.ab.testnet.adifoundation.ai \
  --broadcast \
  --private-key $TESTNET_PRIVATE_KEY
```

The script prints the deployed DAO address.

## Fund the treasury (optional)

To test treasury-releasing proposals, send ADI to the contract:

```bash
cast send <DAO_ADDRESS> \
  --value 1ether \
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
python -m http.server 8081
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

## DAO defaults

| Parameter | Value |
|---|---|
| Name | ADI Community DAO |
| Voting duration | 3 days |
| Quorum | 20 % of members |

To customise, edit the constructor arguments in `script/DAO.s.sol`.

## Governance flow

1. **Join** — any wallet can call `join()` to become a member
2. **Propose** — members submit proposals (description + optional treasury release amount)
3. **Vote** — one vote per member per proposal (`FOR` or `AGAINST`), during the voting window
4. **Finalize** — anyone calls `finalize()` after the deadline to record the outcome
5. **Execute** — anyone calls `execute()` on a passed proposal to release treasury funds

## Network info

| | |
|---|---|
| Chain ID | 99 999 |
| RPC | https://rpc.ab.testnet.adifoundation.ai |
| Explorer | https://explorer.ab.testnet.adifoundation.ai |
