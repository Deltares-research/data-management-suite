import { db } from '~/utils/db.server'
import {
  randAnimal,
  randNumber,
  randParagraph,
  randRecentDate,
  randSoonDate,
} from '@ngneat/falso'
import { type ItemSchema } from '~/forms/ItemForm'
import { randomPolygon } from '@turf/turf'

export async function createCreateItemExample() {
  let exampleRequestBody: ItemSchema = {
    title: randAnimal(),
    projectNumber: randNumber().toFixed(0),
    description: randParagraph(),
    geometry: randomPolygon().features[0].geometry,
    dateRange: {
      from: randRecentDate().toISOString(),
      to: randSoonDate().toISOString(),
    },
    location: '',
    license: '',
    collectionId: await db.collection
      .findFirstOrThrow({ select: { id: true } })
      .then(c => c.id),
  }

  let exampleResponseBody = {
    title: exampleRequestBody.title,
    assets: null,
    collectionId: exampleRequestBody.collectionId,
    description: exampleRequestBody.description,
    dateTime: null,
    startTime: exampleRequestBody.dateRange.from,
    endTime: exampleRequestBody.dateRange.to,
    location: '',
    license: '',
  }

  let exampleRequest = new Request('http://localhost:3000/api/items', {
    method: 'POST',
    body: JSON.stringify(exampleRequestBody),
  })

  return {
    exampleRequest,
    exampleRequestBody,
    exampleResponseBody,
    endpoint: exampleRequest.url,
    method: exampleRequest.method,
  }
}
