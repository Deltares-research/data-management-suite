import { createHash } from 'node:crypto'

export function encodeToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}
