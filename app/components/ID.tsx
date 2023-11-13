import React from 'react'
import { Badge } from './ui/badge'
import { Copy } from 'lucide-react'

export function ID({ children }: { children: string }) {
  let [copied, setCopied] = React.useState(false)

  function copy() {
    navigator.clipboard.writeText(children)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="relative flex">
      <div
        className={`bg-white border border-border absolute text-muted-foreground top-0 transform transition rounded-md px-2 py-1 uppercase text-xs ${
          copied ? '-translate-y-8' : '-translate-y-6 opacity-0'
        }`}
      >
        Copied
      </div>
      <Badge variant="secondary" className="cursor-pointer" onClick={copy}>
        <Copy className="w-3 h-3 mr-1.5" /> {children.slice(-5)}
      </Badge>
    </div>
  )
}
