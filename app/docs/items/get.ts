import { db } from '~/utils/db.server'
import {
  randAnimal,
  randNumber,
  randParagraph,
  randRecentDate,
  randSoonDate,
} from '@ngneat/falso'
import { randomPolygon } from '@turf/turf'
import { updateGeometry } from '~/services/item.server'

export async function createGetItemExample() {
  let exampleItem = {
    dateTime: null,
    title: randAnimal(),
    projectNumber: randNumber().toFixed(0),
    description: randParagraph(),
    startTime: randRecentDate().toISOString(),
    endTime: randSoonDate().toISOString(),
    location: '',
    license: '',
    collectionId: await db.collection
      .findFirstOrThrow({ select: { id: true } })
      .then(c => c.id),
  }

  let geometry = randomPolygon().features[0].geometry

  async function createFixture() {
    let item = await db.item.create({
      data: exampleItem,
    })

    await updateGeometry({
      id: item.id,
      geometry,
    })

    return item
  }

  let exampleResponseBody = { ...exampleItem, geometry }

  let exampleRequest = new Request(`http://localhost:3000/api/items/1`)

  return {
    exampleRequest,
    exampleRequestBody: '',
    exampleResponseBody,
    method: exampleRequest.method,
    endpoint: exampleRequest.url,
    createFixture,
    route: (id: string) => `/api/items/${id}`,
  }
}
