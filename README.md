# MAIB Icon Library

An internal web tool for browsing, previewing, customising, copying, downloading and uploading UI icons for MAIB products. Built as an internship MVP with **React 19, TypeScript, Vite, Tailwind CSS v4 and React Router**.

The concept (a searchable icon library with style variants) takes inspiration from the Iconsax Figma Community file. The interface, visual system, icon artwork and code are original.

---

## 1. Project overview

**Purpose.** Designers and developers need one place to find an icon, check it at the right size and colour, and get production-ready SVG or JSX code. They also need a controlled way to add new icons.

**MVP scope (done)**

| Area | Features |
| --- | --- |
| Browse | Responsive grid, 143 built-in icons (52 drawings in up to 3 styles), hover effects, loading skeleton |
| Search | Name, tags and category; multi-word; debounced; `/` shortcut, `Esc` clears |
| Filter / sort | 8 categories, 4 styles, sort by name or date; all saved in the URL |
| Preview | Size 12–256 px, colour presets + custom picker + `currentColor`, light/dark/transparent background, other styles of the same icon |
| Export | Copy SVG, copy JSX, download `.svg`, quick copy/download from the grid |
| Upload | Drag-and-drop or browse, type/size/XML/content validation, SVG sanitising, "make colour customisable" option, name/category/style/tags with field errors, duplicate check, success state |
| Manage | Delete uploaded icons; uploads saved in `localStorage` |
| Quality | Responsive (mobile → desktop), keyboard accessible, toasts, empty/error/404 states |

**Out of scope for the MVP:** authentication, real backend, cloud storage, permissions, banking features.

---

## 2. Setup and commands

Requirements: **Node.js 20+** (tested with Node 26) and npm.

```bash
cd maib-icon-library
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
```

To test on a phone on the same Wi-Fi: `npm run dev -- --host`, then open the "Network" URL it prints.

---

## 3. Architecture and technology decisions

```
 Pages ──▶ Hooks ──▶ services/index.ts ──▶ IconService (interface)
   │                                          ├─ mockIconService  (today: MOCK_ICONS + localStorage)
   ▼                                          └─ httpIconService  (later: REST API)
 Components (presentational)      lib/ = pure helpers (svg, validation, format, browser)
```

| Decision | Why | Problem solved | Backend benefit |
| --- | --- | --- | --- |
| **`IconService` interface** (`services/iconService.ts`) | One contract for all data access | Components never touch `localStorage` or `fetch` | Swap mock ↔ HTTP in one file (`services/index.ts`) |
| **Async mock with artificial latency** | Mock behaves like a network call | Loading and error states are built and tested now | No UI changes when real latency and errors appear |
| **Typed errors (`IconServiceError`)** | `not-found`, `conflict`, `forbidden`, `invalid`, `network` | UI shows the same friendly messages for any source | HTTP status codes map straight onto these codes |
| **Filters stored in URL** (`useLibraryFilters`) | `?q=card&category=finance&style=bulk` | Back button, bookmarks and shared links keep filters | Query params can go straight to `GET /icons?...` |
| **Pure `lib/` functions** | Validation, sanitising and formatting have no React code | Easy to unit-test and reuse | Same rules can be mirrored on the server |
| **SVG sanitising** (`lib/svg.ts`) | Uploaded SVG is rendered inline | Blocks `<script>`, `on*` handlers, `javascript:` links, external URLs | Server should sanitise too; the client version stays as defence-in-depth |
| **`currentColor` icons** | Colour follows the CSS `color` property | One file serves every colour | Store one SVG per icon/style, not one per colour |
| **Tailwind v4 `@theme` tokens** (`index.css`) | All colours defined in one place | Brand palette can be aligned with official MAIB values in minutes | — |
| **App icons separate from library data** (`UiIcon`) | App chrome is not tied to the library data | UI keeps working if the library is empty or slow | — |

---

## 4. Folder structure

```
maib-icon-library/
├── index.html
├── vite.config.ts                  # React + Tailwind plugins
├── public/favicon.svg
└── src/
    ├── main.tsx                    # React entry
    ├── App.tsx                     # Router + ToastProvider
    ├── index.css                   # Tailwind import, design tokens, utilities
    ├── env.d.ts                    # VITE_ICON_API_URL typing
    ├── types/icon.ts               # Icon, NewIconInput, IconQuery …
    ├── config/iconMeta.ts          # categories, styles, sort options, upload limits
    ├── data/
    │   ├── iconGeometry.ts         # source drawings of built-in icons (mock only)
    │   └── mockIcons.ts            # generates Icon records for each style
    ├── services/
    │   ├── iconService.ts          # IconService interface + IconServiceError
    │   ├── mockIconService.ts      # MOCK_ICONS + localStorage implementation
    │   ├── httpIconService.ts      # REST implementation (ready, unused by default)
    │   └── index.ts                # picks the implementation
    ├── lib/
    │   ├── svg.ts                  # parse, sanitise, recolour, customise, JSX, prettify
    │   ├── validation.ts           # file + form validation
    │   ├── iconQuery.ts            # search/filter/sort (mock only)
    │   ├── format.ts               # kebab-case, dates, bytes, tags
    │   └── browser.ts              # clipboard (with fallback) + file download
    ├── hooks/
    │   ├── useIcons.ts             # list query with loading/error/stale protection
    │   ├── useIcon.ts              # single icon by id
    │   ├── useLibraryFilters.ts    # filters ⇄ URL search params
    │   ├── useIconActions.ts       # copy / download + toasts
    │   └── useDebouncedValue.ts
    ├── components/
    │   ├── layout/   AppLayout, Header
    │   ├── ui/       Button, buttonStyles, UiIcon, toast/*
    │   ├── icons/    SvgRenderer, IconCard, IconGrid
    │   ├── library/  SearchBar, CategoryFilter, StyleFilter, SortSelect, EmptyState
    │   ├── details/  PreviewStage, CustomizePanel, CodeViewer
    │   └── upload/   Dropzone, FormField, UploadForm
    └── pages/        LibraryPage, IconDetailsPage, UploadPage, NotFoundPage
```

---

## 5. Data model

```ts
type IconStyle    = 'linear' | 'twotone' | 'bulk' | 'custom'
type IconCategory = 'finance' | 'security' | 'communication' | 'interface'
                  | 'arrows' | 'files' | 'users' | 'devices'

interface Icon {
  id: string            // "wallet-bulk"
  name: string          // "wallet" (kebab-case)
  category: IconCategory
  style: IconStyle
  svg: string           // sanitised markup, uses currentColor
  tags: string[]
  createdAt: string     // ISO 8601
  source: 'library' | 'uploaded'
}
```

**How the mock data is built.** `iconGeometry.ts` draws each icon once on a 24×24 grid as a list of paths. Paths are marked `body` (the main closed shape) or `accent` (secondary detail). `mockIcons.ts` turns each drawing into flat `Icon` records:

- **Linear**: 1.5 px outline
- **Two-tone**: accent paths at 40% opacity
- **Bulk**: body shapes filled at 25% opacity under the outline

A style is only generated when it looks different from Linear. The result has the same shape as an API response.

**Using the coordinator's real artwork.** Export SVGs from Figma with colours set to `currentColor`, then add them as `Icon` records (or return them from the API). No component changes are needed.

---

## 6. One-week implementation plan (as built)

| Day | Stage | Output |
| --- | --- | --- |
| 1 | Setup + architecture | Vite/TS/Tailwind/Router, types, config, design tokens |
| 2 | Data layer | Icon geometry, mock generator, `IconService`, mock service, hooks |
| 3 | Library page | Layout, header, search, category/style filters, sort, grid, empty/loading states |
| 4 | Details page | Preview stage, size/colour/background controls, SVG/JSX code, copy/download |
| 5 | Upload | Dropzone, validation, sanitiser, form, success state, localStorage, delete |
| 6 | Responsive + a11y polish | Mobile chips, touch behaviour, focus styles, toasts, 404 |
| 7 | Testing + docs | Checklist below, README, demo preparation |

---

## 7. Key implementation notes

- **Inline SVG rendering (`SvgRenderer`).** Icons are injected as markup so `currentColor` works. `<img>` would be safer but cannot be recoloured. That is why every SVG is sanitised in the service layer before it reaches the UI, including SVG read back from `localStorage`, which a user could edit by hand.
- **Sanitiser (`sanitizeSvg`).** Parses with `DOMParser`, removes dangerous elements (`script`, `foreignObject`, `style`, animation elements …), strips `on*` attributes, non-local `href`s and external `url(...)`s, and adds a missing `viewBox` so the icon can scale.
- **Customised export (`customizeSvg`).** Sets `width`/`height` to the chosen size. For a fixed colour, replaces `currentColor` with the hex value. With the `currentColor` option, the copied code still follows the CSS text colour where it is pasted.
- **Stale-response protection (`useIcons`).** Each request is tagged with a key built from the query. Responses for old keys are ignored, so fast typing never shows results for an earlier search.
- **Search ⇄ URL sync (`LibraryPage`).** The input updates instantly. The URL (and so the service call) updates after 200 ms of no typing. A `lastSynced` ref stops a late debounce from overwriting what the user just typed.
- **Card accessibility (`IconCard`).** The whole card is a link, but a `<button>` cannot sit inside an `<a>`. The link is stretched over the card (`absolute inset-0`) and the quick-action buttons sit above it with `z-10`. On touch devices (`hover: none`) quick actions are hidden and a tap opens the details page.
- **Clipboard fallback (`copyText`).** The Clipboard API only works on `https` or `localhost`. When testing from a phone over the LAN, the code falls back to `document.execCommand('copy')`.

---

## 8. Testing checklist

**Search**
- [ ] Type `card` → shows credit-card (and any uploaded card icons); count updates
- [ ] Multi-word `arrow left` → only arrow-left variants
- [ ] Search by tag: `password` → lock, key
- [ ] Press `/` anywhere → search is focused; `Esc` clears; ✕ button clears
- [ ] URL shows `?q=…`; reload keeps the search

**Filtering and sorting**
- [ ] Each category shows only its icons (sidebar on desktop, chips on mobile/tablet)
- [ ] Style Linear/Two-tone/Bulk/Custom filters correctly; Custom is empty until you upload one
- [ ] Combine: Security + Two-tone + Newest → 6 icons, newest first
- [ ] Open an icon, press Back → filters and scroll position are kept
- [ ] "Clear filters" resets everything

**Empty states**
- [ ] Search `zzzz` → "No icons found" with Clear filters + Upload buttons
- [ ] `/icons/does-not-exist` → "Icon not found"; `/random-page` → "Page not found"

**Preview**
- [ ] Size presets, slider and number input all change the preview and the size label
- [ ] Colour presets, custom colour picker and `currentColor` change the preview
- [ ] Dark background + `currentColor` → icon shows white (stays visible)
- [ ] "Available styles" switches between Linear / Two-tone / Bulk
- [ ] Clicking a tag opens the library searching that tag

**Copy and download**
- [ ] Copy SVG → paste into a text editor: correct `width`/`height`/colour
- [ ] JSX tab → attributes are camelCase (`strokeWidth`); Copy JSX works
- [ ] Download SVG → file `wallet-bulk.svg` opens in the browser/Figma at the chosen size
- [ ] Grid hover → quick copy/download buttons work (keep `currentColor`, 24 px)

**Upload and validation**
- [ ] `.png` → "not an SVG file"
- [ ] File > 100 KB → size error
- [ ] Broken XML → "not valid SVG/XML"
- [ ] `<svg></svg>` with no shapes → "does not contain any visible shapes"
- [ ] Submit with missing category/tags → errors next to those fields, updating live as they are fixed
- [ ] File name `Card Contactless.svg` → name pre-filled as `card-contactless`
- [ ] SVG with `<script>`/`onload` → uploads, stored markup contains no script or handlers
- [ ] Same name + style twice → "already exists in this style"
- [ ] Success screen → View icon / Upload another; icon shows in the grid with a "New" badge
- [ ] Reload page → uploaded icon is still there; Delete removes it

**Responsiveness** (DevTools device toolbar: 375 px, 768 px, 1280 px)
- [ ] No horizontal page scroll; category chips scroll sideways on small screens
- [ ] Header collapses "Library" to an icon on mobile
- [ ] Details page stacks preview above info on mobile, side by side on desktop
- [ ] Upload form stacks on mobile

---

## 9. Future backend architecture

**What stays unchanged:** all `pages/`, `components/`, `hooks/`, `types/`, `config/`, `lib/svg.ts`, `lib/format.ts`, `lib/browser.ts`, `lib/validation.ts`.

**What changes:** only `services/`. `data/` and `lib/iconQuery.ts` become unused, because the server does the filtering.

**Switching to the REST service** is a configuration change. `httpIconService.ts` already exists:

```bash
# .env.local
VITE_ICON_API_URL=https://icons-api.internal.example/api
```

```ts
// services/index.ts (already in place)
export const iconService: IconService = apiUrl
  ? createHttpIconService(apiUrl)
  : createMockIconService()
```

Example method from `httpIconService.ts`:

```ts
getIcons: (query) => request<Icon[]>(`/icons${toSearchParams(query)}`),
uploadIcon: (input) => request<Icon>('/icons', { method: 'POST', body: JSON.stringify(input) }),
```

**Suggested backend**
- REST API (Node/NestJS, .NET or Java/Spring, whichever MAIB uses) with the endpoints listed at the top of `httpIconService.ts`
- Database table `icons` (id, name, category, style, svg or file_key, tags, created_at, created_by, status), unique on `(name, style)`
- File storage (S3-compatible or the internal equivalent) for raw uploads, if SVG is not stored inline
- Server-side sanitising (e.g. DOMPurify in Node or svg-sanitizer) and the same validation rules as `lib/validation.ts`
- Company SSO (Azure AD / OIDC). Add the token in `request()` headers; one place to change
- Pagination: add `page`/`limit` to `IconQuery` and return `{ items, total }` when the library grows past a few hundred icons

---

## 10. MVP checklist

**Complete (MVP)**
- [x] React + TypeScript + Vite + Tailwind + React Router
- [x] Typed data model and 143 mock icons across 8 categories and 3 styles
- [x] Service layer (`getIcons`, `getIconById`, `uploadIcon`, `updateIcon`, `deleteIcon`) with mock and HTTP implementations
- [x] Library: search, category and style filters, sorting, responsive grid, hover actions, empty/loading/error states
- [x] Details: large preview, size, colour, background, style variants, SVG/JSX code, copy, download
- [x] Upload: drag-and-drop, validation, sanitising, metadata form, duplicate check, success state, localStorage persistence
- [x] Delete uploaded icons
- [x] Responsive design, keyboard support, accessible labels
- [x] Type-check, lint and production build pass

**Optional / post-MVP**
- [ ] Edit metadata UI (the service's `updateIcon` already exists)
- [ ] Bulk download as ZIP, sprite-sheet export, PNG export
- [ ] Global grid colour/size controls
- [ ] Stroke-width adjustment for outline icons
- [ ] Favourites / recently used
- [ ] Review workflow (uploads go to "pending" until a designer approves them)
- [ ] Figma plugin or npm package (`@maib/icons`) generated from the library
- [ ] Dark mode for the whole app
- [ ] Unit tests (Vitest) for `lib/` and component tests (Testing Library)
- [ ] Real backend, SSO and roles (viewer / contributor / admin)
