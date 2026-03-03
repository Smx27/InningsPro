# Deployment Guide

> **Deploy InningsPro applications to production with confidence.**

---

## 📚 Table of Contents

- [Overview](#overview)
- [Deployment Architecture](#deployment-architecture)
- [Prerequisites](#prerequisites)
- [Mobile App Deployment](#mobile-app-deployment)
- [Web App Deployment](#web-app-deployment)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Rollback Procedures](#rollback-procedures)
- [Performance Optimization](#performance-optimization)
- [Security Checklist](#security-checklist)
- [Troubleshooting](#troubleshooting)

---

## Overview

**InningsPro** deployments consist of:

1. **Mobile App** — React Native + Expo (iOS & Android)
2. **Web App** — Next.js (report generation and dashboards)
3. **Shared Packages** — Published to npm for versioning
4. **Infrastructure** — Cloud hosting, databases, APIs

### Deployment Flow

```
Code Push to Main
        ↓
    CI/CD Pipeline
        ↓
    ┌──────────────────┐
    ├─ Build & Test ───┤
    ├─ Build Mobile ───┤
    ├─ Build Web ──────┤
    └──────────────────┘
        ↓
    ┌──────────────────┐
    ├─ Staging Deploy ─┤
    ├─ Integration Test ┤
    └──────────────────┘
        ↓
    ┌──────────────────┐
    ├─ Production ─────┤
    └──────────────────┘
```

---

## Deployment Architecture

### System Overview

```
Mobile App (iOS/Android)
    ↓
    ├─→ Expo (Build & Distribution)
    ├─→ App Stores (iOS & Google Play)
    └─→ Firebase / Sentry (Analytics & Crash Reporting)

Web App (Next.js)
    ↓
    ├─→ Vercel / AWS / GCP (Hosting)
    ├─→ CloudFront / CDN (Static Assets)
    └─→ Database (PostgreSQL / Firebase)

Shared Packages
    ↓
    └─→ npm Registry (Public or Private)
```

### Environment Stages

```
Development (main branch)
    ↓ (auto-deploy)
Staging (staging branch / tag)
    ↓ (manual approval)
Production (release tags: v1.2.3)
    ↓ (rollback support)
```

---

## Prerequisites

### Required Tools

- **Node.js** 18+ (verify with `node --version`)
- **pnpm** 9.15+ (verify with `pnpm --version`)
- **Expo CLI** — `npm install -g expo-cli`
- **GitHub CLI** — `gh --version`
- **Docker** (optional, for containerized deployments)

### Required Accounts

- **GitHub** — Repository access
- **Expo Account** — For mobile builds
- **App Store Connect** — For iOS releases
- **Google Play Console** — For Android releases
- **npm Registry** — For package publishing (or private registry)
- **Vercel / Netlify / AWS** — For web hosting
- **Cloud Database** — PostgreSQL, Firebase, or similar
- **Sentry / LogRocket** — Error tracking and monitoring

### Environment Variables

Create `.env.production` at project root:

```bash
# Mobile (Expo)
EXPO_TOKEN=your_expo_token
EXPO_APPLE_ID=your_apple_id
EXPO_APPLE_PASSWORD=your_app_password

# Web (Next.js)
NEXT_PUBLIC_API_URL=https://api.inningspro.com
DATABASE_URL=postgresql://user:pass@host/db
NEXT_PUBLIC_GA_ID=UA-XXXXX-Y

# npm (Package Publishing)
NPM_TOKEN=your_npm_token

# Analytics & Monitoring
SENTRY_AUTH_TOKEN=your_sentry_token
FIREBASE_PROJECT_ID=your_firebase_project
```

**Never commit `.env.production`** — Use GitHub Secrets instead.

---

## Mobile App Deployment

### Step 1: Prepare Release

```bash
# Update version in app.json
cd apps/mobile
cat app.json | grep version

# Update to new version
# Example: "1.0.0" → "1.1.0"
```

Edit `apps/mobile/app.json`:

```json
{
  "expo": {
    "version": "1.1.0",
    "android": {
      "versionCode": 2
    }
  }
}
```

### Step 2: Build and Submit to Expo

```bash
# Build for both iOS and Android
cd apps/mobile

# Login to Expo
expo login
# Enter credentials when prompted

# Build for iOS and Android
eas build --platform all

# Wait for builds to complete (check Expo dashboard)
# Downloads .ipa (iOS) and .aab (Android)
```

### Step 3: Submit to App Stores

#### iOS (App Store)

```bash
# Prerequisites
# 1. Create app in App Store Connect
# 2. Create signing certificate in Apple Developer

# Submit to TestFlight (staging)
eas submit --platform ios --latest

# After testing, submit to App Store (production)
eas submit --platform ios --latest --track production
```

#### Android (Google Play)

```bash
# Prerequisites
# 1. Create app in Google Play Console
# 2. Create signing key

# Submit to internal testing track
eas submit --platform android --latest --track internal

# After testing, submit to production
eas submit --platform android --latest --track production
```

### Step 4: Monitor App Store Review

- **iOS** — Review takes 1-3 days
- **Android** — Review takes 2-4 hours typically
- Check App Store Connect and Google Play Console for status
- Prepare release notes for each version

### Step 5: Release Notes

Create `RELEASE_NOTES.md`:

```markdown
# InningsPro v1.1.0

## 🎉 New Features
- Ball-by-ball scoring validation
- Match export to PDF

## 🐛 Bug Fixes
- Fixed wide delivery calculation
- Corrected wicket attribution

## 📱 iOS Build: 1.1.0
## 🤖 Android Build: 1.1.0

## Installation
- Update via App Store (iOS)
- Update via Google Play (Android)
```

---

## Web App Deployment

### Step 1: Build Locally

```bash
# Verify build works
cd apps/report-web

# Build for production
pnpm build

# Check output
ls -la .next/
```

### Step 2: Environment Setup

Create `.env.production.local`:

```
NEXT_PUBLIC_API_URL=https://api.inningspro.com
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

**Important:** Do NOT commit this file.

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/report-web
vercel --prod

# Verify deployment
# Open https://your-project.vercel.app
```

### Step 4: Deploy to AWS

```bash
# Build
pnpm build

# Create Dockerfile (if containerizing)
cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
EOF

# Build Docker image
docker build -t inningspro-web:1.1.0 .

# Push to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker tag inningspro-web:1.1.0 $ECR_REGISTRY/inningspro-web:1.1.0
docker push $ECR_REGISTRY/inningspro-web:1.1.0

# Deploy with ECS / EKS / App Runner
# (Instructions depend on chosen service)
```

### Step 5: Deploy to GCP / Google Cloud Run

```bash
# Build
pnpm build

# Create app.yaml for App Engine
cat > app.yaml << 'EOF'
runtime: nodejs20
entrypoint: pnpm start
EOF

# Deploy
gcloud app deploy

# Or use Cloud Run
gcloud run deploy inningspro-web \
  --source . \
  --platform managed \
  --region us-central1
```

---

## Environment Configuration

### Development Environment

```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3001
DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### Staging Environment

```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.inningspro.com
NEXT_PUBLIC_LOG_LEVEL=info
SENTRY_ENVIRONMENT=staging
```

### Production Environment

```bash
# .env.production (in GitHub Secrets)
NEXT_PUBLIC_API_URL=https://api.inningspro.com
NEXT_PUBLIC_LOG_LEVEL=warn
SENTRY_ENVIRONMENT=production
```

### Accessing Secrets in CI/CD

In GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Production
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
        run: |
          pnpm install
          pnpm build --filter=report-web
          vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy

on:
  push:
    branches: [main, staging]
    tags: ["v*"]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9.15.4
      
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Lint
        run: pnpm lint
      
      - name: Test
        run: pnpm test
      
      - name: Build
        run: pnpm build

  deploy-web-staging:
    needs: build
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Staging
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          pnpm install
          vercel deploy --token $VERCEL_TOKEN --scope ${{ secrets.VERCEL_ORG }}

  deploy-web-production:
    needs: build
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          pnpm install
          vercel deploy --prod --token $VERCEL_TOKEN --scope ${{ secrets.VERCEL_ORG }}
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}

  publish-packages:
    needs: build
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Publish to npm
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
          pnpm publish --recursive --access public
```

### Setting Up CI/CD Triggers

```bash
# Tag a release
git tag v1.1.0
git push origin v1.1.0

# GitHub Actions automatically:
# 1. Runs all tests
# 2. Builds apps
# 3. Publishes packages to npm
# 4. Deploys web app to production
# 5. Creates GitHub Release
```

---

## Monitoring & Logging

### Error Tracking with Sentry

```typescript
// apps/report-web/src/pages/_app.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
});

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### Logging in Mobile App

```typescript
// apps/mobile/src/utils/logger.ts
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: __DEV__ ? 'development' : 'production',
});

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error(error);
  Sentry.captureException(error, { contexts: { custom: context } });
};
```

### Application Metrics

Monitor in production:

- **Uptime** — Web app availability
- **Performance** — Page load times
- **Errors** — Exception rates
- **User Sessions** — Active users
- **Database Health** — Query latency

### Health Checks

```typescript
// apps/report-web/src/pages/api/health.ts
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  
  // Basic health check
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
  });
}
```

---

## Rollback Procedures

### Web App Rollback (Vercel)

```bash
# View deployment history
vercel deployments

# Promote previous deployment to production
vercel promote <deployment-url>

# Or rollback via Vercel dashboard
# Deployments → Select version → Promote to Production
```

### Mobile App Rollback

**⚠️ Important:** Mobile app rollback is more complex.

Options:

1. **Remove broken version from app stores**
   - Go to App Store Connect (iOS) or Google Play Console
   - Unpublish the broken version
   - Users with older version remain unaffected

2. **Release patch version quickly**
   ```bash
   # Fix bug
   git checkout -b hotfix/scoring-bug
   # Make fix
   git commit -m "fix: correct wide delivery"
   
   # Increment patch version in app.json
   # 1.1.0 → 1.1.1
   
   # Create release
   git tag v1.1.1
   git push origin v1.1.1
   
   # Build and submit
   eas build --platform all
   eas submit --platform all
   ```

3. **Maintain multiple API versions**
   - Old app version continues using v1 API
   - New version uses v2 API
   - Support both versions in backend temporarily

---

## Performance Optimization

### Mobile App

```bash
# Reduce bundle size
eas build --platform ios -- --release-channel=production

# Analyze bundle
expo bundle-analyzer
```

### Web App

```bash
# Generate performance report
pnpm build --analyze

# Optimize images
# Use Next.js Image component
import Image from 'next/image';

export default function ScoringCard() {
  return (
    <Image
      src="/cricket-ball.png"
      width={200}
      height={200}
      alt="Cricket ball"
      priority={false}
    />
  );
}

# Enable compression
// next.config.js
module.exports = {
  compress: true,
  swcMinify: true,
};
```

### Database

```sql
-- Add indexes for common queries
CREATE INDEX idx_match_status ON matches(status);
CREATE INDEX idx_innings_match_id ON innings(match_id);
CREATE INDEX idx_delivery_innings_id ON deliveries(innings_id);

-- Monitor slow queries
EXPLAIN ANALYZE SELECT * FROM matches WHERE status = 'live';
```

---

## Security Checklist

### Before Production Deployment

- [ ] **Secrets Management**
  - [ ] No hardcoded API keys
  - [ ] Environment variables for all secrets
  - [ ] GitHub Secrets configured
  - [ ] Database passwords rotated

- [ ] **Authentication & Authorization**
  - [ ] JWT tokens configured
  - [ ] Rate limiting enabled
  - [ ] CORS properly configured
  - [ ] API authentication required

- [ ] **Data Protection**
  - [ ] HTTPS enabled (SSL certificate)
  - [ ] Database encrypted at rest
  - [ ] Sensitive data masked in logs
  - [ ] GDPR compliance checked

- [ ] **Code Security**
  - [ ] Dependency vulnerabilities scanned (`npm audit`)
  - [ ] No debug code in production
  - [ ] No console.log statements
  - [ ] Input validation implemented

- [ ] **Infrastructure**
  - [ ] Firewalls configured
  - [ ] DDoS protection enabled
  - [ ] Backup strategy in place
  - [ ] Monitoring & alerts configured

### Security Commands

```bash
# Scan dependencies
npm audit
pnpm audit

# Check for vulnerabilities
npm audit fix

# Update dependencies safely
pnpm update --latest
```

---

## Troubleshooting

### Build Fails with "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Clear Turbo cache
rm -rf .turbo

# Rebuild
pnpm build
```

### Web App Deployment Timeout

```bash
# Increase timeout
vercel deploy --prod --timeout 1200

# Or optimize build
# - Remove unused dependencies
# - Use dynamic imports for large modules
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <p>Loading...</p>,
});
```

### Mobile Build Fails on Expo

```bash
# Clear Expo cache
expo cache:clean --all

# Rebuild
eas build --platform all --clear-cache

# Check logs
eas build:view

# Debug locally
expo prebuild --clean
```

### Database Connection Error

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check credentials
echo $DATABASE_URL

# Verify IP allowlisting (cloud databases)
# Add your IP to allow list in cloud provider
```

### Performance Issues After Deploy

```bash
# Check performance
# 1. Sentry dashboard for error rates
# 2. Vercel Analytics for performance
# 3. Database slow query logs
# 4. Server CPU/memory usage

# Quick fixes
# - Enable caching
# - Optimize database queries
# - Reduce image sizes
# - Remove unnecessary packages
```

---

## Deployment Checklist

```markdown
Pre-Deployment
- [ ] All tests passing
- [ ] TypeScript strict mode clean
- [ ] No console.log or debug code
- [ ] Environment variables configured
- [ ] Secrets added to GitHub
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated
- [ ] Release notes prepared

Deployment
- [ ] Build successful locally
- [ ] CI/CD pipeline passing
- [ ] Staging deployment verified
- [ ] Performance acceptable
- [ ] Analytics tracking works
- [ ] Error tracking configured

Post-Deployment
- [ ] Monitor error rates
- [ ] Check user metrics
- [ ] Verify all features working
- [ ] Update status page
- [ ] Notify team and users
- [ ] Document any issues
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Build all | `pnpm build` |
| Deploy web (Vercel) | `vercel deploy --prod` |
| Build mobile | `eas build --platform all` |
| Submit iOS | `eas submit --platform ios --latest` |
| Submit Android | `eas submit --platform android --latest` |
| Check Expo status | `eas build:view` |
| View Sentry errors | Open Sentry dashboard |
| Monitor performance | Vercel Analytics or Datadog |
| Rollback web | `vercel promote <url>` |

---

**Deploy with confidence. Monitor closely. Ship fast.** 🚀
