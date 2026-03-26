import { useState, useEffect, useRef } from 'react'

interface TypewriterLine {
  text: string
  delay?: number   // ms to wait before this line starts
  speed?: number   // ms per character
  className?: string
}

export function useTypewriter(lines: TypewriterLine[], startDelay = 600) {
  const [displayedLines, setDisplayedLines] = useState<{ text: string; className?: string }[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const initial = setTimeout(() => {
      tick(0, 0, [])
    }, startDelay)

    return () => clearTimeout(initial)

    function tick(lineIdx: number, charIdx: number, rendered: { text: string; className?: string }[]) {
      if (lineIdx >= lines.length) {
        setDisplayedLines(rendered)
        setDone(true)
        return
      }

      const line = lines[lineIdx]
      const speed = line.speed ?? 28
      const lineDelay = charIdx === 0 ? (line.delay ?? 0) : 0

      setTimeout(() => {
        const nextChar = charIdx + 1
        const partial = line.text.slice(0, nextChar)
        const newRendered = [
          ...rendered.slice(0, lineIdx),
          { text: partial, className: line.className },
        ]

        setDisplayedLines(newRendered)
        setCurrentLine(lineIdx)
        setCurrentChar(nextChar)

        if (nextChar < line.text.length) {
          tick(lineIdx, nextChar, newRendered)
        } else {
          // Line done - move to next
          tick(lineIdx + 1, 0, newRendered)
        }
      }, lineDelay + (charIdx === 0 && lineDelay > 0 ? 0 : speed))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { displayedLines, currentLine, currentChar, done }
}
