import { useLoaderData } from '@remix-run/react'
import { CodeBlock, dracula } from 'react-code-blocks'
import type { ZodRawShape, ZodTypeAny } from 'zod'
import { H4 } from '~/components/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { createCreateItemExample } from '~/docs/items/create'
import { createGetItemExample } from '~/docs/items/get'
import { itemSchema } from '~/forms/ItemForm'

export async function loader() {
  let createItemExample = await createCreateItemExample()
  let getItemExample = await createGetItemExample()

  return {
    createItemExample,
    getItemExample,
  }
}

export default function ApiDocs() {
  let { createItemExample, getItemExample } = useLoaderData<typeof loader>()

  return (
    <div className="pl-8 grid grid-cols-[240px_minmax(0,1fr)] gap-10">
      <div>
        <aside className="fixed top-14">
          <div className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              Items
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="./docs"
              >
                Get
              </a>
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="./docs"
              >
                Create
              </a>
              <a
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground"
                target=""
                rel=""
                href="./docs"
              >
                Search
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="py-8 grid grid-flow-row lg:grid-cols-2 gap-6">
        <div className="bg-white">
          <H4>Get Item</H4>
        </div>
        <div className="bg-foreground text-background/80 p-6">
          <h3 className="text-lg my-5">Endpoint</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={`${getItemExample.method} ${
              new URL(getItemExample.endpoint).pathname
            }`}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Example Response</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(getItemExample.exampleResponseBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />
        </div>

        <div className="bg-white">
          <H4>Item Input</H4>
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
            text={JSON.stringify(createItemExample.exampleRequestBody, null, 2)}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Endpoint</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={`${createItemExample.method} ${
              new URL(createItemExample.endpoint).pathname
            }`}
            theme={dracula}
            wrapLongLines
          />

          <h3 className="text-lg my-5">Example Response</h3>
          <CodeBlock
            customStyle={{ fontFamily: 'monospace' }}
            showLineNumbers={false}
            language="ts"
            text={JSON.stringify(
              createItemExample.exampleResponseBody,
              null,
              2,
            )}
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
    case 'ZodLiteral':
      return <>"{def.value}"</>
    case 'ZodString':
      return <>string</>
    case 'ZodNumber':
      return <>number</>
    case 'ZodEffects':
      return <TypeDef def={def?.schema?._def} />
    default:
      console.log(def.typeName, 'not implemented', def)
      return
  }
}
