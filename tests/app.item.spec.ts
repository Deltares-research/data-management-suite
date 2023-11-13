import { test, expect } from '@playwright/test'
import { db } from '~/utils/db.server'
import { randAnimal, randFirstName, randNumber } from '@ngneat/falso'
import { routes } from '~/routes'
import { Access } from '@prisma/client'
import {
  createPrivateCollection,
  createPublicCollection,
  loginAsAdmin,
  truncateDatabase,
} from './utils'

test.beforeEach(async ({ page }) => {
  await truncateDatabase()
  await loginAsAdmin(page)
})

test('can create item', async ({ page }) => {
  let animal = randAnimal()
  let mockCollection = await createPrivateCollection()

  await db.keyword.create({
    data: {
      title: 'Test Keyword',
    },
  })

  await page.goto('/app/items/create')

  // Collection
  await page.getByRole('combobox', { name: /Collection/i }).click()
  await page
    .getByRole('combobox', { name: /Search collections/i })
    .type(mockCollection.title)
  await page.getByRole('option', { name: mockCollection.title }).click()

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

  await page.getByRole('button', { name: /Add Asset/i }).click()

  let assetForm = await page.getByTestId('asset-form-0')
  await assetForm.getByRole('textbox', { name: /Key/i }).fill('test')
  await assetForm.getByRole('textbox', { name: /Title/i }).fill(randAnimal())
  await assetForm
    .getByRole('textbox', { name: /Link/i })
    .fill('https://example.com')
  await assetForm.getByRole('textbox', { name: /Description/i }).fill('Test')
  await assetForm
    .getByRole('textbox', { name: /Type/i })
    .fill('application/json')
  await assetForm.getByRole('textbox', { name: /Roles/i }).fill('test')

  await page.getByRole('button', { name: /Numerical Models/i }).click()

  let name = randFirstName()

  let numericalModelForm = await page.getByTestId('numerical-model-form')
  await numericalModelForm
    .getByRole('textbox', { name: /title/i })
    .fill(`${name} the ${animal}`)
  await numericalModelForm
    .getByRole('textbox', { name: /description/i })
    .fill('Test')
  await numericalModelForm
    .getByRole('textbox', { name: /project number/i })
    .fill(`Project ${name}`)

  await page.getByRole('button', { name: /Save/i }).click()

  await expect.poll(async () => page.url()).toMatch(/\/app\/items$/i)
})

test('can edit item', async ({ page }) => {
  let item = await db.item.create({
    data: {
      properties: {
        title: randAnimal(),
        projectNumber: randNumber().toFixed(),
      },
      collectionId: await createPrivateCollection().then(c => c.id),
    },
  })

  await page.goto(routes.editItem(item.id), { waitUntil: 'networkidle' })

  let title = await page.getByText(/Edit metadata record/i)
  await expect(title).toBeInViewport()
})

test("can't edit item without permissions", async ({ page }) => {
  let item = await db.item.create({
    data: {
      properties: {
        title: randAnimal(),
        projectNumber: randNumber().toFixed(),
      },
      collection: {
        create: {
          title: `Test Collection`,
          catalog: {
            create: {
              access: Access.PRIVATE,
              title: 'Animals',
              description: 'Catalog of animals',
            },
          },
        },
      },
    },
  })

  await page.goto(routes.editItem(item.id), { waitUntil: 'networkidle' })

  // Should redirect back to list when no permissions
  let title = await page.getByRole('heading', { name: /Items/i })
  await expect(title).toBeInViewport()
})

test('can list items', async ({ page }) => {
  let privateCollection = await createPrivateCollection()
  let publicCollection = await createPublicCollection()

  for (let i = 0; i < 3; i++) {
    await db.item.create({
      data: {
        properties: {
          title: randAnimal(),
          projectNumber: randNumber().toFixed(),
        },
        collection: {
          connect: {
            id: publicCollection.id,
          },
        },
      },
    })
  }

  for (let i = 0; i < 5; i++) {
    await db.item.create({
      data: {
        properties: {
          title: randAnimal(),
          projectNumber: randNumber().toFixed(),
        },
        collection: {
          connect: {
            id: privateCollection.id,
          },
        },
      },
    })
  }

  await page.goto(routes.items())

  let title = await page.getByRole('heading', { name: /Items/i })

  await expect(title).toBeInViewport()
})
