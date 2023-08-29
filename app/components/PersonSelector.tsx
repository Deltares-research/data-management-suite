import type { Person } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import { useField } from 'remix-validated-form'
import type { loader } from '~/routes/api.person'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { ErrorMessage } from './typography'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import { cn } from '~/utils'

export function PersonSelector({
  label,
  name,
  initialCache,
}: {
  label: string
  name: string
  initialCache: Record<string, Person>
}) {
  let { current: personCache } =
    React.useRef<Record<string, Person>>(initialCache)
  let { defaultValue, error } = useField(name)
  let [open, setOpen] = React.useState(false)
  let [value, setValue] = React.useState<string[]>(defaultValue ?? [])
  let [search, setSearch] = React.useState('')
  let id = React.useId()

  let fetcher = useFetcher<typeof loader>()

  React.useEffect(() => {
    fetcher.load(`/api/person?q=${search}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  React.useEffect(() => {
    if (!fetcher.data) return

    for (let person of fetcher.data) {
      personCache[person.id] = person
    }
  }, [fetcher.data, personCache])

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {value.map((personId, i) => (
        <input
          key={personId}
          type="hidden"
          name={`${name}[${i}]`}
          value={personId}
        />
      ))}
      <div className="mb-1.5 flex gap-1.5 flex-wrap">
        {value.map(v => (
          <Button
            onClick={() => {
              setValue(current => current.filter(c => c !== v))
            }}
            type="button"
            key={v}
            size="sm"
            variant="secondary"
          >
            {personCache[v]?.name}{' '}
            <small className="ml-2 text-muted-foreground">
              ({personCache[v]?.email})
            </small>
            <Separator orientation="vertical" className="h-[16px] mx-2" />
            <X className="w-4 h-4" />
          </Button>
        ))}
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger id={id} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Select person...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search people..."
            />
            <CommandEmpty>No people found.</CommandEmpty>
            <CommandGroup>
              {fetcher.data?.map(person => (
                <CommandItem
                  key={person.id}
                  value={person.id}
                  onSelect={newValue => {
                    setValue(currentValue =>
                      currentValue.includes(newValue)
                        ? currentValue.filter(v => v !== newValue)
                        : [...currentValue, newValue],
                    )
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(person.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex items-center gap-1">
                    <strong className="text-foreground flex items-center gap-1.5 font-medium">
                      {person.name}
                    </strong>
                    <small className="text-muted-foreground">
                      {person.email}
                    </small>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
