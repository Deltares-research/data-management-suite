import { test, expect } from '@playwright/test'
import { db } from '~/utils/db.server'
import { randAnimal, randFirstName } from '@ngneat/falso'

test('can register dataset', async ({ page }) => {
  let animal = randAnimal()
  let mockCollection = await db.collection.create({
    data: {
      title: `${animal} Collection`,
      catalog: {
        create: {
          title: 'Animals',
          description: 'Catalog of animals',
        },
      },
    },
  })

  await page.goto('/auth/mock')
  await page.goto('/app/items/create')

  let name = randFirstName()

  await page
    .getByRole('textbox', { name: /project number/i })
    .fill(`Project ${name}`)
  await page
    .getByRole('textbox', { name: /title/i })
    .fill(`${name} the ${animal}`)
  await page.getByRole('textbox', { name: /description/i }).fill('Test')
  await page.getByRole('textbox', { name: /location/i }).fill('P://test')

  // Collection
  await page.getByRole('combobox', { name: /Collection/i }).click()
  await page
    .getByRole('combobox', { name: /Search collections/i })
    .type(mockCollection.title)
  await page
    .getByRole('option', { name: new RegExp(mockCollection.title, 'i') })
    .click()

  // Geometry
  let map = await page.getByTestId('geometry-selector')
  await map.click({
    position: {
      x: 40,
      y: 40,
    },
  })
  await map.click({
    position: {
      x: 120,
      y: 40,
    },
  })
  await map.click({
    position: {
      x: 120,
      y: 120,
    },
  })
  await map.click({
    position: {
      x: 40,
      y: 120,
    },
  })
  await map.click({
    position: {
      x: 40,
      y: 40,
    },
  })

  // Temporal
  await page.getByLabel(/Date or date range/i).click()
  let grid = await page.getByRole('grid', {
    name: new RegExp(new Date().toLocaleString('en', { month: 'long' }), 'i'),
  })
  await grid.getByText(/14/i).click()
  await grid.getByText(/17/i).click()

  // Keywords
  await page.getByRole('combobox', { name: /Keywords/i }).click()
  await page.getByRole('option', { name: /Banaan/i }).click()

  await page.getByRole('button', { name: /Save/i }).click()

  await expect.poll(async () => page.url()).toMatch(/\/app\/items$/i)
})
