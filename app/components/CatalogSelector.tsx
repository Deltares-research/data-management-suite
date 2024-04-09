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
import type { Catalog } from '@prisma/client'
import { useField } from 'remix-validated-form'
import { Label } from './ui/label'
import type { SerializeFrom } from '@remix-run/node'
import { ErrorMessage } from './typography'

export function CatalogSelector({
  catalogs,
  name,
  label,
  value: _value,
  onValueChange,
}: {
  catalogs: SerializeFrom<Catalog>[]
  name: string
  label: string
  value?: string
  onValueChange?(value: string): void
}) {
  let { defaultValue, error } = useField(name)
  let [open, setOpen] = React.useState(false)
  let [value, setValue] = React.useState<string>(defaultValue ?? _value)
  let id = React.useId()

  let selectedCatalog = catalogs.find(c => c.id === value)

  React.useEffect(() => {
    if (_value) {
      setValue(_value)
    }
  }, [_value])

  function _setValue(newValue: string) {
    setValue(newValue)
    onValueChange?.(newValue)
  }

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
            {selectedCatalog ? selectedCatalog.title : 'Select catalog...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command>
            <CommandInput placeholder="Search catalogs..." />
            <CommandEmpty>No catalogs found.</CommandEmpty>
            <CommandGroup>
              {catalogs.map(catalog => (
                <CommandItem
                  key={catalog.id}
                  value={catalog.id}
                  onSelect={currentValue => {
                    _setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === catalog.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div>
                    <strong className="block">{catalog.title}</strong>
                    <span className="block text-muted-foreground">
                      {catalog.description}
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
