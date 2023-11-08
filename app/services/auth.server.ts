// app/services/auth.server.ts
import { MicrosoftStrategy } from 'remix-auth-microsoft'
import { FormStrategy } from 'remix-auth-form'
import { Authenticator } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { db } from '~/utils/db.server'
import type { LoaderArgs } from '@remix-run/node'
import { assert } from '~/utils/assert'
import { routes } from '~/routes'
import { encodeToken } from '~/utils/apiKey'

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
let playwrightAdminPassword = assert(
  process.env.PLAYWRIGHT_USER_PASSWORD,
  'PLAYWRIGHT_USER_PASSWORD should be set',
)

function createMicrosoftStrategy(request: LoaderArgs['request']) {
  let url = new URL(request.url)

  let microsoftStrategy = new MicrosoftStrategy(
    {
      clientId,
      clientSecret,
      tenantId,
      redirectUri: `${url.hostname === 'localhost' ? 'http' : 'https'}://${
        url.host
      }/auth/microsoft/callback`,
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
  try {
    return await checkApiKey(request)
  } catch (e) {
    return authenticator.isAuthenticated(request, {
      failureRedirect: routes.login(),
    })
  }
}

// For API
async function checkApiKey(request: Request) {
  let header = request.headers.get('Authorization')
  let token = header?.split(' ')[1]

  if (!token) {
    throw new Error('Missing Token')
  }

  let keyHash = encodeToken(token)

  let apiKeyObject = await db.apiKey.findUniqueOrThrow({
    where: {
      key: keyHash,
    },
    include: {
      person: true,
    },
  })

  return apiKeyObject.person
}

// For tests
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let username = form.get('username')
    let password = form.get('password')

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('Invalid username or password')
    }

    if (username !== 'admin' || password !== playwrightAdminPassword) {
      throw new Error('Invalid username or password')
    }

    return {
      id: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
    }
  }),
)
