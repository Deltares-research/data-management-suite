import Ajv from 'ajv'
// @ts-ignore
import addFormatsDraft2019 from 'ajv-formats-draft2019'
// @ts-ignore
import addFormats from 'ajv-formats'
import collectionSchema from 'stac-spec/collection-spec/json-schema/collection.json'
import catalogSchema from 'stac-spec/catalog-spec/json-schema/catalog.json'
import itemSchema from 'stac-spec/item-spec/json-schema/item.json'
import stacPackageJson from 'stac-spec/package.json'
import * as turf from '@turf/turf'
import { cachedFetch } from './cachedFetch'

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
      let schema = await cachedFetch(uri)
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

export const conformsTo = [
  `https://api.stacspec.org/v${stacPackageJson.version}/core`,
  `https://api.stacspec.org/v${stacPackageJson.version}/item-search`,
  `https://api.stacspec.org/v${stacPackageJson.version}/ogcapi-features`,
  // `https://api.stacspec.org/v${stacPackageJson.version}/item-search#filter`,
  'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core',
  'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30',
  'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson',

  'http://www.opengis.net/spec/ogcapi_common-2/1.0/conf/collections',

  'http://api.stacspec.org/v1.0.0-rc.2/core',
  'http://api.stacspec.org/v1.0.0-rc.2/stac-search',
  'http://api.stacspec.org/v1.0.0-rc.2/stac-response',

  'https://api.stacspec.org/v1.0.0-rc.2/item-search#filter',
  'http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/filter',
  'http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/features-filter',
  'http://www.opengis.net/spec/cql2/1.0/conf/cql2-text',
  'http://www.opengis.net/spec/cql2/1.0/conf/cql2-json',
  'http://www.opengis.net/spec/cql2/1.0/conf/basic-cql2',
  'http://www.opengis.net/spec/cql2/1.0/conf/basic-spatial-operators',
  'http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators',
]

export function polygonsToBbox({
  features,
}: {
  features: turf.Feature[]
}): turf.BBox {
  const featureCollection = turf.featureCollection(features)

  return turf.bbox(featureCollection)
}
