import type { Prisma } from '@prisma/client'
import { Access, Role } from '@prisma/client'

export function getCollectionAuthWhere(
  userId: string,
): Prisma.CollectionWhereInput {
  return {
    catalog: {
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
    },
  }
}
