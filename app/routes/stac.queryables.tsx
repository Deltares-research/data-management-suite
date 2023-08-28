import { withCors } from '~/utils/withCors'

export let loader = withCors(async ({ request }) => {
  return {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: 'https://stac-api.example.com/queryables',
    type: 'object',
    title: 'Queryables for Example STAC API',
    description: 'Queryable names for the example STAC API Item Search filter.',
    properties: {
      // id: {
      //   description: 'ID',
      //   $ref: 'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/id',
      // },
      keyword: {
        description: 'Keyword',
        type: 'string',
        // enum: ['kek', 'foo', 'bur'],
      },
      // geometry: {
      //   description: 'Geometry',
      //   $ref: 'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/geometry',
      // },
      // datetime: {
      //   description: 'Datetime',
      //   $ref: 'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/datetime.json#/properties/datetime',
      // },
      // 'eo:cloud_cover': {
      //   description: 'Cloud Cover',
      //   $ref: 'https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:cloud_cover',
      // },
      // gsd: {
      //   description: 'Ground Sample Distance',
      //   $ref: 'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/instrument.json#/properties/gsd',
      // },
      // assets_bands: {
      //   description: 'Asset eo:bands common names',
      //   $ref: 'https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:bands/common_name',
      // },
    },
    additionalProperties: true,
  }
})
