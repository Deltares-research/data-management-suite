import { useLoaderData } from '@remix-run/react'

import { redirect } from '@remix-run/node'
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  V2_MetaFunction,
} from '@remix-run/node'

import { db } from '~/utils/db.server'
import { requireAuthentication } from '~/services/auth.server'
import { ItemForm, submitItemForm } from '~/forms/items/ItemForm'
import { routes } from '~/routes'
import { zx } from 'zodix'
import { z } from 'zod'
import type { AllowedGeometry } from '~/types'
import { prismaToStacItem } from '~/utils/prismaToStac'
import { getCollectionAuthReadWhere } from '~/utils/authQueries'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Edit metadata' }]
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  let { itemId } = await zx.parseParams(params, { itemId: z.string() })

  let collections = await db.collection.findMany({
    include: {
      catalog: {
        select: {
          title: true,
        },
      },
    },
    where: getCollectionAuthReadWhere(user.id),
  })

  let defaultValues = await db.item.findUnique({
    where: {
      id: itemId,
      collection: getCollectionAuthReadWhere(user.id),
    },
    include: {
      assets: true,
    },
  })

  if (!defaultValues) throw redirect(routes.items())

  // Not optimal, but for now cleaner than a full raw query
  let [{ geometry }] = await db.$queryRaw<{ geometry: string }[]>`
    SELECT ST_AsGeoJson(geometry) as geometry
    FROM "Item"
    WHERE "Item"."id" = ${itemId}
  `

  return {
    collections,
    defaultValues: prismaToStacItem({
      ...defaultValues,
      geometry: JSON.parse(geometry) as AllowedGeometry,
      request,
    }),
  }
}

export async function action(args: ActionFunctionArgs) {
  let { itemId } = zx.parseParams(args.params, { itemId: z.string() })

  await submitItemForm({ ...args, id: itemId })

  return redirect(routes.items())
}

export default function CreatePage() {
  let { collections, defaultValues } = useLoaderData<typeof loader>()

  return <ItemForm collections={collections} defaultValues={defaultValues} />
}
