import React from 'react'
import { createCombobox } from '~/components/Combobox'
import type { catalogApiLoader } from '~/routes/api.catalogs'

type ItemType = Awaited<ReturnType<typeof catalogApiLoader>>[number]

let Combobox = createCombobox<ItemType>()

export function CatalogSelector({
  accessType,
  ...props
}: Omit<React.ComponentProps<typeof Combobox.Root>, 'url' | 'children'> & {
  accessType?: 'read' | 'contribute'
}) {
  let [search, setSearch] = React.useState('')

  return (
    <Combobox.Root
      {...props}
      url={`/api/catalogs?q=${search}&accessType=${accessType}`}
    >
      <Combobox.Trigger placeholder="Select catalog...">
        {({ item }) => item?.title}
      </Combobox.Trigger>
      <Combobox.Dropdown label="Search catalogs">
        <Combobox.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search catalogs..."
        />
        <Combobox.Empty>No catalogs found.</Combobox.Empty>
        <Combobox.Items component={CatalogItem} />
      </Combobox.Dropdown>
    </Combobox.Root>
  )
}

function CatalogItem({ item }: { item: ItemType }) {
  return <strong>{item.title}</strong>
}
