import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-sm font-mono font-bold">
            A
          </div>
          <span className="font-mono text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            adi<span className="text-primary">/</span>devtools
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="https://github.com/A1VARA5/adi-dev-tools/wiki" external>
            Docs
          </NavLink>
          <NavLink href="https://github.com/A1VARA5/adi-dev-tools" external>
            GitHub
          </NavLink>
          <NavLink href="https://www.npmjs.com/org/adi-devtools" external>
            npm
          </NavLink>
          <a
            href="https://github.com/A1VARA5/adi-dev-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-4 py-1.5 rounded-lg bg-primary hover:bg-indigo-500 text-white text-sm font-medium font-mono transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu - minimal */}
        <a
          href="https://github.com/A1VARA5/adi-dev-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="md:hidden p-2 text-muted hover:text-slate-200 transition-colors"
        >
          <GitHubIcon />
        </a>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-slate-200 hover:bg-card transition-colors font-medium"
    >
      {children}
    </a>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
