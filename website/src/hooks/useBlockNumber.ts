import { useState, useEffect } from 'react'

const RPC = 'https://rpc.ab.testnet.adifoundation.ai'

type Status = 'connecting' | 'live' | 'error'

export function useBlockNumber(interval = 5000) {
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>('connecting')
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    async function fetch() {
      const t0 = Date.now()
      try {
        const res = await window.fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        })
        const data = await res.json()
        const ms = Date.now() - t0
        if (!active) return
        const num = parseInt(data.result, 16)
        setBlockNumber(num)
        setLatency(ms)
        setStatus('live')
      } catch {
        if (!active) return
        setStatus('error')
      }
    }

    fetch()
    const id = setInterval(fetch, interval)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [interval])

  return { blockNumber, status, latency }
}
