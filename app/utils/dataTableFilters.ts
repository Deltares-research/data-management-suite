import type { LoaderArgs } from '@remix-run/node'
import { zx } from 'zodix'

export function getDataTableFilters(request: LoaderArgs['request']) {
  let { page = 0, take = 5 } = zx.parseQuery(request, {
    page: zx.IntAsString.optional(),
    take: zx.IntAsString.refine(
      value => value > 0 && value <= 50,
      'take should be between 0 and 50',
    ).optional(),
  })

  return { take, skip: take * page }
}
