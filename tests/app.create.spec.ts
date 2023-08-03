import { test, expect } from '@playwright/test'

test('can register dataset', async ({ page }) => {
  await page.goto('/auth/mock')
  await page.goto('/app/items/create')

  await page.getByRole('textbox', { name: /project number/i }).fill('test-01')
  await page.getByRole('textbox', { name: /title/i }).fill('Test 01')
  await page.getByRole('textbox', { name: /description/i }).fill('Test 01')
  await page.getByRole('textbox', { name: /location/i }).fill('P://test-01')

  // Collection
  await page.getByRole('combobox', { name: /Collection/i }).click()
  await page.getByRole('option', { name: /Test/i }).click()

  // Geometry
  await page.getByRole('combobox', { name: /type/i }).click()
  await page.getByRole('option', { name: /point/i }).click()
  await page.getByLabel(/NW lat/i).fill('3')
  await page.getByLabel(/NW lng/i).fill('30')
  await page.getByLabel(/SE lat/i).fill('6')
  await page.getByLabel(/SE lng/i).fill('60')

  // Keywords
  await page.getByRole('combobox', { name: /Keywords/i }).click()
  await page.getByRole('option', { name: /Banaan/i }).click()

  await page.getByRole('button', { name: /Save/i }).click()

  await expect.poll(async () => page.url()).toMatch(/\/app\/items$/i)
})
