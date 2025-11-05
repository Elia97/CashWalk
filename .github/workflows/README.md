# GitHub Actions

## Seed Database Workflow

### 📋 Description

This workflow seeds the database with system categories. **Must be run manually only once per environment.**

### 🚀 How to Run

1. Go to GitHub → **Actions** tab
2. Select **"Seed Database"** from the workflow list
3. Click **"Run workflow"**
4. Type `seed` in the confirmation field
5. Click **"Run workflow"** to confirm

### ⚙️ Prerequisites

Make sure you have configured the `DATABASE_URL` secret in your repository settings:

- Settings → Secrets and variables → Actions → New repository secret
- Name: `DATABASE_URL`
- Value: Your PostgreSQL database connection string

### 📝 Important Notes

- ⚠️ This workflow is **NOT** run automatically on push
- ✅ It's designed to be run **manually** and **only once** per environment
- 🔒 Requires explicit confirmation (you must type "seed")
- 🌱 Populates the database with 28 system categories (5 income, 23 expense)
- 🔄 Uses `onConflictDoNothing()` so it's safe to re-run if needed

### 🎯 When to Run

- After first production deployment
- After creating a new environment (staging, development, etc.)
- To restore system categories if accidentally deleted
