import { expect, test } from '@playwright/test'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'
import {
  createPrivateCatalog,
  createPrivateCollection,
  loginAsAdmin,
  truncateDatabase,
} from './utils'

test.beforeEach(async ({ page }) => {
  await truncateDatabase()
  await loginAsAdmin(page)
})

test('can list collections', async ({ page }) => {
  await page.goto(routes.collections())

  let title = await page.getByRole('heading', { name: /Collections/i })

  await expect(title).toBeInViewport()
})

test('can create collections', async ({ page }) => {
  await createPrivateCatalog()

  await page.goto(routes.createCollection())

  let title = await page.getByRole('heading', { name: /Create collection/i })

  await expect(title).toBeInViewport()
})

test('can edit collections', async ({ page }) => {
  let collection = await createPrivateCollection()

  await page.goto(routes.editCollection(collection.id))

  let title = await page.getByRole('heading', { name: /Edit Collection/i })

  await expect(title).toBeInViewport()
})
