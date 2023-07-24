import Ajv from 'ajv'
// @ts-ignore
import addFormatsDraft2019 from 'ajv-formats-draft2019'
// @ts-ignore
import addFormats from 'ajv-formats'
import collectionSchema from 'stac-spec/collection-spec/json-schema/collection.json'
import catalogSchema from 'stac-spec/catalog-spec/json-schema/catalog.json'
import stacPackageJson from 'stac-spec/package.json'
import itemSchema from 'stac-spec/item-spec/json-schema/item.json'

let schemasByKey = {
  Item: itemSchema,
  Catalog: catalogSchema,
  Collection: collectionSchema,
}

export async function getStacValidator(
  schemaKey: 'Item' | 'Collection' | 'Catalog',
) {
  let ajv = new Ajv({
    async loadSchema(uri) {
      let schema = await fetch(uri).then(res => res.json())
      return schema
    },
  })

  addFormats(ajv)
  addFormatsDraft2019(ajv)

  ajv.addSchema(itemSchema)
  ajv.addSchema(collectionSchema)
  ajv.addSchema(catalogSchema)

  let schema = schemasByKey[schemaKey]

  return ajv.compileAsync(schema)
}
