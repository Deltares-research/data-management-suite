import React from 'react'
import type { loader as groupsApiLoader } from '~/routes/api.groups'
import { createMultiCombobox } from './MultiCombobox'
import { createCombobox } from './Combobox'

type ItemType = Awaited<ReturnType<typeof groupsApiLoader>>[number]

let Combobox = createCombobox<ItemType>()
let MultiCombobox = createMultiCombobox<ItemType>()

export function GroupSelector(
  props: Omit<
    React.ComponentProps<typeof Combobox.Root>,
    'url' | 'children'
  > & { label: string; name: string },
) {
  let [search, setSearch] = React.useState('')

  return (
    <Combobox.Root {...props} url={`/api/groups?q=${search}`}>
      <Combobox.Trigger placeholder="Select group...">
        {({ item }) => item?.name}
      </Combobox.Trigger>
      <Combobox.Dropdown label="Search groups">
        <Combobox.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search groups..."
        />
        <Combobox.Empty>No groups found.</Combobox.Empty>
        <Combobox.Items component={GroupItem} />
      </Combobox.Dropdown>
    </Combobox.Root>
  )
}

export function GroupsSelector(
  props: Omit<
    React.ComponentProps<typeof MultiCombobox.Root>,
    'url' | 'children'
  >,
) {
  let [search, setSearch] = React.useState('')

  return (
    <MultiCombobox.Root {...props} url={`/api/groups?q=${search}`}>
      <MultiCombobox.Trigger placeholder="Select group...">
        {() => 'Select group...'}
      </MultiCombobox.Trigger>
      <MultiCombobox.Dropdown label="Search groups">
        <MultiCombobox.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search groups..."
        />
        <MultiCombobox.Empty>No groups found.</MultiCombobox.Empty>
        <MultiCombobox.Items component={GroupItem} />
      </MultiCombobox.Dropdown>
    </MultiCombobox.Root>
  )
}

function GroupItem({ item }: { item: ItemType }) {
  return (
    <strong className="text-foreground flex items-center font-medium">
      {item.name}
    </strong>
  )
}
