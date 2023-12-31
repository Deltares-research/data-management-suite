import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '~/utils'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import type { Collection } from '@prisma/client'
import { useField } from 'remix-validated-form'
import { Label } from './ui/label'
import type { SerializeFrom } from '@remix-run/node'
import { ErrorMessage } from './typography'

export function CollectionSelector({
  collections,
  name,
  label,
}: {
  collections: SerializeFrom<
    Collection & { catalog?: { title: string | null } }
  >[]
  name: string
  label: string
}) {
  let { defaultValue, error } = useField(name)
  let [open, setOpen] = React.useState(false)
  let [search, setSearch] = React.useState('')
  let [value, setValue] = React.useState<string>(defaultValue)
  let id = React.useId()

  let selectedCollection = collections.find(c => c.id === value)

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger id={id} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCollection
              ? selectedCollection.title
              : 'Select collection...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command label="Search collections" shouldFilter={false}>
            <CommandInput
              placeholder="Search collections..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No collections found.</CommandEmpty>
            <CommandGroup>
              {collections
                .filter(
                  c =>
                    !search ||
                    c?.title.toLowerCase().includes(search.toLowerCase()) ||
                    c?.description
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map(collection => (
                  <CommandItem
                    key={collection.id}
                    value={collection.id}
                    onSelect={currentValue => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === collection.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div>
                      <strong className="block">{collection.title}</strong>
                      <span className="block text-muted-foreground">
                        {collection.catalog?.title}
                      </span>
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
