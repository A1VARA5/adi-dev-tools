import { useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { useBlockNumber } from '../hooks/useBlockNumber'

const TERMINAL_LINES = [
  { text: '$ npx create-adi-app my-dapp',       speed: 38, delay: 0,    className: 'tok-cmd' },
  { text: '',                                    speed: 1,  delay: 320,  className: '' },
  { text: '  Scaffolding ADI Chain project...',  speed: 6,  delay: 100,  className: 'tok-dim' },
  { text: '',                                    speed: 1,  delay: 80,   className: '' },
  { text: '  > Framework   Hardhat v3',          speed: 5,  delay: 40,   className: 'tok-dim' },
  { text: '  > Chain       ADI Testnet (99999)', speed: 5,  delay: 40,   className: 'tok-dim' },
  { text: '  > Plugin      hardhat-adi-network', speed: 5,  delay: 40,   className: 'tok-dim' },
  { text: '',                                    speed: 1,  delay: 80,   className: '' },
  { text: '  + templates copied',                speed: 5,  delay: 60,   className: 'tok-ok' },
  { text: '  + dependencies installed',          speed: 5,  delay: 60,   className: 'tok-ok' },
  { text: '  + ADI testnet pre-configured',      speed: 5,  delay: 60,   className: 'tok-ok' },
  { text: '',                                    speed: 1,  delay: 100,  className: '' },
  { text: '  Ready.  cd my-dapp && npm run dev', speed: 8,  delay: 200,  className: 'tok-accent' },
]

export default function Hero() {
  const { displayedLines, done } = useTypewriter(TERMINAL_LINES, 800)
  const { blockNumber, status, latency } = useBlockNumber()
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText('npx create-adi-app my-dapp')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative min-h-screen dot-grid flex flex-col justify-center pt-16 pb-12 overflow-hidden">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #6366f115, transparent)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full">
        {/* Live status bar */}
        <div className="flex items-center gap-3 mb-10">
          <LiveBadge status={status} blockNumber={blockNumber} latency={latency} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text content */}
          <div>
            <p className="section-label mb-4">Developer tooling</p>

            <h1 className="font-mono text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] mb-6">
              <span className="text-gradient">Build on ADI Chain.</span>
              <br />
              <span className="text-slate-400">Without the config hell.</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              Full SDK, Hardhat plugin, Solidity contract templates, and a project CLI -
              all EVM-compatible, all published to npm. One command to get started.
            </p>

            {/* Install command */}
            <div className="group relative mb-6">
              <div className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 font-mono text-sm hover:border-border-hi transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-primary select-none">$</span>
                  <span className="text-slate-200">npx create-adi-app my-dapp</span>
                </div>
                <button
                  onClick={copy}
                  className="shrink-0 ml-4 px-3 py-1 rounded-lg text-xs border border-border hover:border-border-hi hover:bg-surface text-muted hover:text-slate-300 transition-all"
                >
                  {copied ? (
                    <span className="text-green">copied</span>
                  ) : (
                    'copy'
                  )}
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/A1VARA5/adi-dev-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                View on GitHub
                <ArrowIcon />
              </a>
              <a
                href="https://github.com/A1VARA5/adi-dev-tools/wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border hover:border-border-hi text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Read the docs
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              <Stat label="packages" value="4" />
              <Stat label="example dApps" value="6" />
              <Stat label="EVM-compatible" value="100%" />
              <Stat label="npm scope" value="@adi-devtools" mono />
            </div>
          </div>

          {/* Right - Animated terminal */}
          <div className="w-full">
            <div className="terminal-chrome animate-glow">
              {/* Title bar */}
              <div className="terminal-titlebar">
                <div className="terminal-dot bg-red-500/70" />
                <div className="terminal-dot bg-yellow-500/70" />
                <div className="terminal-dot bg-green-500/70" />
                <span className="ml-3 text-xs text-muted font-mono">
                  terminal
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-5 font-mono text-sm leading-relaxed min-h-[320px] overflow-hidden">
                {displayedLines.map((line, i) => (
                  <div key={i} className={line.className ?? 'text-slate-300'}>
                    {line.text || '\u00A0'}
                  </div>
                ))}
                {/* Blinking cursor on last line while typing */}
                {!done && (
                  <span className="inline-block w-2 h-4 bg-primary animate-blink align-bottom" />
                )}
                {done && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="tok-dim text-xs">
                      ADI Chain · Chain ID 99999 · EVM-compatible
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Package badges below terminal */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                '@adi-devtools/sdk',
                'hardhat-adi-network',
                '@adi-devtools/contracts',
                'create-adi-app',
              ].map((pkg) => (
                <a
                  key={pkg}
                  href={`https://www.npmjs.com/package/${pkg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip border-border text-muted hover:text-slate-300 hover:border-border-hi transition-colors"
                >
                  <span className="text-primary">npm</span>
                  {pkg}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LiveBadge({
  status,
  blockNumber,
  latency,
}: {
  status: 'connecting' | 'live' | 'error'
  blockNumber: number | null
  latency: number | null
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-mono">
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'live'
            ? 'bg-green animate-pulse'
            : status === 'error'
            ? 'bg-red'
            : 'bg-yellow animate-pulse'
        }`}
      />
      <span className="text-muted">ADI Testnet</span>
      <span className="text-border-hi">|</span>
      {status === 'live' && blockNumber ? (
        <>
          <span className="text-slate-300">
            Block <span className="text-accent">#{blockNumber.toLocaleString()}</span>
          </span>
          {latency && (
            <>
              <span className="text-border-hi">|</span>
              <span className="text-muted">{latency}ms</span>
            </>
          )}
        </>
      ) : status === 'error' ? (
        <span className="text-red">RPC unreachable</span>
      ) : (
        <span className="text-muted">connecting...</span>
      )}
    </div>
  )
}

function Stat({
  value,
  label,
  mono,
}: {
  value: string
  label: string
  mono?: boolean
}) {
  return (
    <div>
      <div className={`text-xl font-bold text-slate-200 ${mono ? 'font-mono text-base' : ''}`}>
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}
