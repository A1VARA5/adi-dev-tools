import { useState } from 'react'

export default function CopyButton({
  text,
  label,
}: {
  text: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="text-xs font-mono px-2 py-1 rounded border border-border hover:border-border-hi text-muted hover:text-slate-300 transition-all shrink-0"
    >
      {copied ? <span className="text-green">✓</span> : (label ?? '⎘')}
    </button>
  )
}
