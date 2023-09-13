import { test, expect } from '@playwright/test'
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

test('Create Item', async ({ baseURL }) => {
  // Arrange
  let newItem: ItemSchema = {
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

  // Act
  let response = await fetch(`${baseURL}/api/items`, {
    method: 'POST',
    body: JSON.stringify(newItem),
  })

  let result = await response.json()

  // Assert
  expect(result).toMatchObject({
    title: newItem.title,
    assets: null,
    collectionId: newItem.collectionId,
    description: newItem.description,
    dateTime: null,
    startTime: newItem.dateRange.from,
    endTime: newItem.dateRange.to,
    location: '',
    license: '',
  })
})
