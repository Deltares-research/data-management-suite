import type { Group } from '@prisma/client'
import { useFetcher, useLoaderData } from '@remix-run/react'
import React from 'react'
import { useField } from 'remix-validated-form'
import type { loader as groupsApiLoader } from '~/routes/api.groups'
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
import type { loader as catalogEditLoader } from '~/routes/app.catalogs.$catalogId.edit'

export function GroupsSelector({
  label,
  name,
}: {
  label: string
  name: string
}) {
  // TODO: Generalize
  let loaderData = useLoaderData<typeof catalogEditLoader>()
  let { initialGroupCache = [] } = loaderData ?? {}

  let { current: groupCache } = React.useRef<Record<string, Group>>(
    initialGroupCache.reduce((acc, current) => {
      acc[current.id] = current
      return acc
    }, {} as Record<string, Group>) ?? {},
  )
  let { defaultValue, error } = useField(name)
  let [open, setOpen] = React.useState(false)
  let [value, setValue] = React.useState<string[]>(defaultValue ?? [])
  let [search, setSearch] = React.useState('')
  let id = React.useId()

  let fetcher = useFetcher<typeof groupsApiLoader>()

  React.useEffect(() => {
    fetcher.load(`/api/groups?q=${search}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  React.useEffect(() => {
    if (!fetcher.data) return

    for (let group of fetcher.data) {
      groupCache[group.id] = group
    }
  }, [fetcher.data, groupCache])

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {value.map((groupId, i) => (
        <input
          key={groupId}
          type="hidden"
          name={`${name}[${i}]`}
          value={groupId}
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
            {groupCache[v]?.name}{' '}
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
            Select group...
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
              {fetcher.data?.map(group => (
                <CommandItem
                  key={group.id}
                  value={group.id}
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
                      value.includes(group.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex items-center gap-1">
                    <strong className="text-foreground flex items-center gap-1.5 font-medium">
                      {group.name}
                    </strong>
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
