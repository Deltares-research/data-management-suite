import { expect, test } from '@playwright/test'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/mock')
})

test('can list catalogs', async ({ page }) => {
  await page.goto(routes.catalogs())

  let title = await page.getByRole('heading', { name: /Catalogs/i })

  expect(title).toBeInViewport()
})

test('can create catalogs', async ({ page }) => {
  await page.goto(routes.createCatalog())

  let title = await page.getByRole('heading', { name: /Create catalog/i })

  expect(title).toBeInViewport()
})

test('can edit catalogs', async ({ page }) => {
  let catalog = await db.catalog.create({
    data: {
      title: 'Playwright Catalog',
      description: 'Playwright Catalog',
    },
  })

  await page.goto(routes.editCatalog(catalog.id))

  let title = await page.getByRole('heading', { name: /Edit catalog/i })

  expect(title).toBeInViewport()
})
