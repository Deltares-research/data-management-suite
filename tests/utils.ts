import { randAnimal } from '@ngneat/falso'
import type { Page } from '@playwright/test'
import { Access, MemberRole, Role } from '@prisma/client'
import { encodeToken } from '~/utils/apiKey'
import { db } from '~/utils/db.server'

export async function truncateDatabase() {
  const tablenames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter(name => name !== '_prisma_migrations')
    .map(name => `"public"."${name}"`)
    .join(', ')

  try {
    await db.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log({ error })
  }
}

export async function loginAsAdmin(page: Page) {
  let person = {
    id: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
  }
  await db.person.upsert({
    where: { id: person.id },
    create: {
      ...person,
      memberOf: {
        create: {
          role: MemberRole.ADMIN,
          group: {
            create: {
              name: randAnimal(),
            },
          },
        },
      },
    },
    update: person,
  })

  await page.goto('/auth/mock')

  await page.getByRole('textbox', { name: /Username/i }).fill('admin')
  await page
    .getByRole('textbox', { name: /Password/i })
    .fill(process.env.PLAYWRIGHT_USER_PASSWORD!)
  await page.getByRole('button', { name: /Login/i }).click()
}

export async function createToken() {
  let token = 'TestKey'
  await db.apiKey.create({
    data: {
      key: encodeToken(token),
      name: 'Test Token',
      person: {
        connectOrCreate: {
          where: {
            id: 'admin',
          },
          create: {
            id: 'admin',
            name: 'Admin',
            email: 'test@test.test',
          },
        },
      },
    },
  })

  return token
}

export async function createPrivateCatalog() {
  return db.catalog.create({
    data: {
      access: Access.PRIVATE,
      title: 'Test Catalog',
      description: 'Catalog created during automated test',
      permissions: {
        create: {
          role: Role.CONTRIBUTOR,
          group: {
            create: {
              name: `${randAnimal()} group`,
              members: {
                create: {
                  role: MemberRole.ADMIN,
                  person: {
                    connectOrCreate: {
                      where: {
                        id: 'admin',
                      },
                      create: {
                        name: 'Admin',
                        email: 'admin@admin.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
}

export async function createPrivateCollection() {
  return db.collection.create({
    data: {
      title: 'Test Collection',
      catalog: {
        create: {
          access: Access.PRIVATE,
          title: 'Test Catalog',
          description: 'Catalog created during automated test',
          permissions: {
            create: {
              role: Role.CONTRIBUTOR,
              group: {
                create: {
                  name: 'Test Group',
                  members: {
                    create: {
                      role: MemberRole.ADMIN,
                      person: {
                        connectOrCreate: {
                          where: {
                            id: 'admin',
                          },
                          create: {
                            name: 'Admin',
                            email: 'admin@admin.com',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
}

export async function createPublicCollection() {
  return db.collection.create({
    data: {
      title: `Animals`,
      startTime: new Date(),
      catalog: {
        create: {
          title: 'Organisms',
          description: 'Catalog of organisms',
          access: Access.PUBLIC,
        },
      },
    },
  })
}
