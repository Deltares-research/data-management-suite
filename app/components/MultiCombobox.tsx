import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ChevronsUpDown, Check, Loader, X } from 'lucide-react'
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
import { Separator } from './ui/separator'

type MultiComboboxItem = {
  id: string
}

export function createMultiCombobox<TItem extends MultiComboboxItem>() {
  let MultiComboboxContext = React.createContext<{
    value: string[]
    setValue: React.Dispatch<React.SetStateAction<string[]>>
    id: string
    cache: Record<string, TItem>
    searchResults: TItem[]
    setOpen(open: boolean): void
  }>({
    value: [],
    setValue() {},
    id: '',
    cache: {},
    searchResults: [],
    setOpen() {},
  })

  function MultiComboboxRoot({
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
    let [value, setValue] = React.useState<string[]>(defaultValue ?? [])
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
      <MultiComboboxContext.Provider
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
          {value.map((v, i) => (
            <input key={v} type="hidden" name={`${name}`} value={v} />
          ))}
          <Label htmlFor={id}>{label}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            {children}
          </Popover>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      </MultiComboboxContext.Provider>
    )
  }

  function MultiComboboxTrigger({
    children,
    placeholder,
  }: {
    children: ({ value }: { value?: string[] }) => React.ReactNode
    placeholder: string
  }) {
    let { value, id } = React.useContext(MultiComboboxContext)

    return (
      <PopoverTrigger id={id} asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value
            ? children({ value }) ?? <Loader className="w-4 h-4 animate-spin" />
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    )
  }

  function MultiComboboxBadges({
    component: Component,
  }: {
    component: React.ComponentType<{ item?: TItem }>
  }) {
    let { value, setValue, cache } = React.useContext(MultiComboboxContext)

    return (
      value.length > 0 && (
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
              <Component item={cache[v]} />
              <Separator orientation="vertical" className="h-[16px] mx-2" />
              <X className="w-4 h-4" />
            </Button>
          ))}
        </div>
      )
    )
  }

  function MultiComboboxDropdown({
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

  function MultiComboboxInput(props: {
    onValueChange(newValue: string): void
    value: string
    placeholder: string
  }) {
    return <CommandInput {...props} />
  }

  function MultiComboboxItems({
    component: Component,
  }: {
    component: React.ComponentType<{ item: TItem }>
  }) {
    let { searchResults, value, setValue } =
      React.useContext(MultiComboboxContext)
    return (
      <CommandGroup>
        {searchResults.map(item => (
          <CommandItem
            key={item.id}
            value={item.id}
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
                value.includes(item.id) ? 'opacity-100' : 'opacity-0',
              )}
            />
            <Component item={item} />
          </CommandItem>
        ))}
      </CommandGroup>
    )
  }

  let MultiComboboxEmpty = CommandEmpty

  return {
    Root: MultiComboboxRoot,
    Trigger: MultiComboboxTrigger,
    Dropdown: MultiComboboxDropdown,
    Input: MultiComboboxInput,
    Empty: MultiComboboxEmpty,
    Items: MultiComboboxItems,
    Badges: MultiComboboxBadges,
  }
}
