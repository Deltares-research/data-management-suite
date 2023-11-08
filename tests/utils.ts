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
