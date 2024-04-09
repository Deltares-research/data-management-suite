import type { Prisma } from '@prisma/client'
import { Access, Role } from '@prisma/client'

export function whereUserCanReadItem(userId: string): Prisma.ItemWhereInput {
  return {
    collection: whereUserCanReadCollection(userId),
  }
}

export function whereUserCanReadCollection(
  userId: string,
): Prisma.CollectionWhereInput {
  return {
    OR: [
      {
        catalog: whereUserCanReadCatalog(userId),
      },
      {
        permissions: {
          some: {
            role: {
              in: [Role.ADMIN, Role.CONTRIBUTOR, Role.READER],
            },
            group: {
              members: {
                some: {
                  personId: userId,
                },
              },
            },
          },
        },
      },
      {
        access: Access.PUBLIC,
      },
    ],
  }
}

export function whereUserCanReadCatalog(
  userId: string,
): Prisma.CatalogWhereInput {
  return {
    OR: [
      {
        permissions: {
          some: {
            role: {
              in: [Role.ADMIN, Role.CONTRIBUTOR, Role.READER],
            },
            group: {
              members: {
                some: {
                  personId: userId,
                },
              },
            },
          },
        },
      },
      {
        access: Access.PUBLIC,
      },
    ],
  }
}

export function whereUserCanWriteCollection(
  userId: string,
): Prisma.CollectionWhereInput {
  return {
    OR: [
      {
        catalog: whereUserCanWriteCatalog(userId),
      },
      {
        permissions: {
          some: {
            role: {
              in: [Role.ADMIN, Role.CONTRIBUTOR],
            },
            group: {
              members: {
                some: {
                  personId: userId,
                },
              },
            },
          },
        },
      },
    ],
  }
}

export function whereUserCanWriteCatalog(
  userId: string,
): Prisma.CatalogWhereInput {
  return {
    permissions: {
      some: {
        role: {
          in: [Role.ADMIN, Role.CONTRIBUTOR],
        },
        group: {
          members: {
            some: {
              personId: userId,
            },
          },
        },
      },
    },
  }
}
