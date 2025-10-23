# Better Auth – Next.js Example

This project is an advanced authentication example built with [better-auth](https://www.npmjs.com/package/better-auth) and Next.js, showcasing modern best practices for authentication flows in real-world applications.

## Features

- **Next.js 15** with Turbopack support
- **better-auth** for advanced authentication (2FA, social, passkey, etc.)
- **drizzle-orm** for database management
- **React 19** and **Tailwind CSS 4**
- Modern UI with Radix UI components
- Includes examples for profile management, sessions, 2FA, emails, and more

## How to use

1. Clone this repository or use it as a template
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables and database as needed
4. Start the development server:

   ```bash
   npm run dev
   ```

## Main scripts

- `dev` – Start development server
- `build` – Production build
- `db:generate`, `db:migrate`, `db:push` – Schema and migrations with drizzle-kit
- `auth:generate` – Generate custom auth schema
- `lint` – Code linting

## Key dependencies

- `better-auth`, `drizzle-orm`, `next`, `react`, `tailwindcss`, `@radix-ui/*`

---

This repository is intended as a reference for building secure, modern authentication flows in Next.js applications. Feel free to explore, adapt, and extend it for your own projects!
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
