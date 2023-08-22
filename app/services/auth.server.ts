// app/services/auth.server.ts
import { MicrosoftStrategy } from 'remix-auth-microsoft'
import type { AuthenticateOptions } from 'remix-auth'
import { Authenticator, Strategy } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { db } from '~/utils/db.server'
import type { SessionStorage, SessionData } from '@remix-run/node'

export let authenticator = new Authenticator<{
  id: string
  name: string | null
}>(sessionStorage) //User is a custom user types you can define as you want

let microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: '35a69d8f-fe0e-403a-9d55-de7e7f63423c',
    clientSecret: 'EnC8Q~ljcDHw4jPuT09IalEj07EEhibPhtYpebeO',
    redirectUri: 'http://localhost:3000/auth/microsoft/callback',
    tenantId: '0ee307a7-424f-48d1-9e9d-9732f0b76328',
    scope: 'openid profile email', // optional
    prompt: 'login', // optional,
  },
  async ({ accessToken, extraParams, profile }) => {
    // Here you can fetch the user from database or return a user object based on profile
    // return {profile}
    // The returned object is stored in the session storage you are using by the authenticator

    // If you're using cookieSessionStorage, be aware that cookies have a size limit of 4kb
    // For example this won't work
    // return {accessToken, extraParams, profile}
    // return User.findOrCreate({ email: profile.emails[0].value });

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
