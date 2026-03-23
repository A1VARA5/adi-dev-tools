# adi-local-dev — Local ADI Chain Docker Environment

> **Linux / WSL2 only.** The ADI Chain node (zksync-os-server) is a Rust binary that runs on Linux only.
> Windows users: install WSL2 (`wsl --install` as Administrator) then use this from inside WSL2.

Spins up a full local ADI development environment with one command:

```bash
docker compose up
```

## What runs

| Service | Port | Description |
|---|---|---|
| `l1-anvil` | `8545` | Local Ethereum L1 (Anvil) with ADI system state pre-loaded |
| `adi-node` | `3050` | ADI L2 node with dummy proofs (no GPU needed) |

## Quick start

```bash
# 1. Clone / enter
cd docker

# 2. Start (first run pulls images)
docker compose up

# 3. Configure your tools for local ADI
# RPC URL:  http://localhost:3050
# Chain ID: 99999 (same as testnet)

# 4. Deploy a contract locally
forge script script/MyContract.s.sol \
  --rpc-url http://localhost:3050 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  # ^ Anvil default dev key — do NOT use on mainnet
```

## Dummy proofs vs real proofs

`USE_DUMMY_PROOFS=true` means the node skips actual STARK proof generation. Transactions still execute correctly on L2 — you just won't get proofs verified on L1. This is fine for local development and testing.

For real proof generation you need:
- The Airbender prover (`ADI-Stack-Airbender-Prover`)
- A GPU (Nvidia recommended)
- The full sequencer stack

## Troubleshooting

**Image not found**: The `adi-stack-server` image must be built from [ADI-Foundation-Labs/ADI-Stack-Server](https://github.com/ADI-Foundation-Labs/ADI-Stack-Server). Check that repo for build instructions.

**L1 state file missing**: Obtain `zkos-l1-state.json` from the ADI-Stack-Server repo (scripts or releases). Place it in `docker/l1-state/`.

**Port conflict**: Change `3050:3050` to `13050:3050` in docker-compose.yml if port 3050 is taken.
