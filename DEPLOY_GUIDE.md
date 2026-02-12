# 🚀 Guida Deploy Produzione - Vercel + PlanetScale

## Overview

**Stack Produzione**:
- 🚀 **Hosting**: Vercel (Next.js serverless)
- 🗄️ **Database**: PlanetScale (MySQL serverless)
- 🗺️ **Mappe**: Mapbox GL JS
- 🔐 **Auth**: NextAuth con JWT

**Tempo Stimato**: 30-45 minuti

---

## 📋 Prerequisiti

- [ ] Account GitHub
- [ ] Account Vercel (gratis)
- [ ] Account PlanetScale (gratis)
- [ ] Account Mapbox (gratis)
- [ ] Git installato localmente

---

## STEP 1: Preparare il Repository

### 1.1 Commit Tutti i Cambiamenti

```bash
# Verifica stato
git status

# Aggiungi tutti i file (esclusi quelli in .gitignore)
git add .

# Commit
git commit -m "feat: add emoji filters, multi-admin system, and production config"

# Push su GitHub
git push origin main
```

### 1.2 Verifica .gitignore

Assicurati che `.gitignore` contenga:
```
# Local DB (non committare!)
data/
*.db
*.db.*

# Environment variables
.env.local
.env*.local

# Next.js
.next/
out/

# Dependencies
node_modules/
```

---

## STEP 2: Configurare PlanetScale

### 2.1 Crea Account

1. Vai su https://planetscale.com/
2. Sign up con GitHub (gratis)
3. Conferma email

### 2.2 Crea Database

```bash
# Opzione A: Via Dashboard (più facile)
1. Click "New database"
2. Nome: lazy-team-prod
3. Region: scegli più vicina (es. eu-west)
4. Plan: Hobby (gratis, 5GB)
5. Click "Create database"

# Opzione B: Via CLI (opzionale)
# Installa PlanetScale CLI
brew install planetscale/tap/pscale  # Mac
# o scarica da: https://github.com/planetscale/cli

# Login
pscale auth login

# Crea database
pscale database create lazy-team-prod --region eu-west
```

### 2.3 Ottieni Connection String

```bash
# Via Dashboard:
1. Vai su database → lazy-team-prod
2. Click "Connect"
3. Framework: Prisma (o General)
4. Branch: main
5. Copia la connection string

# Esempio:
DATABASE_URL="mysql://xxxxxxx:************@aws.connect.psdb.cloud/lazy-team-prod?ssl={"rejectUnauthorized":true}"

# ⚠️ IMPORTANTE: Salva questa stringa in un posto sicuro!
```

---

## STEP 3: Migrare Dati Admin (se esistono)

### 3.1 Setup Locale per Migrazione

```bash
# 1. Aggiungi DATABASE_URL a .env.local
echo 'DATABASE_URL="<tua-connection-string>"' >> .env.local

# 2. Esegui migrazione
node scripts/migrate-to-planetscale.mjs

# Output atteso:
# ✅ Migrated: admin (Administrator)
# ✅ Migrated: riccardo (Riccardo Benassi)
# ...
```

### 3.2 Verifica Migrazione

```bash
# Via PlanetScale Console
1. Vai su lazy-team-prod
2. Click "Console"
3. Esegui query:
   SELECT * FROM admins;
4. Verifica che tutti gli admin siano presenti
```

---

## STEP 4: Configurare Vercel

### 4.1 Crea Account

1. Vai su https://vercel.com/
2. Sign up con GitHub (usa stesso account del repo)
3. Autorizza Vercel ad accedere ai tuoi repository

### 4.2 Importa Progetto

```bash
# Via Dashboard:
1. Click "Add New..." → "Project"
2. Seleziona il repository "lazy-team"
3. Click "Import"
```

### 4.3 Configurazione Build

Vercel rileverà automaticamente Next.js. Verifica:

```
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: npm install
```

**⚠️ NON FARE ANCORA DEPLOY!** Prima configura le variabili d'ambiente.

---

## STEP 5: Configurare Environment Variables

### 5.1 Aggiungi Variabili su Vercel

Nel progetto Vercel:
1. Vai su "Settings" → "Environment Variables"
2. Aggiungi le seguenti variabili:

#### Variabili Obbligatorie:

```bash
# Database (PlanetScale)
DATABASE_URL=mysql://xxxxxxx:************@aws.connect.psdb.cloud/lazy-team-prod?ssl={"rejectUnauthorized":true}

# NextAuth
NEXTAUTH_SECRET=<genera-con-openssl-rand-base64-32>
NEXTAUTH_URL=https://tuo-dominio.vercel.app

# Admin (primo admin, cambia password dopo!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<password-sicura-temporanea>

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
```

#### Come Generare NEXTAUTH_SECRET:

```bash
# Locale
openssl rand -base64 32

# Oppure online
# https://generate-secret.vercel.app/32
```

### 5.2 Configurazione per Ambiente

**IMPORTANTE**: Seleziona gli ambienti per ogni variabile:
- `DATABASE_URL`: **Production** + Preview + Development
- `NEXTAUTH_SECRET`: **Production** + Preview + Development
- `NEXTAUTH_URL`: Solo **Production** (usa URL effettivo)
- `ADMIN_USERNAME`: **Production**
- `ADMIN_PASSWORD`: **Production**
- `NEXT_PUBLIC_MAPBOX_TOKEN`: **Production** + Preview + Development

---

## STEP 6: Deploy!

### 6.1 Primo Deploy

```bash
# Via Dashboard Vercel:
1. Click "Deploy"
2. Aspetta build (2-5 minuti)
3. ✅ Deploy completato!

# URL temporaneo:
https://lazy-team-xxxxx.vercel.app
```

### 6.2 Verifica Deploy

1. Visita il sito
2. Testa homepage con mappa
3. Vai su `/admin/login`
4. Login con admin credentials
5. Verifica filtri funzionanti
6. Vai su "Admin Users"
7. Verifica lista admin migrati

---

## STEP 7: Configurare Dominio Custom (Opzionale)

### 7.1 Aggiungi Dominio

```bash
# Su Vercel:
1. Settings → Domains
2. Aggiungi: lazy-team.com (o tuo dominio)
3. Vercel ti darà record DNS da configurare
```

### 7.2 Configura DNS

Sul tuo provider DNS (Cloudflare, Namecheap, etc.):
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 Aggiorna NEXTAUTH_URL

```bash
# Su Vercel → Environment Variables
NEXTAUTH_URL=https://lazy-team.com

# Redeploy
git commit --allow-empty -m "Update domain"
git push
```

---

## STEP 8: Post-Deploy Security

### 8.1 Cambia Password Admin

```bash
1. Login su /admin/login
2. Vai su Admin Users
3. Modifica admin creato da ADMIN_PASSWORD
4. Cambia password con una sicura (12+ caratteri)
5. Salva
```

### 8.2 Rimuovi ADMIN_PASSWORD da Env Vars

```bash
# Su Vercel:
1. Settings → Environment Variables
2. Trova ADMIN_PASSWORD
3. Click "..." → "Remove"
4. Conferma
```

### 8.3 Configura 2FA (Consigliato)

**PlanetScale**:
1. Settings → Security
2. Enable Two-Factor Authentication

**Vercel**:
1. Account Settings → Security
2. Enable Two-Factor Authentication

---

## STEP 9: Configurazioni Opzionali

### 9.1 Analytics (Opzionale)

```bash
# Vercel Analytics (gratis)
1. Dashboard → Analytics → Enable
2. Aggiungi al progetto:
   npm install @vercel/analytics

3. In src/app/layout.tsx:
   import { Analytics } from '@vercel/analytics/react';
   
   // Nel component:
   <Analytics />
```

### 9.2 Protezione DDoS (Opzionale)

```bash
# Cloudflare (gratis)
1. Aggiungi sito su Cloudflare
2. Proxy DNS attraverso Cloudflare
3. Abilita "Under Attack Mode" se necessario
```

### 9.3 Monitoring (Opzionale)

```bash
# Vercel Speed Insights (gratis)
npm install @vercel/speed-insights

# In layout.tsx:
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

---

## 🔧 Troubleshooting

### Build Failed

```bash
# Errore: Module not found
→ Verifica che node_modules sia committato in .gitignore
→ Vercel reinstalla automaticamente

# Errore: Environment variable missing
→ Verifica tutte le variabili in Settings → Environment Variables
→ Redeploy dopo aver aggiunto variabili
```

### Database Connection Failed

```bash
# Verifica DATABASE_URL
→ Deve essere per branch "main" di PlanetScale
→ SSL deve essere abilitato

# Test connessione:
node -e "const {connect} = require('@planetscale/database'); const c = connect({url: process.env.DATABASE_URL}); c.execute('SELECT 1').then(() => console.log('✅ OK')).catch(e => console.error('❌', e));"
```

### Admin Login Failed

```bash
# Verifica che admin esista in PlanetScale
→ PlanetScale Console → SELECT * FROM admins;

# Se table vuota:
→ Esegui script migrazione localmente
→ O crea admin manualmente via console
```

### Mappe Non Caricano

```bash
# Verifica NEXT_PUBLIC_MAPBOX_TOKEN
→ Deve iniziare con "pk."
→ Deve essere pubblico (NEXT_PUBLIC_)
→ Verifica quota su mapbox.com
```

---

## 📊 Monitoraggio Post-Deploy

### Metriche da Monitorare

**Vercel Dashboard**:
- ✅ Build time (< 3 min)
- ✅ Page load time (< 2 sec)
- ✅ Errors (0 idealmente)

**PlanetScale Dashboard**:
- ✅ Query time (< 100ms avg)
- ✅ Storage usage
- ✅ Connection count

**Mapbox Dashboard**:
- ✅ Map loads (< 50k/month gratis)
- ✅ API requests

---

## 🔄 Workflow Deploy Futuro

### Push to Deploy

```bash
# Ogni push su main triggera auto-deploy
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel auto-deploya in 2-5 minuti
```

### Preview Deployments

```bash
# Ogni PR crea preview deploy automatico
git checkout -b feature/new-filter
git push origin feature/new-filter

# Apri PR su GitHub
# Vercel crea URL preview: lazy-team-git-feature-xxx.vercel.app
```

---

## 💰 Costi Previsti

### Free Tier (Sufficiente per la maggior parte dei casi):

**Vercel**:
- ✅ Bandwidth: 100 GB/mese
- ✅ Build time: 6000 min/mese
- ✅ Serverless executions: Illimitate

**PlanetScale**:
- ✅ Storage: 5 GB
- ✅ Row reads: 1B/mese
- ✅ Row writes: 10M/mese

**Mapbox**:
- ✅ Map loads: 50k/mese
- ✅ Requests: 100k/mese

### Se Superi Free Tier:

- Vercel Pro: $20/mese
- PlanetScale Scaler: $29/mese  
- Mapbox: Pay-as-you-go da $5/mese

---

## ✅ Checklist Finale

- [ ] Repository su GitHub pushato
- [ ] Account PlanetScale creato
- [ ] Database PlanetScale creato
- [ ] Connection string ottenuta
- [ ] Dati admin migrati (se esistenti)
- [ ] Account Vercel creato
- [ ] Progetto importato su Vercel
- [ ] Tutte environment variables configurate
- [ ] Deploy completato con successo
- [ ] Sito accessibile e funzionante
- [ ] Login admin funzionante
- [ ] Filtri mappa funzionanti
- [ ] Admin Users gestione funzionante
- [ ] Password admin cambiata
- [ ] ADMIN_PASSWORD rimossa da env vars
- [ ] 2FA abilitata (consigliato)
- [ ] Dominio custom configurato (opzionale)
- [ ] Analytics abilitata (opzionale)

---

## 🎉 Conclusione

Il tuo sito è ora **LIVE IN PRODUZIONE**! 🚀

**URL Produzione**: https://lazy-team-xxxxx.vercel.app

**Prossimi Step**:
1. Condividi URL con il team
2. Aggiungi admin users necessari
3. Monitora analytics
4. Continua a sviluppare features

**Supporto**:
- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- Mapbox Docs: https://docs.mapbox.com/

Buon divertimento! 🎊
