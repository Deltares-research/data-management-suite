import { useLoaderData } from '@remix-run/react'

import { redirect } from '@remix-run/node'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'

import { db } from '~/utils/db.server'
import { authenticator } from '~/services/auth.server'
import { ItemForm, submitItemForm } from '~/forms/ItemForm'
import { routes } from '~/routes'
import { zx } from 'zodix'
import { z } from 'zod'
import type { AllowedGeometry } from '~/types'

export async function loader({ request, params }: LoaderArgs) {
  await authenticator.isAuthenticated(request)

  let { itemId } = await zx.parseParams(params, { itemId: z.string() })

  let collections = await db.collection.findMany()

  let defaultValues = await db.item.findUniqueOrThrow({
    where: {
      id: itemId,
    },
    include: {
      keywords: {
        select: {
          id: true,
        },
      },
    },
  })

  // Not optimal, but for now cleaner than a full raw query
  let [{ geometry }] = await db.$queryRaw<{ geometry: string }[]>`
    SELECT ST_AsGeoJson(geometry) as geometry
    FROM "Item"
    WHERE "Item"."id" = ${itemId}
  `

  return {
    collections,
    defaultValues: {
      ...defaultValues,
      geometry: JSON.parse(geometry) as AllowedGeometry,
    },
  }
}

export async function action(args: ActionArgs) {
  await submitItemForm(args)

  return redirect(routes.items())
}

export default function CreatePage() {
  let { collections, defaultValues } = useLoaderData<typeof loader>()

  return (
    <ItemForm
      collections={collections}
      defaultValues={{
        ...defaultValues,
        keywords: defaultValues.keywords.map(({ id }) => id),
      }}
    />
  )
}
