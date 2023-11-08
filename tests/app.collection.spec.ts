import { expect, test } from '@playwright/test'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'
import { loginAsAdmin } from './utils'

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page)
})

test('can list collections', async ({ page }) => {
  await page.goto(routes.collections())

  let title = await page.getByRole('heading', { name: /Collections/i })

  expect(title).toBeInViewport()
})

test('can create collections', async ({ page }) => {
  await page.goto(routes.createCollection())

  let title = await page.getByRole('heading', { name: /Create collection/i })

  expect(title).toBeInViewport()
})

test('can edit collections', async ({ page }) => {
  let collection = await db.collection.create({
    data: {
      title: 'Playwright Collection',
      catalog: {
        create: {
          title: 'Playwright Catalog',
          description: 'Playwright Catalog',
        },
      },
    },
  })

  await page.goto(routes.editCollection(collection.id))

  let title = await page.getByRole('heading', { name: /Edit Collection/i })

  expect(title).toBeInViewport()
})
