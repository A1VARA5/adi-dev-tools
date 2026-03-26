const EXPLORER = 'https://explorer.ab.testnet.adifoundation.ai/address'
const GITHUB_BASE = 'https://github.com/A1VARA5/adi-dev-tools/tree/main/examples'

const EXAMPLES = [
  {
    id: 'counter',
    name: 'Counter dApp',
    glyph: '[+]',
    glyphColor: 'text-accent',
    stack: ['Hardhat v3', 'HTML'],
    description:
      'The simplest possible ADI Chain dApp. Deploy a counter contract, then increment, decrement, or add N - all through a clean frontend.',
    note: 'Good starting point - no caveats, minimal moving parts.',
    noteType: 'ok' as const,
    contracts: null,
    sourceUrl: `${GITHUB_BASE}/counter-dapp`,
    frontendUrl: null,
  },
  {
    id: 'voting',
    name: 'Voting dApp',
    glyph: '[v]',
    glyphColor: 'text-primary',
    stack: ['Foundry', 'HTML'],
    description:
      'Production-ready on-chain voting. Create proposals, cast votes (one per wallet), close voting, and read the winning proposal.',
    note: 'Best full demo - recommended for understanding ADI end-to-end.',
    noteType: 'ok' as const,
    contracts: [{ label: 'ADIVoting', address: '0xCf3c96c15AA11aD470C923d4e580b73c171B1595' }],
    sourceUrl: `${GITHUB_BASE}/voting-dapp`,
    frontendUrl: null,
  },
  {
    id: 'gasless',
    name: 'Gasless Voting',
    glyph: '[g]',
    glyphColor: 'text-yellow',
    stack: ['Foundry', 'HTML'],
    description:
      'Voting + a deployed GaslessPaymaster contract skeleton. Frontend uses plain EIP-1559 since AA_ENABLED is not yet active.',
    note: 'Paymaster is deployed and funded. Chain invocation pending AA_ENABLED flag.',
    noteType: 'warn' as const,
    contracts: [
      { label: 'ADIVoting',        address: '0xCf3c96c15AA11aD470C923d4e580b73c171B1595' },
      { label: 'GaslessPaymaster', address: '0x0cb9523eC2b81042664B0D99F075C3BdD7f3cD18' },
    ],
    sourceUrl: `${GITHUB_BASE}/gasless-voting-dapp`,
    frontendUrl: null,
  },
  {
    id: 'nft',
    name: 'NFT Mint',
    glyph: '[n]',
    glyphColor: 'text-purple',
    stack: ['Foundry', 'HTML'],
    description:
      'ERC-721 contract with configurable mint price, max supply, and an on-chain gallery frontend that loads all minted token metadata.',
    note: null,
    noteType: 'ok' as const,
    contracts: [{ label: 'ADINFT', address: '0x5038fc41a4f74d239ede957ea00ebc045049c829' }],
    sourceUrl: `${GITHUB_BASE}/nft-mint`,
    frontendUrl: null,
  },
  {
    id: 'dao',
    name: 'Simple DAO',
    glyph: '[d]',
    glyphColor: 'text-green',
    stack: ['Foundry', 'HTML'],
    description:
      'On-chain DAO with member management, proposal creation, weighted voting, execution timelock, and a treasury funding mechanism.',
    note: null,
    noteType: 'ok' as const,
    contracts: [{ label: 'SimpleDAO', address: '0x27887d5eb2f420f6df2ee6d04870f82c723cb130' }],
    sourceUrl: `${GITHUB_BASE}/simple-dao`,
    frontendUrl: null,
  },
  {
    id: 'faucet',
    name: 'Token Faucet',
    glyph: '[~]',
    glyphColor: 'text-accent',
    stack: ['Foundry', 'HTML'],
    description:
      'Testnet ADI faucet with a per-wallet cooldown timer, claim history log, and a live balance display. Useful for testnet onboarding.',
    note: null,
    noteType: 'ok' as const,
    contracts: [{ label: 'ADIFaucet', address: '0x4228e476153928399416453723e4c1d8cadeaed1' }],
    sourceUrl: `${GITHUB_BASE}/token-faucet`,
    frontendUrl: null,
  },
]

export default function Examples() {
  return (
    <section id="examples" className="py-24 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">Live on testnet</p>
        <h2 className="font-mono text-3xl font-bold text-slate-200 mb-4">
          Six example dApps. All deployed.
        </h2>
        <p className="text-slate-400 max-w-xl mb-12">
          Every example is live on ADI Testnet. Browse the contract on the explorer,
          read the source, and fork it as a starting point.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAMPLES.map((ex) => (
            <ExampleCard key={ex.id} ex={ex} />
          ))}
        </div>

        {/* Testnet links */}
        <div className="mt-12 p-5 rounded-xl border border-border bg-card flex flex-wrap items-center gap-6 justify-between">
          <div>
            <p className="font-mono text-sm text-slate-200 mb-1">Need testnet ADI?</p>
            <p className="text-xs text-muted">Fund your wallet from the official faucet to deploy and interact with these contracts.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="http://faucet.ab.testnet.adifoundation.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-indigo-500 text-white text-sm font-medium font-mono transition-colors"
            >
              Testnet Faucet
            </a>
            <a
              href="https://explorer.ab.testnet.adifoundation.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-border hover:border-border-hi text-slate-300 text-sm font-medium font-mono transition-colors"
            >
              Explorer
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

type NoteType = 'ok' | 'warn'

function ExampleCard({ ex }: { ex: typeof EXAMPLES[number] }) {
  return (
    <div className="border-top-glow group flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:border-border-hi transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className={`font-mono font-bold text-lg ${ex.glyphColor}`}>{ex.glyph}</span>
          <span className="font-mono font-semibold text-slate-200 text-sm">{ex.name}</span>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {ex.stack.map((s) => (
            <span key={s} className="chip border-border text-muted text-[10px]">{s}</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed flex-1">{ex.description}</p>

      {/* Note */}
      {ex.note && (
        <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${
          (ex.noteType as NoteType) === 'warn'
            ? 'border-yellow/25 bg-yellow/5 text-yellow'
            : 'border-green/25 bg-green/5 text-green'
        }`}>
          {ex.note}
        </div>
      )}

      {/* Contract addresses */}
      {ex.contracts && ex.contracts.length > 0 && (
        <div className="space-y-1.5">
          {ex.contracts.map((c) => (
            <a
              key={c.address}
              href={`${EXPLORER}/${c.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[11px] text-muted hover:text-accent transition-colors group/addr"
            >
              <span className="text-border-hi">#</span>
              <span className="text-slate-400 group-hover/addr:text-slate-300">{c.label}</span>
              <span className="truncate text-muted group-hover/addr:text-accent">
                {c.address.slice(0, 10)}...{c.address.slice(-6)}
              </span>
              <span className="ml-auto text-muted text-[10px]">↗</span>
            </a>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex gap-3 pt-1 border-t border-border">
        <a
          href={ex.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-primary hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          View source ↗
        </a>
      </div>
    </div>
  )
}
