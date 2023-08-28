// app/services/auth.server.ts
import { MicrosoftStrategy } from 'remix-auth-microsoft'
import type { AuthenticateOptions } from 'remix-auth'
import { Authenticator, Strategy } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { db } from '~/utils/db.server'
import type { SessionStorage, SessionData } from '@remix-run/node'
import { assert } from '~/utils/assert'

export let authenticator = new Authenticator<{
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

let microsoftStrategy = new MicrosoftStrategy(
  {
    clientId,
    clientSecret,
    tenantId,
    redirectUri: 'http://localhost:3000/auth/microsoft/callback',
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

authenticator.use(microsoftStrategy)

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
