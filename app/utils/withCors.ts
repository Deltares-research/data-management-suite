import type { LoaderArgs, LoaderFunction } from '@remix-run/node'
import { Response, json } from '@remix-run/node'

export function withCors(loader: LoaderFunction) {
  return async function loaderWithCors({ request, ...args }: LoaderArgs) {
    if (request.method === `OPTIONS`) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'content-type',
        },
      })
    }

    let data = await loader({ request, ...args })

    return json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
