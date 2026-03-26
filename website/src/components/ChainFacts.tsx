import CopyButton from './CopyButton'

const NETWORKS = [
  {
    name: 'Testnet',
    badge: 'text-accent border-accent/30 bg-accent/5',
    rows: [
      { k: 'Chain ID',     v: '99999',                                             mono: true },
      { k: 'Chain ID Hex', v: '0x1869F',                                           mono: true },
      { k: 'RPC URL',      v: 'https://rpc.ab.testnet.adifoundation.ai',           mono: true, copy: true },
      { k: 'Explorer',     v: 'https://explorer.ab.testnet.adifoundation.ai',      mono: true, link: true },
      { k: 'Faucet',       v: 'http://faucet.ab.testnet.adifoundation.ai',         mono: true, link: true },
      { k: 'Currency',     v: 'ADI (18 decimals)',                                 mono: false },
    ],
  },
  {
    name: 'Mainnet',
    badge: 'text-primary border-primary/30 bg-primary/5',
    rows: [
      { k: 'Chain ID',     v: '36900',                                             mono: true },
      { k: 'Chain ID Hex', v: '0x9024',                                            mono: true },
      { k: 'RPC URL',      v: 'https://rpc.ab.mainnet.adifoundation.ai',           mono: true, copy: true },
      { k: 'Explorer',     v: 'https://explorer.ab.mainnet.adifoundation.ai',      mono: true, link: true },
      { k: 'Currency',     v: 'ADI (18 decimals)',                                 mono: false },
    ],
  },
]

const GOTCHAS = [
  {
    type: 'fix',
    title: 'Use wallet_addEthereumChain, not wallet_switchEthereumChain',
    body: 'MetaMask does not always throw error code 4902 for unknown chains - it can return -32603. The safe pattern is to call wallet_addEthereumChain directly. It switches if the chain is already added, or adds+switches if not.',
    code: "await ethereum.request({ method: 'wallet_addEthereumChain', params: [ADI_TESTNET] })",
  },
  {
    type: 'fix',
    title: 'Use ethers@6 - not zksync-ethers',
    body: "zksync-ethers is Node.js-only and type-113 (ZKSync native AA) transactions are rejected by ADI Chain OS. Standard EIP-1559 via ethers@6 works without issues.",
    code: 'import { BrowserProvider, Contract } from "https://esm.sh/ethers@6?bundle"',
  },
  {
    type: 'warn',
    title: 'BASE_TOKEN.balanceOf() takes uint256, not address',
    body: "The system BASE_TOKEN contract has a non-standard ABI where balanceOf accepts a uint256 (internal token ID), not a wallet address. Use provider.getBalance(address) to read ADI balances.",
    code: 'const bal = await provider.getBalance(walletAddress) // correct',
  },
  {
    type: 'info',
    title: 'Paymaster / Account Abstraction is not yet active',
    body: "The AA_ENABLED bootloader flag is currently false on ADI Chain OS (Airbender). GaslessPaymaster.sol is deployed as a reference - transactions are submitted as plain EIP-1559 until the flag is enabled by ADI Foundation.",
    code: null,
  },
  {
    type: 'fix',
    title: 'Hardhat v3 requires chainType and requiredConfirmations',
    body: 'Hardhat v3 network configs need chainType: "generic" and ignition.requiredConfirmations: 1. The hardhat-adi-network plugin injects these automatically.',
    code: 'ignition: { requiredConfirmations: 1 }  // required for ADI testnet',
  },
]

export default function ChainFacts() {
  return (
    <section id="chain" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">The chain</p>
        <h2 className="font-mono text-3xl font-bold text-slate-200 mb-4">
          Network constants and known gotchas.
        </h2>
        <p className="text-slate-400 max-w-xl mb-12">
          ADI Chain is fully EVM-compatible - but a few platform-specific behaviors trip
          people up. Listed here so you don't waste time debugging them.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Network tables */}
          <div className="space-y-6">
            {NETWORKS.map((net) => (
              <div key={net.name} className="terminal-chrome">
                <div className="terminal-titlebar">
                  <div className="terminal-dot bg-red-500/70" />
                  <div className="terminal-dot bg-yellow-500/70" />
                  <div className="terminal-dot bg-green-500/70" />
                  <span className="ml-3 text-xs font-mono text-muted flex-1">
                    ADI {net.name}
                  </span>
                  <span className={`chip border text-[10px] ${net.badge}`}>
                    Chain
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {net.rows.map((row) => (
                    <div key={row.k} className="flex items-center justify-between px-4 py-2.5 gap-4">
                      <span className="text-xs text-muted shrink-0 w-28">{row.k}</span>
                      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                        {row.link ? (
                          <a
                            href={row.v}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-primary hover:text-indigo-400 transition-colors truncate"
                          >
                            {row.v}
                          </a>
                        ) : (
                          <span className={`${row.mono ? 'font-mono' : ''} text-xs text-slate-300 truncate`}>
                            {row.v}
                          </span>
                        )}
                        {row.copy && <CopyButton text={row.v} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Gotchas */}
          <div className="space-y-4">
            <p className="text-xs text-muted font-mono tracking-wider uppercase mb-5">Things to know</p>
            {GOTCHAS.map((g, i) => (
              <Gotcha key={i} g={g} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Gotcha({
  g,
}: {
  g: {
    type: string
    title: string
    body: string
    code: string | null
  }
}) {
  const colors = {
    fix:  { border: 'border-green/25',  bg: 'bg-green/5',  dot: 'bg-green',  text: 'text-green'  },
    warn: { border: 'border-yellow/25', bg: 'bg-yellow/5', dot: 'bg-yellow', text: 'text-yellow' },
    info: { border: 'border-primary/25',bg: 'bg-primary/5',dot: 'bg-primary',text: 'text-primary'},
  }[g.type] ?? { border: 'border-border', bg: '', dot: 'bg-muted', text: 'text-muted' }

  return (
    <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colors.dot}`} />
        <p className={`font-mono text-sm font-medium ${colors.text}`}>{g.title}</p>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed pl-5 mb-2">{g.body}</p>
      {g.code && (
        <div className="ml-5 mt-2 bg-surface/80 rounded-lg px-3 py-2 font-mono text-xs text-slate-300 border border-border overflow-x-auto scrollbar-x-hidden">
          {g.code}
        </div>
      )}
    </div>
  )
}
