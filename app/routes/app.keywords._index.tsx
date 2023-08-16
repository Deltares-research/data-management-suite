import { useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'

import type { HTMLProps } from 'react'
import React from 'react'

import type {
  Column,
  ExpandedState,
  ColumnDef,
  Table as TanstackTable,
} from '@tanstack/react-table'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { buildTree } from '~/utils/buildTree'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { DataTablePagination } from '~/components/list-table/data-table-pagination'
import { DataTableToolbar } from '~/components/list-table/data-table-toolbar'
import { ArrowDownFromLine, ArrowRightFromLine } from 'lucide-react'

export async function loader() {
  return db.keyword.findMany({
    orderBy: {
      id: 'asc',
    },
    include: {
      standard: {
        select: {
          name: true,
        },
      },
    },
  })
}

export default function KeywordListPage() {
  let keywords = useLoaderData<typeof loader>()

  let { current: keywordsTree } = React.useRef(
    buildTree(keywords, 'id', 'parentId'),
  )

  const columns = React.useMemo<ColumnDef<(typeof keywordsTree)[number]>[]>(
    () => [
      {
        header: 'Name',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'title',
            header: ({ table }) => (
              <div className="flex items-center gap-2">
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                />{' '}
                <button
                  {...{
                    onClick: table.getToggleAllRowsExpandedHandler(),
                  }}
                >
                  {table.getIsAllRowsExpanded() ? (
                    <ArrowDownFromLine className="w-4 h-4" />
                  ) : (
                    <ArrowRightFromLine className="w-4 h-4" />
                  )}
                </button>{' '}
                Title
              </div>
            ),
            cell: ({ row, getValue }) => (
              <div
                style={{
                  // Since rows are flattened by default,
                  // we can use the row.depth property
                  // and paddingLeft to visually indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                }}
                className="flex items-center gap-2"
              >
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />{' '}
                {row.getCanExpand() ? (
                  <button
                    {...{
                      onClick: row.getToggleExpandedHandler(),
                      style: { cursor: 'pointer' },
                    }}
                  >
                    {row.getIsExpanded() ? (
                      <ArrowDownFromLine className="w-4 h-4" />
                    ) : (
                      <ArrowRightFromLine className="w-4 h-4" />
                    )}
                  </button>
                ) : undefined}
                {getValue()}
              </div>
            ),
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.standard?.name,
            id: 'standard',
            cell: info => info.getValue(),
            header: () => <span>Standard</span>,
            footer: props => props.column.id,
          },
        ],
      },
    ],
    [],
  )

  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const table = useReactTable({
    data: keywordsTree,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="p-8 flex flex-col">
      <div className="pt-12">
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: TanstackTable<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}
