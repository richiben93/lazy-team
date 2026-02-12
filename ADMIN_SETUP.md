# Admin Authentication Setup

## Environment Variables

Add the following to `.env.local` (or your deployment environment):

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$12$replace_with_bcrypt_hash
NEXTAUTH_SECRET=replace_with_random_secret
```

### Generate a Password Hash

Use the helper script to create a bcrypt hash:

```bash
node scripts/hash-password.mjs "your-secure-password"
```

Copy the output into `ADMIN_PASSWORD_HASH`.

### Generate a Secret

Use any random 32+ char string for `NEXTAUTH_SECRET`.

## Access

- Login page: `/admin/login`
- Dashboard: `/admin`

## Notes

- Credentials are verified server-side via NextAuth.
- All `/admin/*` routes are protected by middleware.
- Replace any old `ADMIN_PASSWORD` values with `ADMIN_PASSWORD_HASH`.
- Admin content actions use the same generator as the existing CLI (`scripts/generate-data.mjs`).
