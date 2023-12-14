import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ChevronsUpDown, Check, Loader } from 'lucide-react'
import { cn } from '~/utils'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import { useField } from 'remix-validated-form'
import { Label } from './ui/label'
import { ErrorMessage } from './typography'
import { useFetcher } from '@remix-run/react'

type ComboboxItem = {
  id: string
}

export function createCombobox<TItem extends ComboboxItem>() {
  let ComboboxContext = React.createContext<{
    value: string
    setValue(newValue: string): void
    id: string
    cache: Record<string, TItem>
    searchResults: TItem[]
    setOpen(open: boolean): void
  }>({
    value: '',
    setValue() {},
    id: '',
    cache: {},
    searchResults: [],
    setOpen() {},
  })

  function ComboboxRoot({
    name,
    label,
    url,
    children,
  }: {
    name: string
    label: string
    url: string
    children: React.ReactNode
  }) {
    let [cache, setCache] = React.useState<Record<string, TItem>>({})

    let fetcher = useFetcher<TItem[]>()

    let { defaultValue, error } = useField(name)
    let [open, setOpen] = React.useState(false)
    let [value, setValue] = React.useState<string>(defaultValue)
    let id = React.useId()

    React.useEffect(() => {
      fetcher.load(url)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    React.useEffect(() => {
      if (!fetcher.data) return

      for (let item of fetcher.data as TItem[]) {
        setCache(c => {
          return {
            ...c,
            [item.id]: item,
          }
        })
      }
    }, [fetcher.data])

    return (
      <ComboboxContext.Provider
        value={{
          value,
          id,
          cache,
          searchResults: (fetcher.data ?? []) as TItem[],
          setOpen,
          setValue,
        }}
      >
        <div className="flex flex-col gap-1.5">
          <input type="hidden" name={name} value={value} />
          <Label htmlFor={id}>{label}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            {children}
          </Popover>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      </ComboboxContext.Provider>
    )
  }

  function ComboboxTrigger({
    children,
    placeholder,
  }: {
    children: ({ item }: { item?: TItem }) => React.ReactNode
    placeholder: string
  }) {
    let { value, cache, id } = React.useContext(ComboboxContext)

    return (
      <PopoverTrigger id={id} asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value
            ? children({ item: cache[value] }) ?? (
                <Loader className="w-4 h-4 animate-spin" />
              )
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    )
  }

  function ComboboxDropdown({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) {
    return (
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command label={label} shouldFilter={false}>
          {children}
        </Command>
      </PopoverContent>
    )
  }

  function ComboboxInput(props: {
    onValueChange(newValue: string): void
    value: string
    placeholder: string
  }) {
    return <CommandInput {...props} />
  }

  function ComboboxItems({
    component: Component,
  }: {
    component: React.ComponentType<{ item: TItem }>
  }) {
    let { searchResults, value, setValue, setOpen } =
      React.useContext(ComboboxContext)
    return (
      <CommandGroup>
        {searchResults.map(item => (
          <CommandItem
            key={item.id}
            value={item.id}
            onSelect={currentValue => {
              setValue(currentValue === value ? '' : currentValue)
              setOpen(false)
            }}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                value === item.id ? 'opacity-100' : 'opacity-0',
              )}
            />
            <Component item={item} />
          </CommandItem>
        ))}
      </CommandGroup>
    )
  }

  let ComboboxEmpty = CommandEmpty

  return {
    Root: ComboboxRoot,
    Trigger: ComboboxTrigger,
    Dropdown: ComboboxDropdown,
    Input: ComboboxInput,
    Empty: ComboboxEmpty,
    Items: ComboboxItems,
  }
}
