// app/services/auth.server.ts
import { MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

export let authenticator = new Authenticator<any>(sessionStorage); //User is a custom user types you can define as you want

let microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: "35a69d8f-fe0e-403a-9d55-de7e7f63423c",
    clientSecret: "EnC8Q~ljcDHw4jPuT09IalEj07EEhibPhtYpebeO",
    redirectUri: "http://localhost:3000/auth/microsoft/callback",
    tenantId: "0ee307a7-424f-48d1-9e9d-9732f0b76328",
    scope: "openid profile email", // optional
    prompt: "login", // optional,
  },
  async ({ accessToken, extraParams, profile }) => {
    // Here you can fetch the user from database or return a user object based on profile
    // return {profile}
    // The returned object is stored in the session storage you are using by the authenticator

    // If you're using cookieSessionStorage, be aware that cookies have a size limit of 4kb
    // For example this won't work
    // return {accessToken, extraParams, profile}
    // return User.findOrCreate({ email: profile.emails[0].value });
    console.log({ profile });
    return profile;
  }
);

authenticator.use(microsoftStrategy);
