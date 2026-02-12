# 🚀 GUIDA COMPLETA - Sistema Lazy Team

## ✅ Tutto Implementato!

Congratulazioni! Il sistema è completo con:
1. ✅ Script per aggiornare dati esistenti
2. ✅ Sistema multi-admin sicuro con database SQLite
3. ✅ UI completa per gestione admin

---

## 📋 Setup Iniziale

### 1. Inizializza il Database Admin

```bash
# Il database verrà creato automaticamente alla prima esecuzione
# Crea il primo admin usando le variabili d'ambiente
```

Aggiungi a `.env.local`:
```
ADMIN_USERNAME=tuoUsername
ADMIN_PASSWORD=tuaPasswordSicura
NEXTAUTH_SECRET=genera-un-secret-sicuro
NEXTAUTH_URL=http://localhost:3000
```

### 2. Genera NEXTAUTH_SECRET

```bash
# Usa openssl per generare un secret sicuro
openssl rand -base64 32
```

### 3. Primo Avvio

```bash
npm run dev
```

Al primo avvio, il sistema creerà automaticamente:
- Database SQLite in `data/admins.db`
- Primo utente admin con le credenziali da `.env.local`

---

## 🔄 Aggiornare i Dati Esistenti

### Script Interattivo

```bash
node scripts/update-data.mjs
```

Lo script ti guiderà attraverso:

1. **Aggiornamento Membri**:
   - Scegli un emoji per ogni Lazer
   - Segna chi è admin
   - Aggiorna i file `.mdx` automaticamente

2. **Aggiornamento Trip**:
   - Assegna un autore (Lazer) a ogni trip
   - Scegli il tipo (one-day, overnight, multi-day)
   - Scegli il terreno (road, gravel, mtb, mixed)

### Esempio Interazione:

```
👤 Membro: Richi Ben (The Architect)
File: richi.mdx

Emoji suggerite: 🚴 🏔️ ⚡ 🦾 🎯 🔥 💨 🌟
Scegli un emoji per questo Lazer: 🚴
È un admin? (y/n): y
✅ Aggiornato richi.mdx

🚴 Trip: Alpine Climb
Directory: alpine-climb

Membri disponibili:
  1. 🚴 richi
  2. 🏔️ marco
Scegli il numero del Lazer autore: 1

Tipo di trip:
  1. one-day
  2. overnight
  3. multi-day
Scegli il numero: 3

Terreno:
  1. road
  2. gravel
  3. mtb
  4. mixed
Scegli il numero: 2
✅ Aggiornato alpine-climb
```

### Dopo l'Aggiornamento

```bash
# Rigenera i dati JSON
npm run generate

# Testa il sito
npm run dev
```

---

## 👥 Gestione Admin

### Accesso Admin Panel

1. Vai su `/admin/login`
2. Login con credenziali
3. Accedi a **Admin Users** dal menu

### Funzionalità

#### Visualizza Admin
- Lista completa di tutti gli admin
- Username, nome, email, data creazione
- Ordinamento automatico

#### Aggiungi Nuovo Admin
1. Click su **"Nuovo Admin"**
2. Compila il form:
   - Username (univoco)
   - Password (minimo 8 caratteri consigliati)
   - Nome completo
   - Email (opzionale)
3. Click **"Salva"**

#### Modifica Admin
1. Click sull'icona **Edit** (matita)
2. Modifica i campi desiderati
3. Per cambiare password: inserisci nuova password
4. Click **"Salva"**

#### Elimina Admin
1. Click sull'icona **Trash** (cestino)
2. Conferma eliminazione
3. **Nota**: Non puoi eliminare te stesso!

### Sicurezza

✅ **Password Hashed**: bcrypt con salt rounds = 12
✅ **Autenticazione**: NextAuth con JWT
✅ **Database Locale**: SQLite (non esposto)
✅ **Protezione API**: Session check su tutte le route
✅ **Validazione**: Controlli su username univoci

---

## 🗺️ Usare i Filtri sulla Mappa

### Mappa Globale (Homepage)

1. **Apri Filtri**: Click sull'icona **Filter** (in alto a sinistra)
2. **Seleziona Filtri**:
   - **Lazer**: Click sull'emoji del Lazer
   - **Duration**: Click sul tipo (One Day, Overnight, Multi-Day)
   - **Terrain**: Click sul terreno (Road, Gravel, MTB, Mixed)
   - **Distance**: Click sul range (< 100km, 100-300km, etc.)
   - **Elevation**: Click sul range (< 1000m, 1000-3000m, etc.)
3. **Combina Filtri**: Puoi selezionare più filtri contemporaneamente
4. **Reset**: Click su **"Clear"** per resettare tutto
5. **Chiudi Pannello**: Click sull'icona **X**

### Interazione con la Mappa

- **Hover su Emoji**: Vedi tooltip con immagine del trip
- **Hover su Traccia**: Vedi tooltip
- **Click su Emoji**: Vai alla pagina del trip
- **Hover su Legenda**: Vedi tooltip
- **Click su Legenda**: Vai alla pagina del trip

### Pagina Trips (`/trips`)

1. **Search**: Cerca per titolo o località
2. **Sort**: Newest, Longest, Elevation
3. **Tags**: Filtra per tag esistenti
4. **Advanced Filters**: Click sull'icona **Filter**
   - Stessi filtri della mappa globale
   - Risultati aggiornati in tempo reale
   - Contatore risultati sempre visibile

---

## 🎨 Personalizzazioni

### Cambiare Emoji Lazer

Modifica `content/members/slug.mdx`:
```yaml
---
emoji: "🚴"  # Cambia con qualsiasi emoji
---
```

### Cambiare Colori Filtri

In `src/components/filters/TripFilters.tsx`:
```typescript
// Lazer filters
bg-black → bg-blue-600

// Type filters  
bg-blue-600 → bg-purple-600

// Terrain filters
bg-green-600 → bg-emerald-600
```

### Aggiungere Nuovi Range Distanza/Dislivello

In `TripFilters.tsx`:
```typescript
const QUICK_FILTERS = {
  distance: [
    { label: '< 50km', value: 0 },
    { label: '50-200km', value: 50 },
    { label: '> 200km', value: 200 },
  ],
};
```

---

## 🔐 Best Practices Sicurezza

### Password Admin

✅ **Usa password complesse**: Minimo 12 caratteri
✅ **Combina**: Lettere, numeri, simboli
✅ **Non riutilizzare**: Password uniche per ogni admin
✅ **Cambia regolarmente**: Ogni 3-6 mesi

### Gestione Token

```bash
# Genera nuovo NEXTAUTH_SECRET periodicamente
openssl rand -base64 32

# Aggiorna .env.local
NEXTAUTH_SECRET=nuovo_secret
```

### Backup Database

```bash
# Backup periodico del database admin
cp data/admins.db data/admins.db.backup.$(date +%Y%m%d)

# Mantieni solo ultimi 7 giorni
find data -name "admins.db.backup.*" -mtime +7 -delete
```

### .gitignore

Verifica che questi file NON siano committati:
```
.env.local
data/*.db
data/*.db.*
```

---

## 📊 Struttura Database

```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐛 Troubleshooting

### Database non si crea

```bash
# Verifica directory data
ls -la data/

# Se non esiste
mkdir -p data

# Riavvia server
npm run dev
```

### Login fallisce

1. Verifica credenziali in `.env.local`
2. Controlla console per errori
3. Verifica che il database esista: `ls data/admins.db`
4. Prova a ricreare il primo admin:
   ```bash
   rm data/admins.db
   npm run dev
   ```

### Filtri non funzionano

1. Verifica che i trip abbiano i campi: `author`, `type`, `terrain`
2. Esegui: `npm run generate`
3. Ricarica pagina (Ctrl+R)
4. Controlla console per errori

### Emoji non si vedono

1. Verifica che i membri abbiano campo `emoji`
2. Verifica che trip abbia campo `author` corretto
3. Esegui: `npm run generate`
4. Ricarica pagina

---

## 📝 Checklist Completa

### Setup Iniziale
- [ ] Aggiungi variabili `.env.local`
- [ ] Genera `NEXTAUTH_SECRET`
- [ ] Avvia server: `npm run dev`
- [ ] Verifica primo admin creato
- [ ] Login su `/admin/login`

### Aggiornamento Dati
- [ ] Esegui `node scripts/update-data.mjs`
- [ ] Assegna emoji a tutti i membri
- [ ] Marca admin necessari
- [ ] Assegna autori a tutti i trip
- [ ] Scegli type per tutti i trip
- [ ] Scegli terrain per tutti i trip
- [ ] Esegui `npm run generate`
- [ ] Testa mappa e filtri

### Test Sistema
- [ ] Testa login admin
- [ ] Crea nuovo admin
- [ ] Modifica admin esistente
- [ ] Testa cambio password
- [ ] Testa filtri mappa globale
- [ ] Testa filtri pagina trips
- [ ] Testa tooltip con emoji
- [ ] Testa navigazione click emoji

### Deploy
- [ ] Configura `NEXTAUTH_SECRET` su server
- [ ] Configura `ADMIN_USERNAME` e `ADMIN_PASSWORD`
- [ ] Deploy database insieme all'app
- [ ] Testa login su produzione
- [ ] Cambia password default

---

## 🎉 Conclusione

Il sistema è completo e pronto all'uso! Hai ora:

✅ Mappe interattive con emoji
✅ Filtri avanzati multipli
✅ Sistema multi-admin sicuro
✅ UI completa per gestione
✅ Script automatici per dati
✅ Database SQLite integrato

**Prossimi Step Consigliati:**
1. Esegui lo script di aggiornamento dati
2. Configura gli admin necessari
3. Testa tutti i filtri
4. Personalizza colori/emoji a tuo piacimento
5. Deploy in produzione

Buon divertimento con Lazy Team! 🚴‍♂️🏔️
