export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-sm font-mono font-bold">
                A
              </div>
              <span className="font-mono text-sm font-medium text-slate-200">
                adi<span className="text-primary">/</span>devtools
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Open-source developer tooling for ADI Chain. Built by the community,
              published under MIT license.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://github.com/A1VARA5/adi-dev-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-slate-300 transition-colors text-sm flex items-center gap-1.5"
              >
                <GitHubIcon />
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/org/adi-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-slate-300 transition-colors text-sm flex items-center gap-1.5"
              >
                <NpmIcon />
                npm
              </a>
            </div>
          </div>

          {/* Packages */}
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Packages</p>
            <ul className="space-y-2.5">
              {[
                ['@adi-devtools/sdk',       'https://www.npmjs.com/package/@adi-devtools/sdk'],
                ['hardhat-adi-network',     'https://www.npmjs.com/package/hardhat-adi-network'],
                ['@adi-devtools/contracts', 'https://www.npmjs.com/package/@adi-devtools/contracts'],
                ['create-adi-app',          'https://www.npmjs.com/package/create-adi-app'],
              ].map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-muted hover:text-slate-300 transition-colors"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Resources</p>
            <ul className="space-y-2.5">
              {[
                ['Documentation',   'https://github.com/A1VARA5/adi-dev-tools/wiki'],
                ['Getting Started', 'https://github.com/A1VARA5/adi-dev-tools/wiki/Getting-Started'],
                ['SDK Reference',   'https://github.com/A1VARA5/adi-dev-tools/wiki/SDK-Reference'],
                ['Troubleshooting', 'https://github.com/A1VARA5/adi-dev-tools/wiki/Troubleshooting'],
                ['ADI Explorer',    'https://explorer.ab.testnet.adifoundation.ai'],
                ['Testnet Faucet',  'http://faucet.ab.testnet.adifoundation.ai'],
              ].map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-slate-300 transition-colors"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted font-mono">
            &copy; {year} ADI Dev Tools contributors. MIT License.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <a
              href="https://github.com/A1VARA5/adi-dev-tools/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              License
            </a>
            <a
              href="https://github.com/A1VARA5/adi-dev-tools/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Contributing
            </a>
            <a
              href="https://github.com/A1VARA5/adi-dev-tools/blob/main/CODE_OF_CONDUCT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Code of Conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function NpmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zm8.928 5.686h8.685v12.628H12.76V8.05H9.927v10.264H5.597V5.686h5.094z" />
    </svg>
  )
}
