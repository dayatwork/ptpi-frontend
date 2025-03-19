import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  passkeyClient,
  adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/two-factor";
      },
    }),
    magicLinkClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
export type Passkey = typeof authClient.$Infer.Passkey;
export type GetSession = typeof getSession;
