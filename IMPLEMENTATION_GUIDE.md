# 🎯 Lazy Team - Sistema Completo con Filtri e Emoji

## ✅ Completato

### 1. **Tipi Aggiornati** (`src/types/index.ts`)
```typescript
- Trip: aggiunto author, type, terrain
- Member: aggiunto emoji, isAdmin
- TripType: 'one-day' | 'overnight' | 'multi-day'
- TerrainType: 'road' | 'gravel' | 'mtb' | 'mixed'
```

### 2. **Componente Filtri** (`src/components/filters/TripFilters.tsx`)
Sistema completo di filtri con:
- Filtro per Lazer (con emoji)
- Filtro per durata (one-day, overnight, multi-day)
- Filtro per terreno (road, gravel, mtb, mixed)
- Filtro rapido per distanza (< 100km, 100-300km, 300-500km, > 500km)
- Filtro rapido per dislivello (< 1000m, 1000-3000m, 3000-5000m, > 5000m)
- Pulsante "Clear" per resettare tutti i filtri

### 3. **Mappa Globale Aggiornata** (`src/components/map/MapboxGlobalMap.tsx`)
- ✅ Tracce NERE per tutti i trip
- ✅ Emoji dei Lazer al centro di ogni traccia
- ✅ Pannello filtri integrato (icona Filter in alto a sinistra)
- ✅ Legenda aggiornata con emoji e contatore trip filtrati
- ✅ Tooltip migliorato con emoji, type e terrain
- ✅ Click su emoji per navigare al trip
- ✅ Hover su emoji per vedere tooltip

### 4. **Pagina Trips Aggiornata** (`src/app/trips/FilterableTrips.tsx`)
- ✅ Filtri avanzati integrati
- ✅ Pannello collassabile con toggle
- ✅ Tutti i filtri funzionanti:
  - Search
  - Tags
  - Lazer (con emoji)
  - Duration
  - Terrain
  - Distance ranges
  - Elevation ranges
- ✅ Contatore risultati
- ✅ Pulsante Clear per filtri avanzati

## 🔧 Da Completare

### 1. **Aggiornare i Dati dei Trip**

Devi aggiornare ogni file `trip.mdx` in `content/trips/*/trip.mdx` per includere:

```yaml
---
title: "Nome Trip"
date: "2024-01-01"
location: "Località"
tags: ["tag1", "tag2"]
coverImage: "/images/..."
gpxFile: "/gpx/..."
excerpt: "..."
author: "riccardo"  # ← NUOVO: slug del member
type: "multi-day"    # ← NUOVO: one-day | overnight | multi-day
terrain: "gravel"    # ← NUOVO: road | gravel | mtb | mixed
---
```

**Esempio completo**:
```yaml
---
title: "Raid degli Altipiani"
date: "2024-08-15"
location: "Trentino, Italia"
tags: ["gravel", "alps"]
coverImage: "/images/raids.jpg"
gpxFile: "/gpx/raids.gpx"
excerpt: "Un viaggio epico attraverso gli altipiani del Trentino"
author: "riccardo"
type: "multi-day"
terrain: "gravel"
---
```

### 2. **Aggiornare i Dati dei Membri**

Aggiorna ogni file `member.mdx` in `content/members/*/member.mdx`:

```yaml
---
name: "Riccardo Benassi"
nickname: "Richy"
role: "Trail Finder"
avatar: "/images/..."
emoji: "🚴"         # ← NUOVO: emoji unica per il Lazer
isAdmin: true      # ← NUOVO: (opzionale) per admin
---
```

**Suggerimenti emoji**:
- 🚴 Ciclista classico
- 🏔️ Montanaro
- ⚡ Velocista
- 🦾 Scalatore
- 🎯 Navigator
- 🔥 Gravel King
- 💨 Speed Demon
- 🌟 All-rounder

### 3. **Sistema Multi-Admin** (Da Implementare)

Per rendere il sistema più sicuro e permettere più admin:

#### Opzione A: File JSON con hash delle password
Crea `config/admins.json`:
```json
[
  {
    "username": "riccardo",
    "passwordHash": "$2a$10$...",
    "name": "Riccardo",
    "email": "riccardo@example.com"
  },
  {
    "username": "marco",
    "passwordHash": "$2a$10$...",
    "name": "Marco",
    "email": "marco@example.com"
  }
]
```

#### Opzione B: Database (Migliore per sicurezza)
Usa un database (SQLite, PostgreSQL, etc.) con tabella:
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Opzione C: Variabili d'ambiente multiple (Più semplice)
In `.env.local`:
```
ADMIN_USERS=riccardo:$2a$10$hash1,marco:$2a$10$hash2,luca:$2a$10$hash3
```

Poi modificare `src/lib/auth.ts`:
```typescript
const adminUsers = process.env.ADMIN_USERS?.split(',').map(entry => {
  const [username, hash] = entry.split(':');
  return { username, passwordHash: hash };
});

// In authorize():
const user = adminUsers?.find(u => u.username === username);
if (!user) return null;
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### 4. **Generare Hash delle Password**

Usa questo script Node.js:
```javascript
// scripts/hash-password.js
const bcrypt = require('bcryptjs');
const password = process.argv[2];
if (!password) {
  console.log('Usage: node hash-password.js <password>');
  process.exit(1);
}
const hash = bcrypt.hashSync(password, 10);
console.log('Hash:', hash);
```

Esegui:
```bash
node scripts/hash-password.js tuaPassword
```

### 5. **UI Admin per Gestione Multi-Admin**

Crea una sezione in `/admin` per gestire gli admin:
- Lista admin esistenti
- Aggiungi nuovo admin
- Modifica/elimina admin
- Cambia password

## 📋 Checklist Completa

### Dati:
- [ ] Aggiornare tutti i trip con `author`, `type`, `terrain`
- [ ] Aggiungere `emoji` a tutti i membri
- [ ] Marcare membri admin con `isAdmin: true`

### Sicurezza:
- [ ] Decidere sistema multi-admin (A, B, o C)
- [ ] Generare hash password per tutti gli admin
- [ ] Aggiornare `src/lib/auth.ts` per supportare multi-admin
- [ ] Testare login con diversi account admin

### Opzionale:
- [ ] Creare UI per gestione admin
- [ ] Aggiungere log delle azioni admin
- [ ] Implementare cambio password
- [ ] Aggiungere 2FA (Google Authenticator)

## 🎨 Personalizzazioni Disponibili

### Cambiare colori filtri:
In `TripFilters.tsx` e `FilterableTrips.tsx`:
- Author filters: `bg-black` → altro colore
- Type filters: `bg-blue-600` → altro colore
- Terrain filters: `bg-green-600` → altro colore
- Distance filters: `bg-yellow-600` → altro colore
- Elevation filters: `bg-orange-600` → altro colore

### Aggiungere nuovi filtri:
1. Aggiungere campo al tipo `Trip` in `types/index.ts`
2. Aggiungere UI in `TripFilters.tsx`
3. Aggiungere logica filtro in `FilterableTrips.tsx` e `MapboxGlobalMap.tsx`

### Cambiare intervalli distanza/dislivello:
Modificare array in `TripFilters.tsx`:
```typescript
const QUICK_FILTERS = {
  distance: [
    { label: '< 50km', value: 0 },
    { label: '50-150km', value: 50 },
    // ...
  ],
  // ...
};
```

## 🚀 Testing

### 1. Test Filtri Mappa:
- [ ] Aprire homepage
- [ ] Click su icona Filter
- [ ] Selezionare un Lazer → vedi solo suoi trip
- [ ] Selezionare duration → vedi solo quelli
- [ ] Selezionare terrain → vedi solo quelli
- [ ] Combinare più filtri
- [ ] Verificare contatore trip
- [ ] Hover su emoji → vedi tooltip
- [ ] Click su emoji → vai al trip

### 2. Test Filtri Trips Page:
- [ ] Aprire `/trips`
- [ ] Click su icona Filter
- [ ] Testare tutti i filtri
- [ ] Testare combinazioni
- [ ] Verificare contatore risultati
- [ ] Clear filters → torna tutto

### 3. Test Admin:
- [ ] Login come admin
- [ ] Creare/modificare trip
- [ ] Creare/modificare member
- [ ] Logout
- [ ] Tentare accesso senza auth

## 📝 Note Importanti

1. **Emoji**: Scegli emoji UNICHE per ogni Lazer per evitare confusione
2. **Author**: Deve corrispondere esattamente allo `slug` del membro
3. **Type/Terrain**: Usa solo i valori definiti nei tipi TypeScript
4. **Security**: MAI committare password in chiaro
5. **Testing**: Testa tutti i filtri dopo aver aggiornato i dati

## 🆘 Troubleshooting

**Emoji non si vede sulla mappa**:
- Verifica che il member abbia campo `emoji`
- Verifica che il trip abbia campo `author` corretto
- Controlla console per errori

**Filtri non funzionano**:
- Verifica che i dati abbiano i campi corretti
- Controlla console per errori TypeScript
- Verifica formato dati (es. `type: "one-day"` non `type: "oneday"`)

**Build fallisce**:
- Verifica che tutti i trip abbiano i nuovi campi
- Verifica che tutti i membri abbiano emoji
- Esegui `npm run generate` prima di `npm run build`
