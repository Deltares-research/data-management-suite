import { CodeBlock, dracula } from 'react-code-blocks'
import type {
  ZodObject,
  ZodObjectDef,
  ZodRawShape,
  ZodSchema,
  ZodTypeAny,
  ZodTypeDef,
} from 'zod'
import { ZodType } from 'zod'
import { H3, H4 } from '~/components/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { itemSchema } from '~/forms/ItemForm'

export default function ApiDocs() {
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

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white">
          <H4>Item Input</H4>
          <SchemaTable shape={itemSchema.shape} />
        </div>
        <div className="bg-[#282A36]">
          <CodeBlock
            showLineNumbers={false}
            language="ts"
            text="let kek: Kek = 'kek'"
            theme={dracula}
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
              <TypeDef def={value._def} name={key} />
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
              <TypeDef def={value._def} name={key} />
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
    default:
      console.log(def.typeName, 'not implemented')
      return
  }
}
