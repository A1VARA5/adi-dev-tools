import { useState } from 'react'
import CopyButton from './CopyButton'

const PACKAGES = [
  {
    id: 'sdk',
    name: '@adi-devtools/sdk',
    tagline: 'Network constants, ethers.js providers, MetaMask helpers, and viem chain definitions.',
    install: 'npm install @adi-devtools/sdk',
    npmUrl: 'https://www.npmjs.com/package/@adi-devtools/sdk',
    code: `import {
  ADI_TESTNET,           // { chainId, rpcUrl, explorerUrl, ... }
  ADI_MAINNET,
  getADIProvider,        // returns ethers.JsonRpcProvider
  addADITestnet,         // MetaMask wallet_addEthereumChain
  switchToADITestnet,
  adiTestnet,            // viem Chain definition
} from '@adi-devtools/sdk'

// Read-only provider - no wallet needed
const provider = getADIProvider('testnet')
const block = await provider.getBlockNumber()

// Add ADI Chain to MetaMask
await addADITestnet()

// Viem / wagmi usage
import { createPublicClient, http } from 'viem'
const client = createPublicClient({ chain: adiTestnet, transport: http() })`,
    codeLines: [
      { t: 'import {',                                         c: 'tok-kw' },
      { t: '  ADI_TESTNET,           // { chainId, rpcUrl, explorerUrl, ... }', c: 'tok-dim' },
      { t: '  ADI_MAINNET,',                                  c: 'tok-dim' },
      { t: "  getADIProvider,        // returns ethers.JsonRpcProvider", c: 'tok-dim' },
      { t: "  addADITestnet,         // MetaMask wallet_addEthereumChain", c: 'tok-dim' },
      { t: "  switchToADITestnet,",                            c: 'tok-dim' },
      { t: "  adiTestnet,            // viem Chain definition", c: 'tok-dim' },
      { t: "} from '@adi-devtools/sdk'",                       c: 'tok-str' },
      { t: '',                                                  c: '' },
      { t: '// Read-only provider - no wallet needed',         c: 'tok-comment' },
      { t: "const provider = getADIProvider('testnet')",       c: '' },
      { t: 'const block = await provider.getBlockNumber()',    c: '' },
      { t: '',                                                  c: '' },
      { t: '// Add ADI Chain to MetaMask',                     c: 'tok-comment' },
      { t: 'await addADITestnet()',                             c: '' },
    ],
  },
  {
    id: 'plugin',
    name: 'hardhat-adi-network',
    tagline: 'One-line Hardhat plugin. ADI Testnet and Mainnet auto-injected - no manual RPC config.',
    install: 'npm install hardhat-adi-network',
    npmUrl: 'https://www.npmjs.com/package/hardhat-adi-network',
    showBeforeAfter: true,
    code: '',
    codeLines: [],
  },
  {
    id: 'contracts',
    name: '@adi-devtools/contracts',
    tagline: 'Auditable Solidity templates + typed ABIs and addresses for all 7 ADI system contracts.',
    install: 'npm install @adi-devtools/contracts',
    npmUrl: 'https://www.npmjs.com/package/@adi-devtools/contracts',
    codeLines: [
      { t: '// Import Solidity templates',                    c: 'tok-comment' },
      { t: "// (from node_modules/@adi-devtools/contracts/src/)",c: 'tok-comment' },
      { t: "// ADIVoting.sol  ADIToken.sol  ADINFT.sol",      c: 'tok-comment' },
      { t: '// ADIFaucet.sol  ADIPaymaster.sol (future)',      c: 'tok-warn' },
      { t: '',                                                 c: '' },
      { t: '// Typed ABIs + deployed addresses',              c: 'tok-comment' },
      { t: "import {",                                        c: 'tok-kw' },
      { t: "  BOOTLOADER_ABI, BOOTLOADER_ADDRESS,",           c: 'tok-dim' },
      { t: "  BASE_TOKEN_ABI, BASE_TOKEN_ADDRESS,",           c: 'tok-dim' },
      { t: "  MSG_VALUE_ABI,  MSG_VALUE_ADDRESS,",            c: 'tok-dim' },
      { t: "} from '@adi-devtools/contracts/system'",         c: 'tok-str' },
      { t: '',                                                 c: '' },
      { t: '// Note: BASE_TOKEN.balanceOf(uint256)',          c: 'tok-warn' },
      { t: '// takes uint256, not address.',                  c: 'tok-warn' },
      { t: '// Use provider.getBalance(address) instead.',   c: 'tok-warn' },
    ],
  },
  {
    id: 'cli',
    name: 'create-adi-app',
    tagline: 'Interactive project scaffold CLI. Hardhat or Foundry, pre-configured and ready to deploy.',
    install: 'npx create-adi-app my-project',
    npmUrl: 'https://www.npmjs.com/package/create-adi-app',
    codeLines: [
      { t: '$ npx create-adi-app my-project',                c: 'tok-cmd' },
      { t: '',                                               c: '' },
      { t: '  ? Project name   my-project',                  c: 'tok-dim' },
      { t: '  ? Framework      Hardhat v3   |   Foundry',    c: 'tok-accent' },
      { t: '  ? Template       Counter  |  Voting',          c: 'tok-dim' },
      { t: '',                                               c: '' },
      { t: '  + contracts/MyContract.sol',                   c: 'tok-ok' },
      { t: '  + hardhat.config.ts (ADI pre-configured)',     c: 'tok-ok' },
      { t: '  + frontend/index.html',                        c: 'tok-ok' },
      { t: '  + .env.example',                               c: 'tok-ok' },
      { t: '',                                               c: '' },
      { t: '  cd my-project && npm run dev',                 c: 'tok-accent' },
    ],
  },
] as const

const BEFORE_CODE = [
  { t: '// hardhat.config.ts - WITHOUT plugin', c: 'tok-comment' },
  { t: 'const config: HardhatUserConfig = {', c: '' },
  { t: '  networks: {', c: '' },
  { t: '    adiTestnet: {', c: '' },
  { t: "      type: 'http',", c: 'tok-str' },
  { t: "      chainType: 'generic',", c: 'tok-str' },
  { t: "      url: 'https://rpc.ab.testnet.adifoundation.ai',", c: 'tok-str' },
  { t: '      accounts: [configVariable("TESTNET_KEY")],', c: '' },
  { t: '    },', c: '' },
  { t: '    adiMainnet: {', c: '' },
  { t: "      type: 'http',", c: 'tok-str' },
  { t: "      chainType: 'generic',", c: 'tok-str' },
  { t: "      url: 'https://rpc.ab.mainnet.adifoundation.ai',", c: 'tok-str' },
  { t: '      accounts: [configVariable("MAINNET_KEY")],', c: '' },
  { t: '    },', c: '' },
  { t: '  },', c: '' },
  { t: '  ignition: { requiredConfirmations: 1 },', c: '' },
  { t: '}', c: '' },
]

const AFTER_CODE = [
  { t: '// hardhat.config.ts - WITH plugin', c: 'tok-comment' },
  { t: "import 'hardhat-adi-network'", c: 'tok-str' },
  { t: '', c: '' },
  { t: '// ADI Testnet + Mainnet are auto-injected.', c: 'tok-ok' },
  { t: '// Nothing else needed.', c: 'tok-ok' },
  { t: '', c: '' },
  { t: 'const config: HardhatUserConfig = {', c: '' },
  { t: '  // your other config...', c: 'tok-comment' },
  { t: '}', c: '' },
  { t: '', c: '' },
  { t: '// Deploy:', c: 'tok-comment' },
  { t: '$ npx hardhat deploy --network adi-testnet', c: 'tok-cmd' },
  { t: '$ npx hardhat deploy --network adi-mainnet', c: 'tok-cmd' },
]

export default function Packages() {
  const [active, setActive] = useState<string>('sdk')
  const pkg = PACKAGES.find((p) => p.id === active)!

  return (
    <section id="packages" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <p className="section-label mb-3">The stack</p>
        <h2 className="font-mono text-3xl font-bold text-slate-200 mb-4">
          Four packages. All on npm.
        </h2>
        <p className="text-slate-400 max-w-xl mb-12">
          Every piece of the ADI Chain dev stack is published and versioned. Install
          individually or scaffold everything with the CLI.
        </p>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {PACKAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                active === p.id
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-slate-300 hover:bg-card'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Package detail */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="font-mono text-xl font-bold text-slate-200 mb-2">{pkg.name}</div>
              <p className="text-slate-400 text-sm leading-relaxed">{pkg.tagline}</p>
            </div>

            {/* Install command */}
            <div>
              <p className="text-xs text-muted font-mono mb-2">install</p>
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3 font-mono text-sm">
                <span className="text-primary">$</span>
                <span className="text-slate-200 flex-1 truncate">{pkg.install}</span>
                <CopyButton text={pkg.install} />
              </div>
            </div>

            {/* npm link */}
            <a
              href={pkg.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-indigo-400 transition-colors font-mono"
            >
              View on npm
              <span>↗</span>
            </a>

            {/* Extra context for contracts */}
            {pkg.id === 'contracts' && (
              <div className="p-4 rounded-xl border border-yellow/30 bg-yellow/5 text-sm">
                <p className="text-yellow font-mono font-medium mb-1">Paymaster notice</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  ADIPaymaster.sol is deployed as a reference template.
                  The <code className="text-yellow">AA_ENABLED</code> bootloader flag is not
                  yet active on ADI Chain OS - paymaster invocations are submitted as plain
                  EIP-1559 transactions.
                </p>
              </div>
            )}
          </div>

          {/* Right - Code panel */}
          <div className="lg:col-span-3">
            {pkg.id === 'plugin' ? (
              <BeforeAfterDemo />
            ) : (
              <CodePanel lines={pkg.codeLines as unknown as { t: string; c: string }[]} title={pkg.name} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CodePanel({ lines, title }: { lines: { t: string; c: string }[]; title: string }) {
  return (
    <div className="terminal-chrome">
      <div className="terminal-titlebar">
        <div className="terminal-dot bg-red-500/70" />
        <div className="terminal-dot bg-yellow-500/70" />
        <div className="terminal-dot bg-green-500/70" />
        <span className="ml-3 text-xs text-muted font-mono flex-1">{title}</span>
        <CopyButton text={lines.map((l) => l.t).join('\n')} label="copy" />
      </div>
      <div className="p-5 font-mono text-sm leading-7 overflow-x-auto scrollbar-x-hidden">
        {lines.map((line, i) => (
          <div key={i} className={line.c || 'text-slate-300'}>
            {line.t || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  )
}

function BeforeAfterDemo() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Before */}
        <div>
          <div className="text-xs font-mono text-red mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red inline-block" />
            without plugin
          </div>
          <div className="terminal-chrome">
            <div className="p-4 font-mono text-xs leading-6 overflow-x-auto scrollbar-x-hidden">
              {BEFORE_CODE.map((line, i) => (
                <div key={i} className={line.c || 'text-slate-300'}>
                  {line.t || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* After */}
        <div>
          <div className="text-xs font-mono text-green mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green inline-block" />
            with plugin
          </div>
          <div className="terminal-chrome border-green/20">
            <div className="p-4 font-mono text-xs leading-6 overflow-x-auto scrollbar-x-hidden">
              {AFTER_CODE.map((line, i) => (
                <div key={i} className={line.c || 'text-slate-300'}>
                  {line.t || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted font-mono">
        Network constants are injected automatically by{' '}
        <code className="text-accent">extendConfig</code> - no copy-pasting chain IDs or
        RPC URLs.
      </p>
    </div>
  )
}
