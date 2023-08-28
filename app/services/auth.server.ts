// app/services/auth.server.ts
import { MicrosoftStrategy } from 'remix-auth-microsoft'
import type { AuthenticateOptions } from 'remix-auth'
import { Authenticator, Strategy } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { db } from '~/utils/db.server'
import type { SessionStorage, SessionData, LoaderArgs } from '@remix-run/node'
import { assert } from '~/utils/assert'
import { routes } from '~/routes'

let authenticator = new Authenticator<{
  id: string
  name: string | null
}>(sessionStorage)

let clientId = assert(
  process.env.AZURE_CLIENT_ID,
  'AZURE_CLIENT_ID should be set',
)
let clientSecret = assert(
  process.env.AZURE_CLIENT_SECRET,
  'AZURE_CLIENT_SECRET should be set',
)
let tenantId = assert(
  process.env.AZURE_TENANT_ID,
  'AZURE_TENANT_ID should be set',
)

function createMicrosoftStrategy(request: LoaderArgs['request']) {
  let url = new URL(request.url)

  console.log(`${url.protocol}//${url.host}/auth/microsoft/callback`)
  let microsoftStrategy = new MicrosoftStrategy(
    {
      clientId,
      clientSecret,
      tenantId,
      redirectUri: `${url.protocol}//${url.host}/auth/microsoft/callback`,
      scope: 'openid profile email', // optional
      prompt: 'login', // optional,
    },
    async ({ profile }) => {
      let userData = {
        name: profile.displayName,
        email: profile._json.email,
      }

      return db.person.upsert({
        where: {
          email: profile._json.email,
        },
        create: userData,
        update: userData,
        select: {
          id: true,
          name: true,
        },
      })
    },
  )

  return microsoftStrategy
}

export function createAuthenticator(request: LoaderArgs['request']) {
  authenticator.use(createMicrosoftStrategy(request))

  return authenticator
}

export async function requireAuthentication(request: LoaderArgs['request']) {
  return authenticator.isAuthenticated(request, {
    failureRedirect: routes.login(),
  })
}

// For tests
class MockStrategy extends Strategy<
  {
    id: string
    name: string | null
  },
  null
> {
  name = 'mock'

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage<SessionData, SessionData>,
    options: AuthenticateOptions,
  ): Promise<{ id: string; name: string | null }> {
    return this.success(
      await this.verify(null),
      request,
      sessionStorage,
      options,
    )
  }
}

let mockStrategy = new MockStrategy(async () => ({
  id: 'admin',
  name: 'Admin',
}))

authenticator.use(mockStrategy)
