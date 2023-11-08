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

test('cannot create a catalog without admins', async ({ page }) => {
  await page.goto(routes.createCatalog())

  let title = await page.getByRole('heading', { name: /Create catalog/i })

  expect(title).toBeInViewport()

  await page.getByRole('textbox', { name: /Title/i }).fill('Test Catalog')
  await page
    .getByRole('textbox', { name: /Description/i })
    .fill('Test Catalog Description')
  await page.getByRole('button', { name: /Save/i }).click()

  let requiredError = await page.getByText(
    /Catalog should have at least one permission group/i,
  )

  expect(requiredError).toBeInViewport()

  await page.getByRole('button', { name: /Add permission/i }).click()
  await page.getByRole('button', { name: /Save/i }).click()

  let adminError = await page.getByText(
    /Catalog should have at least one admin/i,
  )

  expect(adminError).toBeInViewport()
})
