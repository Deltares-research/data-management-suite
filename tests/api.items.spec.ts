import { test, expect } from '@playwright/test'
import { createCreateItemExample } from '~/docs/items/create'
import { createGetItemExample } from '~/docs/items/get'

test('Create Item', async ({ baseURL }) => {
  let { exampleRequest, exampleResponseBody } = await createCreateItemExample()

  let response = await fetch(exampleRequest)

  let result = await response.json()

  expect(result).toMatchObject(exampleResponseBody)
})

test('Get Item', async ({ baseURL }) => {
  let { exampleRequest, exampleResponseBody, createFixture, route } =
    await createGetItemExample()

  let item = await createFixture()

  let response = await fetch(`${baseURL}${route(item.id)}`)

  let result = await response.json()

  expect(result).toMatchObject(exampleResponseBody)
})

test('Search', async ({ baseURL }) => {})
