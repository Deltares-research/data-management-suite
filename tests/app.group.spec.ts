import { test, expect } from '@playwright/test'
import { loginAsAdmin, truncateDatabase } from './utils'
import { randAnimal, randEmail, randUserName } from '@ngneat/falso'
import { db } from '~/utils/db.server'

test('can create a group and add members', async ({ page }) => {
  // Setup
  await truncateDatabase()
  await loginAsAdmin(page)

  let person = await db.person.create({
    data: {
      name: randUserName(),
      email: randEmail(),
    },
  })

  await page.goto('/app/groups')

  // @ Group List
  await page.getByRole('link', { name: /Create New/i }).click()

  // @ Create Group Page
  let groupName = `${randAnimal()} Group`
  await page.getByRole('textbox', { name: /Name/i }).fill(groupName)
  await page.getByRole('button', { name: /Save/i }).click()

  // @ Group List
  await page.getByRole('link', { name: groupName }).click()

  // @ Group Details
  await page.getByRole('button', { name: /Add People/i }).click()
  await page.getByRole('combobox').click()
  await page
    .getByRole('option', { name: new RegExp(person.name ?? '') })
    .click()
  await page.getByRole('button', { name: /Add/i }).click()
  await expect(
    await page.getByRole('dialog', { name: /add people/i }),
  ).toBeHidden()
  await expect(await page.getByText(person.name ?? '')).toBeVisible()
})
