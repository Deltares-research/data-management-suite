import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { Table } from '@tanstack/react-table'

import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useSearchParams } from '@remix-run/react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  count: number
}

export function DataTablePagination<TData>({
  table,
  count,
}: DataTablePaginationProps<TData>) {
  let [searchParams, setSearchParams] = useSearchParams()
  let amountSelected = table.getFilteredSelectedRowModel().rows.length

  let take = +(searchParams.get('take') ?? 10)
  let page = +(searchParams.get('page') ?? 0)

  let totalPages = Math.ceil(count / take)

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {amountSelected > 0 ? (
          <>
            {amountSelected} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </>
        ) : undefined}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${take}`}
            onValueChange={value => {
              searchParams.set('take', value)
              setSearchParams(searchParams)
              // table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={take} />
            </SelectTrigger>
            <SelectContent side="top">
              {[2, 5, 10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              searchParams.set('page', '0')
              setSearchParams(searchParams)
            }}
            disabled={page <= 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              searchParams.set('page', (page - 1).toString())
              setSearchParams(searchParams)
            }}
            disabled={page <= 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              searchParams.set('page', (page + 1).toString())
              setSearchParams(searchParams)
            }}
            disabled={page >= totalPages - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              searchParams.set('page', (totalPages - 1).toString())
              setSearchParams(searchParams)
            }}
            disabled={page >= totalPages - 1}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
