import type { Group } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import { useField } from 'remix-validated-form'
import type { loader as groupsApiLoader } from '~/routes/api.groups'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Check, ChevronsUpDown, Loader } from 'lucide-react'
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

export function GroupSelector({
  label,
  name,
}: {
  label: string
  name: string
}) {
  // TODO: Generalize
  let [groupCache, setGroupCache] = React.useState<Record<string, Group>>({})
  let { defaultValue, error } = useField(name)
  let [open, setOpen] = React.useState(false)
  let [value, setValue] = React.useState<string>(defaultValue ?? '')
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
      setGroupCache(c => {
        return {
          ...c,
          [group.id]: group,
        }
      })
    }
  }, [fetcher.data])

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger id={id} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? groupCache[value]?.name ?? (
                  <Loader className="w-4 h-4 animate-spin" />
                )
              : 'Select group...'}
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
              placeholder="Search groups..."
            />
            <CommandEmpty>No groups found.</CommandEmpty>
            <CommandGroup>
              {fetcher.data?.map(group => (
                <CommandItem
                  key={group.id}
                  value={group.id}
                  onSelect={setValue}
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
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}
