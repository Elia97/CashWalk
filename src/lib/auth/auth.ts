import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { passwordResetEmail } from "../emails/password-reset-email";
import { verificationEmail } from "../emails/verification-email";
import { createAuthMiddleware } from "better-auth/api";
import { welcomeEmail } from "../emails/welcome-email";
import { deleteAccountVerificationEmail } from "../emails/delete-account-verification-email";
import { twoFactor, admin as adminPlugin } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { ac, admin, user } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await verificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      requireEmailVerification: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await deleteAccountVerificationEmail({ user, url });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async (data) => {
      await passwordResetEmail({ user: data.user, url: data.url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async (data) => {
      await verificationEmail({ user: data.user, url: data.url });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };
        if (user) {
          await welcomeEmail({ user });
        }
      }
    }),
  },
});
