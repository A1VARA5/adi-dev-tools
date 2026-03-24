# SDK Reference

`@adi-devtools/sdk` provides network constants, ethers.js providers, MetaMask helpers, and viem chain definitions for ADI Chain.

```bash
npm i @adi-devtools/sdk
```

---

## Network constants

```typescript
import { ADI_TESTNET, ADI_MAINNET } from "@adi-devtools/sdk";
```

Both constants implement the `ADINetwork` interface (see [[Network Reference]]).

| Export | Type | Description |
|---|---|---|
| `ADI_TESTNET` | `ADINetwork` | Testnet - chain ID 99999 |
| `ADI_MAINNET` | `ADINetwork` | Mainnet - chain ID 36900 |

---

## Provider helpers

### `getADIProvider(network?)`

Returns a read-only `ethers.JsonRpcProvider` connected to ADI Chain.

```typescript
import { getADIProvider } from "@adi-devtools/sdk";

// Defaults to testnet
const provider = getADIProvider();

// Explicit network selection
const testnetProvider = getADIProvider("testnet");
const mainnetProvider = getADIProvider("mainnet");

const block = await provider.getBlockNumber();
const balance = await provider.getBalance("0xYourAddress");
const feeData = await provider.getFeeData();
```

**Returns**: `ethers.JsonRpcProvider` (ethers v6)

> This function uses `ethers@6` only - not `zksync-ethers`. Type-113 transactions are rejected by ADI Chain, and `ethers@6` plain EIP-1559 is the correct approach.

---

## MetaMask helpers

### `switchToADITestnet()`

Switches MetaMask to ADI Testnet. If the network is not yet added, adds it first.

```typescript
import { switchToADITestnet } from "@adi-devtools/sdk";

const btn = document.getElementById("connect");
btn.addEventListener("click", async () => {
  await switchToADITestnet();
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log("Connected:", await signer.getAddress());
});
```

### `addADITestnet()`

Adds ADI Testnet to MetaMask without switching to it.

```typescript
import { addADITestnet } from "@adi-devtools/sdk";

await addADITestnet();
```

### `switchToADIMainnet()` / `addADIMainnet()`

Same as the testnet helpers but for mainnet.

```typescript
import { switchToADIMainnet, addADIMainnet } from "@adi-devtools/sdk";

await switchToADIMainnet();
```

> All MetaMask helpers call `wallet_switchEthereumChain` and fall back to `wallet_addEthereumChain` if the network is not found. They require `window.ethereum` to be present (i.e. MetaMask installed).

---

## Viem chain definitions

```typescript
import { adiTestnet, adiMainnet } from "@adi-devtools/sdk";
import { createPublicClient, createWalletClient, http, custom } from "viem";

// Read
const publicClient = createPublicClient({
  chain: adiTestnet,
  transport: http(),
});

// Write (browser)
const walletClient = createWalletClient({
  chain: adiTestnet,
  transport: custom(window.ethereum),
});
```

> Do not add `eip712WalletActions()` to the wallet client - `zks_getBaseTokenL1Address` is not implemented on ADI RPC. Use plain `walletClient.sendTransaction()`.

---

## Full usage example (browser, no bundler)

```html
<script type="module">
import { BrowserProvider, Contract, formatEther }
  from "https://esm.sh/ethers@6?bundle";
import { switchToADITestnet, ADI_TESTNET }
  from "https://esm.sh/@adi-devtools/sdk?bundle";

const CONTRACT_ADDRESS = "0xYourContractAddress";
const ABI = ["function greet() view returns (string)"];

document.getElementById("connect").onclick = async () => {
  await switchToADITestnet();
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
  console.log(await contract.greet());
};
</script>
```

---

## Module exports summary

```typescript
// Network constants
export { ADI_TESTNET, ADI_MAINNET } from "./chains";
export type { ADINetwork } from "./chains";

// Provider
export { getADIProvider } from "./provider";

// MetaMask
export { switchToADITestnet, addADITestnet, switchToADIMainnet, addADIMainnet } from "./metamask";

// Viem
export { adiTestnet, adiMainnet } from "./viem-chains";
```
