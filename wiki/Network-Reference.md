# Network Reference

All ADI Chain network details in one place.

---

## Testnet (AB Testnet)

| Field | Value |
|---|---|
| Network name | ADI Network AB Testnet |
| Chain ID | `99999` |
| Chain ID (hex) | `0x1869F` |
| RPC URL | `https://rpc.ab.testnet.adifoundation.ai` |
| Block explorer | `https://explorer.ab.testnet.adifoundation.ai` |
| Faucet | `http://faucet.ab.testnet.adifoundation.ai` |
| Bridge | `https://bridge.ab.testnet.adifoundation.ai` |
| Native currency | ADI (18 decimals) |

---

## Mainnet

| Field | Value |
|---|---|
| Network name | ADI Network |
| Chain ID | `36900` |
| Chain ID (hex) | `0x9024` |
| RPC URL | `https://rpc.adifoundation.ai` |
| Block explorer | `https://explorer.adifoundation.ai` |
| Bridge | `https://bridge.adifoundation.ai` |
| Native currency | ADI (18 decimals) |

> ADI Chain mainnet launched March 2026.

---

## Using network constants from the SDK

```typescript
import { ADI_TESTNET, ADI_MAINNET } from "@adi-devtools/sdk";

console.log(ADI_TESTNET.chainId);    // 99999
console.log(ADI_MAINNET.rpcUrl);     // https://rpc.adifoundation.ai
```

The full `ADINetwork` interface:

```typescript
interface ADINetwork {
  name: string;
  chainId: number;
  chainIdHex: string;      // e.g. "0x1869F"
  rpcUrl: string;
  explorerUrl: string;
  faucetUrl?: string;      // testnet only
  bridgeUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;      // always 18
  };
}
```

---

## Using viem chain definitions

```typescript
import { adiTestnet, adiMainnet } from "@adi-devtools/sdk";
import { createPublicClient, http } from "viem";

const client = createPublicClient({
  chain: adiTestnet,
  transport: http(),
});
```

> **Note for viem users**: Do not use `eip712WalletActions()` on ADI Chain - the ZKSync-specific `zks_getBaseTokenL1Address` RPC method is not implemented. Use plain `walletClient.sendTransaction()` with EIP-1559.

---

## Transaction type constraints

ADI Chain OS (Airbender) enforces these rules:

| What | Status |
|---|---|
| EIP-1559 (type 2) | Supported - use for all transactions |
| Legacy (type 0) | Supported |
| Type-113 (ZKSync native AA) | Rejected by chain |
| Paymaster transactions | Not invoked (AA_ENABLED=false) - see [[ADI Chain Internals]] |

Always use plain `ethers@6` or `viem`. Do NOT use `zksync-ethers` for browser frontends - it is Node.js-only and its CDN bundle does not work.

---

## Official documentation

- Testnet details: https://docs.adi.foundation/how-to-start/adi-network-testnet-details
- Mainnet details: https://docs.adi.foundation/how-to-start/adi-network-mainnet-details
- Quickstart: https://docs.adi.foundation/how-to-start/adi-network-testnet-quickstart
