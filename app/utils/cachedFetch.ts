import { LRUCache } from 'lru-cache'

let cache = new LRUCache<string, any>({
  max: 500,
})

export async function cachedFetch(
  url: string,
  {
    requestInit,
    cacheOptions,
  }: {
    requestInit?: RequestInit
    cacheOptions?: LRUCache.SetOptions<string, any, unknown>
  } = {
    cacheOptions: {
      // TODO: Come up with a better default caching mechanism than 1 day
      ttl: 1000 * 60 * 60 * 24,
    },
  },
) {
  let hit = cache.get(url)
  if (hit) return hit

  let data = await fetch(url, requestInit).then(res => res.json())

  cache.set(url, data, cacheOptions)

  return data
}
