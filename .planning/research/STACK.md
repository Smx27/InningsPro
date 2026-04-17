# Technology Stack

**Project:** InningsPro
**Researched:** 2025-05-22

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **React Native (Expo)** | Latest | Mobile-first capture | Cross-platform, fast iteration, high-quality UI for scoring. |
| **Next.js** | 14+ | Web-based reporting | Server-side rendering for SEO (future) and robust PDF generation on the backend. |
| **TypeScript** | 5+ | Type Safety | Ensuring data consistency across mobile, web, and shared packages. |

### Database & Persistence
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **react-native-nitro-sqlite** | Latest | Local Persistence | Extremely fast JSI-based SQLite for high-frequency ball-by-ball entry. |
| **PowerSync / CR-SQLite** | — | Sync Engine | Industry-standard patterns for offline-first sync with conflict resolution. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vercel / AWS** | — | Web Hosting | Seamless deployment for Next.js reporting application. |
| **GitHub Actions** | — | CI/CD | Automated testing of the strict rule engine logic. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@react-pdf/renderer** | Latest | PDF Generation | Used in the Next.js app to create professional match reports from JSON schemas. |
| **Zustand** | Latest | State Management | Lightweight state for ephemeral scoring UI. |
| **date-fns** | Latest | Date Handling | Consistent timestamping for the auditable event stream. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Mobile | React Native | Flutter | Project context already specified React Native; better ecosystem for shared JS/TS logic. |
| Database | SQLite | Realm | SQLite is more standard for "Event Sourcing" and has better SQL-based sync tools like PowerSync. |
| PDF Gen | @react-pdf/renderer | Puppeteer | Puppeteer is too heavy for serverless; @react-pdf is faster and runs on client/server. |

## Installation

```bash
# Mobile Workspace
cd apps/mobile
npx expo install react-native-nitro-sqlite zustand

# Web Workspace
cd apps/report-web
npm install @react-pdf/renderer

# Shared Logic
cd packages/match-engine
npm install date-fns
```

## Sources

- [PROJECT.md Context]
- [React Native SQLite Performance (Nitro-SQLite)](https://github.com/mrousavy/react-native-nitro-sqlite)
- [PowerSync Documentation](https://www.powersync.com/)
- [@react-pdf/renderer Docs](https://react-pdf.org/)
