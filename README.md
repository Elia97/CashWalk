# 💰 CashWalk

A modern, open-source personal finance management application built with Next.js 15, Better Auth, and Drizzle ORM.

## ✨ Features

- 📊 **Transaction Management** - Track income and expenses with ease
- 🏦 **Multiple Accounts** - Manage checking, savings, and cash accounts
- 📁 **Smart Categories** - 28 pre-configured system categories optimized for personal checking accounts
- 📈 **Analytics Dashboard** - Visualize your financial data (coming soon)
- 🔐 **Secure Authentication** - 2FA, social login, and passkey support via better-auth
- 🎨 **Modern UI** - Beautiful interface with Radix UI components and Tailwind CSS 4
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌍 **Open Source** - Free to use, no ads, no tracking

## 🚀 Tech Stack

- **Next.js 15** with Turbopack support
- **better-auth** for advanced authentication (2FA, social, passkey, etc.)
- **drizzle-orm** with PostgreSQL for database management
- **React 19** and **Tailwind CSS 4**
- **Radix UI** components for accessible UI
- **React Hook Form** with Zod validation

## 📋 Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md).

### Local Development

1. Clone this repository

   ```bash
   git clone <your-repo-url>
   cd CashWalk
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables

   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Setup database

   ```bash
   npm run db:push
   npm run db:seed  # ONLY ONCE - Seeds system categories
   ```

5. Start development server

   ```bash
   npm run dev
   ```

## 📚 Available Scripts

- `npm run dev` – Start development server with Turbopack
- `npm run build` – Production build
- `npm run db:generate` – Generate database migrations
- `npm run db:migrate` – Run migrations
- `npm run db:push` – Push schema to database (dev)
- `npm run db:studio` – Open Drizzle Studio
- `npm run db:seed` – Seed system categories (⚠️ run only once)
- `npm run auth:generate` – Generate auth schema

## 🏗️ Project Structure

```tree
src/
├── app/                # Next.js app directory
│   ├── (home)/         # Landing page
│   ├── accounts/       # Account management
│   ├── analytics/      # Analytics dashboard
│   ├── settings/       # Settings & categories
│   ├── transactions/   # Transaction management
│   └── welcome/        # Onboarding flow
├── components/         # Reusable UI components
├── drizzle/            # Database schema & migrations
│   └── seeds/          # Database seed files
├── lib/                # Utilities & helpers
├── repo/               # Data repositories
└── services/           # Business logic
```

## 🎯 System Categories

The app includes 28 professionally curated categories:

**Income (5):** Salary & Wages, Freelance & Side Work, Gifts & Transfers, Refunds & Cashback, Other Income

**Expense (23):** Housing, Utilities, Groceries, Dining & Takeout, Transportation, Auto & Vehicle, Healthcare, Fitness & Wellness, Personal Care, Shopping, Electronics & Tech, Home & Garden, Entertainment, Subscriptions & Streaming, Travel & Vacation, Education, Books & Learning, Bank Fees, Insurance, Childcare & Kids, Pets, Gifts & Celebrations, Charity & Donations, Miscellaneous

## 🚢 Deployment

### GitHub Actions

This project includes a GitHub Action for database seeding:

1. Configure `DATABASE_URL` secret in GitHub repository settings
2. Go to Actions → "Seed Database" → Run workflow
3. Type `seed` to confirm and execute

See [.github/workflows/README.md](./.github/workflows/README.md) for details.

## 🤝 Contributing

This is currently in beta. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source and available under the MIT License.

---

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
