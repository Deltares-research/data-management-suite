import {
  randAnimal,
  randNumber,
  randParagraph,
  randRecentDate,
  randSoonDate,
  randUuid,
} from '@ngneat/falso'
import { randomPolygon } from '@turf/turf'
import { CodeBlock, dracula } from 'react-code-blocks'
import type { ZodRawShape, ZodTypeAny, z } from 'zod'
import { H4 } from '~/components/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { createItemFormSchema } from '~/forms/items'
import type { action as createItemAction } from './api.items'
import { itemRouteParams } from './api.items_.$itemId'
import { itemRouteParams as stacItemRouteParams } from '~/routes/stac.items.$id'
import { searchQuerySchema } from './app.search'
import type { loader as searchLoader } from './api.search'
import { Link, useLoaderData } from '@remix-run/react'
import { routes } from '~/routes'
import type { LoaderArgs } from '@remix-run/node'
import type { StacItem } from '~/utils/prismaToStac'

let itemSchema = createItemFormSchema()
type ItemSchema = z.infer<typeof itemSchema>

let createItemRequestBody: ItemSchema = {
  geometry: randomPolygon(1, { num_vertices: 3 }).features[0].geometry,
  start_datetime: randRecentDate().toISOString(),
  end_datetime: randSoonDate().toISOString(),
  collectionId: randUuid(),
  properties: {
    title: randAnimal(),
    projectNumber: randNumber().toFixed(0),
    description: randParagraph(),
  },
}

let itemResponseBody: Awaited<ReturnType<typeof createItemAction>> = {
  id: randUuid(),
  properties: {
    ...createItemRequestBody.properties,
    datetime: undefined,
    start_datetime: randRecentDate().toISOString(),
    end_datetime: randSoonDate().toISOString(),
  },
  geometry: createItemRequestBody.geometry,
  stac_version: '1.0.0',
  type: 'Feature',
  links: [],
  assets: {},
}

let createItemExample = {
  requestBody: createItemRequestBody,
  responseBody: itemResponseBody,
  method: 'POST',
  url: '/api/items',
}

let editItemExample = {
  requestBody: createItemRequestBody,
  responseBody: itemResponseBody,
  method: 'PATCH',
  url: '/api/items/:id',
}

let getItemResponseBody: StacItem = itemResponseBody

let getItemExample = {
  responseBody: getItemResponseBody,
  method: 'GET',
  url: '/stac/items/:itemId',
}

let searchItemsResponseBody: Awaited<ReturnType<typeof searchLoader>> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      stac_version: '1.0.0',
      id: randUuid(),
      links: [],
      assets: {},
      geometry: randomPolygon(1, { num_vertices: 3 }).features[0].geometry,
      properties: {
        datetime: undefined,
        start_datetime: randRecentDate().toISOString(),
        end_datetime: randRecentDate().toISOString(),
      },
    },
  ],
}

let searchItemsExample = {
  responseBody: searchItemsResponseBody,
  method: 'GET',
  url: '/api/search',
}

export function loader({ request }: LoaderArgs) {
  return { host: new URL(request.url).host }
}

export default function ApiDocs() {
  let { host } = useLoaderData<typeof loader>()

  return (
    <div className="pl-8 grid grid-cols-[240px_minmax(0,1fr)] gap-x-10">
      <div>
        <aside className="fixed top-20">
          <div className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              Items
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="#auth"
              >
                Authorization
              </a>
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="#get"
              >
                Get
              </a>
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="#create"
              >
                Create
              </a>
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="#edit"
              >
                Edit
              </a>
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="#search"
              >
                Search
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid grid-flow-row lg:grid-cols-2 gap-x-6">
        <div id="get" className="bg-white py-6">
          <H4>Authorization</H4>
          <div className="pt-3">
            Endpoints that perform mutations require authorization through a{' '}
            <code>Bearer</code> token. Go to{' '}
            <Link to={routes.settings()}>your settings page</Link> to create and
            manage your API keys. Include the generated token in the{' '}
            <code>Authorization</code> header of your request
          </div>
        </div>
        <div className="bg-foreground text-background/80 p-6">
          <h3 className="text-lg my-5">Example Request</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="bash"
            text={`
curl -X POST "https://${host}/items"
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
            `}
            theme={dracula}
            wrapLongLines
          />
        </div>

        <div id="get" className="bg-white py-6">
          <H4>Get Item</H4>
          <div className="pt-3">
            <strong>Route Params</strong>
            <SchemaTable shape={stacItemRouteParams} />
          </div>
        </div>
        <div className="bg-foreground text-background/80 p-6">
          <h3 className="text-lg my-5">Endpoint</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={`${getItemExample.method} ${getItemExample.url}`}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Example Response</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(getItemExample.responseBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />
        </div>

        <div id="create" className="bg-white py-6">
          <H4>Create Item</H4>
          <div className="pt-3">
            <SchemaTable shape={itemSchema.shape} />
          </div>
        </div>
        <div className="bg-foreground text-background/80 p-6">
          <h3 className="text-lg my-5">Example Input</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(createItemExample.requestBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Endpoint</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={`${createItemExample.method} ${createItemExample.url}`}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Example Response</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(createItemExample.responseBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />
        </div>

        <div id="edit" className="bg-white py-6">
          <H4>Edit Item</H4>
          <div className="pt-3">
            <strong>Route Params</strong>
            <SchemaTable shape={itemRouteParams} />
          </div>
          <div className="pt-5">
            <strong>Request Body</strong>
            <SchemaTable shape={itemSchema.shape} />
          </div>
        </div>
        <div className="bg-foreground text-background/80 p-6">
          <h3 className="text-lg my-5">Example Input</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(editItemExample.requestBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Endpoint</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={`${editItemExample.method} ${editItemExample.url}`}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Example Response</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(editItemExample.responseBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />
        </div>

        <div id="search" className="bg-white py-6">
          <H4>Item Search</H4>
          <div className="pt-3">
            <strong>Query Params</strong>
            <SchemaTable shape={searchQuerySchema} />
          </div>
        </div>
        <div className="bg-foreground text-background/80 p-6">
          <h3 className="text-lg my-5">Endpoint</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={`${searchItemsExample.method} ${searchItemsExample.url}`}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Example Response</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(searchItemsExample.responseBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />
        </div>
      </div>
    </div>
  )
}

function SchemaTable({ shape }: { shape: ZodRawShape }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(shape).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>
              <code>{key}</code>
            </TableCell>
            <TableCell>
              <code>
                <TypeDef def={value._def} name={key} />
              </code>
            </TableCell>
            <TableCell>{value.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function SchemaTableCondensed({ shape }: { shape: ZodRawShape }) {
  return (
    <Table>
      <TableBody>
        {Object.entries(shape).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>
              <code>{key}</code>
            </TableCell>
            <TableCell>
              <code>
                <TypeDef def={value._def} name={key} />
              </code>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TypeDef({ name, def }: { name?: string; def: ZodTypeAny['_def'] }) {
  switch (def.typeName) {
    case 'ZodOptional':
      return (
        <>
          <TypeDef def={def?.innerType?._def} /> (optional)
        </>
      )
    case 'ZodNullable':
      return (
        <>
          <TypeDef def={def?.innerType?._def} /> | null
        </>
      )
    case 'ZodArray':
      return (
        <>
          <TypeDef def={def?.type?._def} />
          []
        </>
      )
    case 'ZodObject':
      return <SchemaTableCondensed shape={def.shape()} />
    case 'ZodRecord':
      return (
        <>
          Record&lt;
          <TypeDef def={def?.keyType._def} />,{' '}
          <TypeDef def={def?.valueType._def} />
          &gt;
        </>
      )
    case 'ZodLiteral':
      return <>"{def.value}"</>
    case 'ZodString':
      return <>string</>
    case 'ZodNumber':
      return <>number</>
    case 'ZodEffects':
      return <TypeDef def={def?.schema?._def} />
    case 'ZodAny':
      return 'any'
    default:
      console.log(def.typeName, 'not implemented', def)
      return
  }
}
