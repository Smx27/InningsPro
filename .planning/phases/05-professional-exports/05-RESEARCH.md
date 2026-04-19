# Phase 05: Professional Exports - Research

**Researched:** 2026-04-20
**Domain:** Document & Graphic Generation (Next.js/React)
**Confidence:** HIGH

## Summary

Phase 05 focuses on enabling "Professional Exports" from the InningsPro Web Reporting Portal. The primary goal is to provide users with high-fidelity PDF match summaries and shareable "Match Highlight" graphics for social media.

The research confirms that `apps/report-web` already has basic infrastructure for `react-to-print` and data exports (JSON/Excel). To achieve "Professional" status, we will integrate client-side image capture for social media graphics and refine the PDF layout for formal reporting.

**Primary recommendation:** Use `html-to-image` for social media graphic generation (Match Highlights) and leverage existing `react-to-print` for PDFs, enhanced with specialized print-only CSS to ensure high-fidelity layouts across devices.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| PDF Generation | Browser / Client | — | Users export from uploaded match files; no server storage required. |
| Image Generation | Browser / Client | — | Client-side capture via `html-to-image` avoids server-side rendering costs and supports offline-first usage. |
| Stats Extraction | API / Shared Lib | Client | `match-engine` selectors handle raw data to stats transformation. |
| Graphic Layout | Client (React) | — | Tailwind CSS provides the "Premium" visual style (Glassmorphism, Bento Grid). |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `html-to-image` | 1.11.11 | DOM to Image | Lightweight, robust client-side capture for social sharing. [VERIFIED: npm registry] |
| `react-to-print` | 3.3.0 | PDF/Print Trigger | Industry standard for browser-based print-to-PDF. [VERIFIED: package.json] |
| `lucide-react` | 0.576.0 | Iconography | Consistent visual language with existing app. [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `framer-motion` | 12.36.0 | Micro-interactions | Polishing export dialogs and preview transitions. [VERIFIED: package.json] |
| `clsx` / `tailwind-merge` | Latest | Dynamic Styling | Managing complex "Premium" visual states in cards. [VERIFIED: package.json] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `html-to-image` | `@vercel/og` | Satori/Vercel OG requires server-side logic and limited CSS subset; `html-to-image` captures full Tailwind styles on client. |
| `react-to-print` | `@react-pdf/renderer` | `react-pdf` requires re-writing layouts in a non-HTML system; `react-to-print` uses existing Tailwind components. |

**Installation:**
```bash
npm install html-to-image
```

## Architecture Patterns

### Recommended Project Structure
```
apps/report-web/
├── components/
│   ├── export/             # New folder for export-specific UI
│   │   ├── HighlightCard.tsx  # The "Premium" visual graphic
│   │   ├── ExportDialog.tsx   # Selection UI for formats
│   │   └── PrintLayout.tsx    # PDF-optimized layout
│   └── report/
│       └── ExportButtons.tsx  # Entry point (update needed)
├── lib/
│   └── export/
│       ├── generateImage.ts   # html-to-image logic
│       └── exportPdf.ts       # Existing, refine with CSS
```

### Pattern 1: Bento Grid Highlights
**What:** Use a Bento Grid layout to organize match stats (Top Scorer, Best Bowler, Result) into separate, high-contrast compartments.
**When to use:** "Match Highlights" graphic for Instagram/Twitter.
**Example:**
```typescript
// Pattern inspired by 2024-2025 social media trends
<div className="grid grid-cols-2 gap-4 aspect-[4/5] bg-slate-950 p-6">
  <div className="col-span-2 text-primary font-hero">MATCH RESULT</div>
  <div className="glass-card p-4">TOP SCORER...</div>
  <div className="glass-card p-4">BEST BOWLER...</div>
</div>
```

### Anti-Patterns to Avoid
- **Server-side only generation:** Avoid Puppeteer/Playwright unless client-side capture fails; server-side is 10x more expensive/complex for simple match sharing.
- **Unoptimized Print CSS:** Don't just print the dashboard; users want a formal "A4" report look, not a screenshot.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Canvas Drawing | Custom `ctx.drawText` | `html-to-image` | Managing font loading and relative positioning in Canvas is extremely brittle. |
| PDF Metadata | Custom PDF headers | Browser Print | Browser Print handles system fonts and standard A4/Letter margins better than most low-level libraries. |

## Common Pitfalls

### Pitfall 1: Font Loading in Images
**What goes wrong:** Exported images show default fonts instead of the app's custom typography.
**Why it happens:** `html-to-image` needs fonts to be fully loaded and sometimes needs them explicitly inlined in SVG/Styles.
**How to avoid:** Use a `fontsReady` check before triggering capture.

### Pitfall 2: Page Breaks in PDF
**What goes wrong:** Tables or charts split awkwardly across pages.
**Why it happens:** Default browser printing doesn't know where logical boundaries are.
**How to avoid:** Use `break-inside: avoid` and `page-break-before: always` CSS utilities in the `PrintLayout`.

## Code Examples

### Image Capture with html-to-image
```typescript
import { toPng } from 'html-to-image';

export async function captureHighlight(ref: HTMLElement, fileName: string) {
  try {
    const dataUrl = await toPng(ref, {
      quality: 0.95,
      pixelRatio: 2, // High resolution for social media
    });
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Export failed', err);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Puppeteer (Server) | Satori / Client-side SVG | 2023-2024 | Lower latency, zero-server cost for social graphics. |
| jspdf / html2canvas | html-to-image | 2023 | Better SVG and CSS property support (Filter, Shadow). |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Browser Print is "Professional" enough for REPO-02 | Summary | Might need `@react-pdf/renderer` if user expects a custom-built file. |
| A2 | Match data stays on client | Architectural Map | If sync is required, client-side capture needs to handle remote assets. |

## Open Questions

1. **Brand Identity:** Should the Match Highlights card allow user customization (e.g., team colors)?
   - *Recommendation:* Yes, use team colors from the match data to dynamically set gradients.
2. **Legal/Compliance:** Are there watermarking requirements?
   - *Recommendation:* Include an "InningsPro" watermark on social graphics for brand awareness.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next.js | Web App | ✓ | 14.2 | — |
| Tailwind | Styling | ✓ | 3.4 | — |
| Node.js | Dev | ✓ | 25.8 | — |
| npx pnpm | Package Mgmt | ✓ | 9.15 | Use npm |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js Test Runner |
| Config file | Native |
| Quick run command | `npx pnpm test` |
| Full suite command | `npx pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REPO-02 | PDF Export triggering | Integration | `node --test apps/report-web/components/report/export.test.ts` | ❌ Wave 0 |
| REPO-03 | Highlight logic (stats) | Unit | `node --test apps/report-web/lib/export/highlights.test.ts` | ❌ Wave 0 |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Validate `.ipro` schema before processing exports to prevent XSS in DOM capture. |

### Known Threat Patterns for Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via Image Export | Tampering | Sanitize all player/team names before rendering into capture-able DOM. |

## Sources

### Primary (HIGH confidence)
- `apps/report-web/package.json` - Current stack and dependencies.
- `packages/match-engine/src/selectors.ts` - Available stats logic.

### Secondary (MEDIUM confidence)
- Google Search: "Next.js social media image generation 2025" - Satori vs Client-side.
- Google Search: "Cricket match graphic design trends 2025" - Bento Grid / Glassmorphism.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified in project and industry trends.
- Architecture: HIGH - Fits current App Router / Monorepo pattern.
- Pitfalls: MEDIUM - Depends on specific browser engine bugs (Safari/Mobile).

**Research date:** 2026-04-20
**Valid until:** 2026-10-20
