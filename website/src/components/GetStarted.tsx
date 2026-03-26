import CopyButton from './CopyButton'

const STEPS = [
  {
    n: '01',
    title: 'Scaffold your project',
    desc: 'The CLI generates a complete project with contracts, frontend, and pre-configured tooling.',
    code: 'npx create-adi-app my-dapp',
    note: null,
  },
  {
    n: '02',
    title: 'Set your private key',
    desc: 'Add your testnet wallet private key to .env. Never commit this file - it is gitignored by default.',
    code: 'TESTNET_PRIVATE_KEY=0xYOUR_KEY_HERE',
    note: 'Need testnet ADI? Get some from faucet.ab.testnet.adifoundation.ai',
  },
  {
    n: '03',
    title: 'Deploy to ADI Testnet',
    desc: 'The Hardhat plugin injects ADI testnet automatically. No chain ID or RPC URL to configure.',
    code: 'npx hardhat ignition deploy --network adi-testnet',
    note: null,
  },
  {
    n: '04',
    title: 'Paste the contract address',
    desc: 'Copy the deployed address into frontend/index.html where prompted, then open the frontend.',
    code: 'const CONTRACT_ADDRESS = "0x..."  // paste here',
    note: null,
  },
  {
    n: '05',
    title: 'Open the frontend',
    desc: 'Serve the frontend locally. No bundler needed - the template is a single HTML file.',
    code: 'python -m http.server 8080  # or any static server',
    note: null,
  },
]

export default function GetStarted() {
  return (
    <section id="start" className="py-24 px-6 bg-surface/20 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">Quick start</p>
        <h2 className="font-mono text-3xl font-bold text-slate-200 mb-4">
          From zero to deployed in 5 steps.
        </h2>
        <p className="text-slate-400 max-w-xl mb-14">
          No ZKSync SDK, no custom transaction types, no platform lock-in.
          Standard EIP-1559 all the way.
        </p>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

          <div className="space-y-6">
            {STEPS.map((step) => (
              <Step key={step.n} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({
  step,
}: {
  step: typeof STEPS[number]
}) {
  return (
    <div className="flex gap-6 items-start group">
      {/* Step number */}
      <div className="shrink-0 w-12 h-12 rounded-xl border border-primary/40 bg-primary-dark flex items-center justify-center font-mono text-xs font-bold text-primary group-hover:border-primary group-hover:bg-primary/10 transition-all">
        {step.n}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="font-mono font-semibold text-slate-200 text-sm">{step.title}</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-lg leading-relaxed">{step.desc}</p>
          </div>
        </div>

        {/* Command */}
        <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 font-mono text-sm mt-3 group-hover:border-border-hi transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-primary shrink-0">$</span>
            <span className="text-slate-300 truncate">{step.code}</span>
          </div>
          <CopyButton text={step.code} />
        </div>

        {step.note && (
          <p className="text-xs text-muted font-mono mt-2 pl-1">{step.note}</p>
        )}
      </div>
    </div>
  )
}
