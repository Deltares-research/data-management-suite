import type { Keyword } from '@prisma/client'

export let keywordCache: Record<string, Keyword> = {}
