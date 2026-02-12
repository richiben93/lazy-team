# Admin Authorization Implementation

## Implemented Changes

### Auth System (NextAuth Credentials)

- Server-side validation with bcrypt hash
- JWT session strategy
- Protected admin routes via middleware

### Files

- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `src/lib/auth.ts` — Credentials provider + config
- `src/app/admin/login/page.tsx` — Login UI
- `src/app/admin/page.tsx` — Protected dashboard
- `src/app/admin/AdminClient.tsx` — Admin forms + lists
- `src/middleware.ts` — Route protection
- `scripts/hash-password.mjs` — Password hash helper
- `src/app/api/admin/*` — Content management API (members/trips)

## Admin UI Capabilities

- Add, edit, and remove members
- Add, edit, and remove trips
- Drag-and-drop GPX upload (or paste GPX content)

## Environment Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$12$replace_with_bcrypt_hash
NEXTAUTH_SECRET=replace_with_random_secret
```

## Local Run

```bash
npm run dev
```

Open: `http://localhost:3000/admin/login`
