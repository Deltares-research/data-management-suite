'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '~/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { useField } from 'remix-validated-form'
import { ErrorMessage, Muted } from './typography'
import { Label } from './ui/label'

export function DateRangePicker({
  className,
  helper,
  label,
}: React.HTMLAttributes<HTMLDivElement> & {
  label: string
  helper?: string
}) {
  let { error: errorStart, defaultValue: defaultStart } = useField(
    'properties.start_datetime',
  )
  let { error: errorEnd, defaultValue: defaultEnd } = useField(
    'properties.end_datetime',
  )
  let { error: fromError } = useField(`properties.start_datetime`)
  let { error: toError } = useField(`properties.end_datetime`)
  let id = React.useId()

  const [dateRange, setDate] = React.useState<DateRange | undefined>({
    from: defaultStart ? new Date(defaultStart) : undefined,
    to: defaultStart ? new Date(defaultEnd) : undefined,
  })

  return (
    <div className={cn('grid gap-2', className)}>
      <input
        type="hidden"
        name={`properties.start_datetime`}
        value={dateRange?.from?.toJSON()}
      />
      <input
        type="hidden"
        name={`properties.end_datetime`}
        value={dateRange?.to?.toJSON()}
      />
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {helper && <Muted>{helper}</Muted>}
      {errorStart && <ErrorMessage>{errorStart}</ErrorMessage>}
      {errorEnd && <ErrorMessage>{errorEnd}</ErrorMessage>}
      {fromError && <ErrorMessage>{fromError}</ErrorMessage>}
      {toError && <ErrorMessage>{toError}</ErrorMessage>}
    </div>
  )
}
