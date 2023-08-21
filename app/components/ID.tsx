import { Badge } from './ui/badge'

export function ID({ children }: { children: string }) {
  return <Badge variant="secondary">{children.slice(-5)}</Badge>
}
