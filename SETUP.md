# 🚀 Initial Setup - CashWalk

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL database
- GitHub account (for GitHub Actions)

## 🔧 Local Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd CashWalk
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the `.env` file with your values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - Other values as needed

4. **Run database migrations**

   ```bash
   npm run db:push
   ```

5. **Seed system categories (ONLY ONCE)**

   ```bash
   npm run db:seed
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

## 🌐 GitHub Actions Setup (Production)

### Step 1: Configure Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `DATABASE_URL`: Production database connection string
   - Other secrets needed for deployment

### Step 2: Run the Seed (ONLY ONCE)

⚠️ **IMPORTANT**: The seed must be run **manually** after the first deployment.

1. Go to **Actions** tab
2. Select **"Seed Database"**
3. Click **"Run workflow"**
4. Type `seed` in the confirmation field
5. Click **"Run workflow"**

This will populate the database with:

- ✅ 28 system categories (5 income, 23 expense)
- ✅ Optimized for personal checking accounts

### Step 3: Verify

After seeding, verify that categories are present:

- Log into the app
- Go to **Settings** → **Categories**
- You should see the 28 system categories

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start development server

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema (dev)
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed categories (ONLY ONCE)

# Build
npm run build            # Production build
npm start                # Start production server

# Auth
npm run auth:generate    # Generate auth schema
```

## 🎯 System Categories

The app comes with 28 professional categories:

**Income (5):**

- Salary & Wages
- Freelance & Side Work
- Gifts & Transfers
- Refunds & Cashback
- Other Income

**Expense (23):**

- Housing, Utilities, Groceries, Dining & Takeout
- Transportation, Auto & Vehicle
- Healthcare, Fitness & Wellness, Personal Care
- Shopping, Electronics & Tech, Home & Garden
- Entertainment, Subscriptions & Streaming, Travel & Vacation
- Education, Books & Learning
- Bank Fees, Insurance
- Childcare & Kids, Pets
- Gifts & Celebrations, Charity & Donations
- Miscellaneous

## ⚠️ Important Notes

- ❌ **DO NOT** run `npm run db:seed` on every deployment
- ✅ The seed uses `onConflictDoNothing()` so it's safe to re-run if needed
- 🔒 Never commit `.env` files with real credentials
- 📝 Always use `.env.example` as a template

## 🐛 Troubleshooting

**Seed fails:**

- Verify that `DATABASE_URL` is correct
- Make sure migrations have been run
- Check logs for specific errors

**Duplicate categories:**

- The seed is idempotent, you can re-run it without issues
- Existing categories are automatically skipped

## 📞 Support

For issues or questions, open an issue on GitHub.
