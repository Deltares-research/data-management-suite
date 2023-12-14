import React from 'react'
import { createCombobox } from '~/components/Combobox'
import type { collectionApiLoader } from '~/routes/api.collections'
import { createMultiCombobox } from './MultiCombobox'

type ItemType = Awaited<ReturnType<typeof collectionApiLoader>>[number]

let Combobox = createCombobox<ItemType>()
let MultiCombobox = createMultiCombobox<ItemType>()

export function CollectionSelector({
  accessType,
  ...props
}: Omit<React.ComponentProps<typeof Combobox.Root>, 'url' | 'children'> & {
  accessType?: 'read' | 'contribute'
}) {
  let [search, setSearch] = React.useState('')

  return (
    <Combobox.Root
      {...props}
      url={`/api/collections?q=${search}&accessType=${accessType}`}
    >
      <Combobox.Trigger placeholder="Select collection...">
        {({ item }) => item?.title}
      </Combobox.Trigger>
      <Combobox.Dropdown label="Search collections">
        <Combobox.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search collections..."
        />
        <Combobox.Empty>No collections found.</Combobox.Empty>
        <Combobox.Items component={CollectionItem} />
      </Combobox.Dropdown>
    </Combobox.Root>
  )
}

export function MultiCollectionSelector({
  accessType,
  ...props
}: Omit<React.ComponentProps<typeof Combobox.Root>, 'url' | 'children'> & {
  accessType?: 'read' | 'contribute'
}) {
  let [search, setSearch] = React.useState('')

  return (
    <MultiCombobox.Root
      {...props}
      url={`/api/collections?q=${search}&accessType=${accessType}`}
    >
      <MultiCombobox.Badges component={({ item }) => item?.title} />
      <MultiCombobox.Trigger placeholder="Select collection...">
        {() => 'Select collections...'}
      </MultiCombobox.Trigger>
      <MultiCombobox.Dropdown label="Search collections">
        <MultiCombobox.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search collections..."
        />
        <MultiCombobox.Empty>No collections found.</MultiCombobox.Empty>
        <MultiCombobox.Items component={CollectionItem} />
      </MultiCombobox.Dropdown>
    </MultiCombobox.Root>
  )
}

function CollectionItem({ item }: { item: ItemType }) {
  return (
    <div>
      <strong className="block">{item.title}</strong>
      <span className="block text-muted-foreground">{item.catalog?.title}</span>
    </div>
  )
}
