import { useLoaderData } from '@remix-run/react'

import { redirect } from '@remix-run/node'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'

import { db } from '~/utils/db.server'
import { requireAuthentication } from '~/services/auth.server'
import { ItemForm, submitItemForm } from '~/forms/ItemForm'
import { routes } from '~/routes'
import { zx } from 'zodix'
import { z } from 'zod'
import type { AllowedGeometry } from '~/types'
import React from 'react'
import { keywordCache } from '~/utils/keywordCache'
import type { Keyword } from '@prisma/client'

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthentication(request)

  let { itemId } = await zx.parseParams(params, { itemId: z.string() })

  let collections = await db.collection.findMany()

  let defaultValues = await db.item.findUniqueOrThrow({
    where: {
      id: itemId,
    },
    include: {
      keywords: true,
    },
  })

  // Not optimal, but for now cleaner than a full raw query
  let [{ geometry }] = await db.$queryRaw<{ geometry: string }[]>`
    SELECT ST_AsGeoJson(geometry) as geometry
    FROM "Item"
    WHERE "Item"."id" = ${itemId}
  `

  defaultValues.keywords.forEach(kw => {
    keywordCache[kw.id] = kw
  })

  return {
    collections,
    defaultValues: {
      ...defaultValues,
      geometry: JSON.parse(geometry) as AllowedGeometry,
    },
  }
}

export async function action(args: ActionArgs) {
  let { itemId } = zx.parseParams(args.params, { itemId: z.string() })

  await submitItemForm({ ...args, id: itemId })

  return redirect(routes.items())
}

export default function CreatePage() {
  let { collections, defaultValues } = useLoaderData<typeof loader>()

  return (
    <ItemForm
      collections={collections}
      // TODO: Keyword cache very strange, come up with better solution
      initialKeywordCache={defaultValues?.keywords?.reduce((acc, current) => {
        acc[current.id] = current
        return acc
      }, {} as Record<string, Keyword>)}
      defaultValues={{
        ...defaultValues,
        dateRange: {
          from: defaultValues.startTime ?? defaultValues.dateTime ?? '',
          to: defaultValues.endTime ?? '',
        },
        keywords: defaultValues.keywords.map(({ id }) => id),
      }}
    />
  )
}
