# Database Migration Guide

## 📋 Prerequisites

1. ✅ Neon account created
2. ✅ Database connection string in `.env`
3. ✅ Dependencies installed (`npm install`)

## 🚀 Migration Process

### Step 1: Verify Environment Variables

```bash
# Open .env file
code .env

# Ensure you have:
NEON_DATABASE_URL=postgresql://neondb_owner:xxxxxxxxx@ep-shy-band-a15qdjt0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### Step 2: Run Migration

```bash
# From server directory
cd server

# Run migration script
node src/migrations/run-migration.js
```

### Step 3: Verify Success

You should see:
```
🚀 Starting database migration...
📄 Running migration: 001_initial_schema.sql
✅ Migration completed successfully!

🔍 Verifying tables...

📊 Created tables:
   ✓ admins
   ✓ check_in_outs
   ✓ feedbacks
   ✓ rankings
   ✓ schools
   ✓ stalls
   ✓ students
   ✓ volunteers

✅ Seeded 4 schools

🎉 Database is ready for production!
```

## 📊 Database Schema Overview

### Tables Created:

1. **schools** - University departments (4 seeded)
2. **students** - 11,000+ students capacity
3. **volunteers** - QR code scanners
4. **admins** - Dashboard access
5. **stalls** - 200+ event stalls
6. **check_in_outs** - Entry/exit tracking (odd/even logic)
7. **feedbacks** - Category 1 (max 200 per student)
8. **rankings** - Category 2 (top 3 per school)

### Key Features:

✅ **UUID primary keys** (scalable, distributed-safe)
✅ **Indexes on all query columns** (fast lookups)
✅ **Foreign key constraints** (data integrity)
✅ **Check constraints** (validation at DB level)
✅ **Auto-update timestamps** (triggers)
✅ **Unique constraints** (prevent duplicates)

## 🔄 Rollback (If Needed)

```bash
# Run rollback script
node src/migrations/run-rollback.js
```

## 🧪 Test Connection

```bash
# Test database connection
node src/config/test-db.js
```

## 📝 Manual Migration (Alternative)

If you prefer to run SQL directly in Neon console:

1. Go to https://console.neon.tech
2. Select your database
3. Open SQL Editor
4. Copy contents of `migrations/001_initial_schema.sql`
5. Execute

## 🚨 Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Check `NEON_DATABASE_URL` in `.env`

### Permission Error
```
Error: permission denied for schema public
```
**Solution:** Ensure your Neon user has CREATE permissions

### Table Exists Error
```
Error: relation "students" already exists
```
**Solution:** Run rollback first or use `DROP TABLE IF EXISTS`

## 📊 Post-Migration Steps

1. ✅ Seed initial data (schools, admins)
2. ✅ Import student data (CSV/Excel)
3. ✅ Generate QR codes for students
4. ✅ Generate QR codes for stalls
5. ✅ Test authentication flow
6. ✅ Test check-in/check-out flow

## 🎯 Next Steps

After successful migration:

1. **Seed Data**: Run seeders to populate test data
2. **Create Admin**: Register first admin user
3. **Import Students**: Bulk import from Excel
4. **Generate QR Codes**: Create QR codes for all entities
5. **Test API**: Verify all endpoints work with real database

## 📚 Additional Scripts

```bash
# Check table structure
node src/migrations/check-schema.js

# Reset database (DANGER: Deletes all data)
node src/migrations/reset-database.js

# Backup database
node src/migrations/backup-database.js
```
