# Production Scripts

One-time operational scripts for database migrations and token format updates.

## 📁 Scripts

### `regenerate-qr-tokens.js`
**Purpose:** Regenerate all QR tokens in production database (one-time or infrequent)  
**Use Case:** Token format updates, security regeneration, major migrations  
**Impact:** Updates `students.qr_code_token` and `stalls.qr_code_token` in Neon PostgreSQL

```bash
npm run qr:regenerate
# or
node src/scripts/regenerate-qr-tokens.js
```

**Output:**
- Updates all student tokens (JWT format, ~157 chars)
- Updates all stall tokens (simple format, ~33 chars)
- Clears Redis cache for regenerated tokens
- Shows progress and statistics

**When to run:**
- After token format changes (rare)
- Security incidents requiring token refresh
- Database migration/restoration
- Major version upgrades

---

## ⚠️ Production Safety

- **Database Impact:** Modifies production data
- **Frequency:** One-time or very infrequent (major updates only)
- **Downtime:** No downtime required
- **Rollback:** Keep database backups before running
- **Testing:** Always test in staging first

---

## 🔐 Environment Variables Required

```env
NEON_DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
```

---

## 📝 Note

For regular production utilities (like cache warming), see `src/utils/` directory.
Scripts here are for **infrequent operational tasks only**.
