# Refactoring Plan — Orbit Storefront

> **Dokumen rencana refactoring** — Clean Architecture + FDD (Feature-Driven Development) + TDD (Test-Driven Development)
> Project: `tech-assessment-assignment-1` (Orbit device storefront)
> Referensi pola: `C:\SALT\PROJECT\nextjs-fdd-clean-architecture`
> Panduan teori: `nextjs-fdd-clean-architecture/docs/clean-architecture-nextjs-en.md`

---

## Daftar Isi

1. [Context & Goals](#1-context--goals)
2. [Hasil Analisis Codebase](#2-hasil-analisis-codebase)
3. [Arsitektur Target](#3-arsitektur-target)
4. [Keputusan Desain](#4-keputusan-desain)
5. [Behavior Parity Checklist](#5-behavior-parity-checklist)
6. [Step-by-Step Implementation](#6-step-by-step-implementation)
7. [Test Plan Lengkap](#7-test-plan-lengkap)
8. [Verification & Acceptance Criteria](#8-verification--acceptance-criteria)

---

## 1. Context & Goals

Orbit adalah toko device demo (6 smartphone/tablet) dengan dashboard, pencarian, filter, sorting, halaman detail, dan alur pembelian simulasi dengan dompet demo $1.050. UI-nya sudah polish, namun implementasinya sengaja dituangi sebagai bahan assessment.

**Goals:**

| # | Goal | Ukuran berhasil |
|---|---|---|
| G1 | Analisis codebase terdokumentasi | `docs/refactoring-analysis.md` berisi code smells + justifikasi |
| G2 | Refactor ke Clean Architecture | Dependency mengarah inward; domain bebas React/Next/fetch; nol `any` |
| G3 | Terapkan FDD | Kode terorganisir per fitur di `src/features/*` + docs test-case per fitur |
| G4 | Terapkan TDD | Setiap unit domain/use-case/slice/controller punya test yang ditulis **sebelum** implementasi (Red→Green→Refactor) |
| G5 | UI & behavior 100% identik | Checklist §5 terpenuhi semua; `globals.css` & className tidak berubah |

**Non-goals** (tidak dikerjakan): mengubah desain visual, menambah fitur baru, menambah backend nyata, i18n, E2E testing (Playwright), ESLint (opsional di akhir jika sempat).

---

## 2. Hasil Analisis Codebase

### 2.1 Code Smells

| # | Smell | Lokasi | Dampak |
|---|---|---|---|
| S1 | Mock API inline di komponen | `app/page.tsx:16-24` (`userApi`, `productsApi`), `app/product/[id]/page.tsx:20-32` | Data access tak bisa diganti/diuji terpisah |
| S2 | Katalog diduplikasi, shape beda | `app/page.tsx:18-23` (array of object, tanpa `stock`) vs `app/product/[id]/page.tsx:22-28` (array of arrays, +`stock: 12`) | Perubahan produk harus di 2 tempat, rawan drift |
| S3 | Satu reducer raksasa untyped | `app/provider.tsx:7-15` — 6 tanggung jawab dalam 1 fungsi | Tak ada type safety; seluruh state ter-select (`useSelector((state:any)=>state)` di `app/page.tsx:9`) |
| S4 | `buy()` campur aduk | `app/product/[id]/page.tsx:44-58` — validasi stok + cek saldo + buat order + set presentation state | Aturan bisnis tak teruji, tak reusable |
| S5 | Komponen monolitik | Kedua page = satu ekspresi JSX blok tunggal (±40 baris per return) | Tak bisa direuse (header, footer, device art diduplikasi) |
| S6 | Presentation bocor ke state | `priceLabel: '$'+x.toLocaleString()` di-dispatch ke Redux (`app/page.tsx:25`) | Store menyimpan format view |
| S7 | Dead state | `selected` di-dispatch (`SELECTED`) tapi tak pernah dibaca | Kompleksitas tanpa guna |
| S8 | Nol test, nol types | Semua `useState<any>`, `p: any`, `s: any` | Regresi tak terdeteksi |

### 2.2 Dampak Perbaikan

| Smell | Perbaikan | Layer tujuan |
|---|---|---|
| S1 | `DeviceRepository` / `UserRepository` + implementasi InMemory & Api | infrastructure |
| S2 | `mock-data.ts` single source of truth (+`stock`) | infrastructure |
| S3 | 3 slice typed + typed hooks | composition/store |
| S4 | `purchaseDevice` use case murni | use-cases |
| S5 | Dekomposisi komponen (header, footer, card, toolbar, dialog, dll.) | presentation |
| S6 | `formatUsdPrice()` dipanggil di view | shared/lib |
| S7 | Dihapus | — |
| S8 | Vitest + strict types | semua layer |

---

## 3. Arsitektur Target

### 3.1 Folder Structure

```
src/
├── app/                                    # [Presentation-entry] Route Next.js — TIPIS saja
│   ├── layout.tsx                          #   metadata + <ReduxProvider>
│   ├── page.tsx                            #   → <DiscoverPage /> (client)
│   ├── product/[id]/page.tsx               #   → unwrap params → <ProductDetailPage id={id} />
│   ├── globals.css                         #   TIDAK DIUBAH SAMA SEKALI
│   └── api/
│       ├── products/route.ts               #   GET → JSON katalog (untuk ApiDeviceRepository)
│       └── products/[id]/route.ts          #   GET → 1 device | 404
│
├── features/
│   ├── product-catalog/                    # ══ FITUR 1 (FDD) ══
│   │   ├── domain/
│   │   │   ├── device.ts                   #   type Device, kategori, filter/sort/search rules
│   │   │   └── device.test.ts
│   │   ├── use-cases/
│   │   │   ├── device-repository.ts        #   interface DeviceRepository (kontrak)
│   │   │   ├── get-devices.ts
│   │   │   ├── get-device-by-id.ts         #   + class DeviceNotFoundError
│   │   │   └── *.test.ts
│   │   ├── infrastructure/
│   │   │   ├── mock-data.ts                #   6 device — SATU sumber data (S2 selesai)
│   │   │   ├── in-memory-device-repository.ts   # delay 750ms/600ms (S1)
│   │   │   └── api-device-repository.ts    #   fetch /api/products
│   │   ├── controllers/
│   │   │   ├── device-controller.ts        #   wiring registry → use case
│   │   │   └── device-controller.test.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── discover-page.tsx       #   client — pengganti app/page.tsx lama
│   │       │   └── product-detail-page.tsx #   client — pengganti detail lama
│   │       └── components/
│   │           ├── site-header.tsx         #   (duplikasi antar page dihilangkan)
│   │           ├── site-footer.tsx         #   2 varian via props
│   │           ├── welcome-panel.tsx       #   seksi sambutan + membership + wallet
│   │           ├── device-art.tsx          #   ilustrasi CSS device (back/front/cameras)
│   │           ├── device-card.tsx         #   kartu produk (Link → /product/:id)
│   │           ├── filter-toolbar.tsx      #   tabs kategori + search + sort
│   │           ├── benefits-section.tsx
│   │           ├── loading-indicator.tsx
│   │           └── __tests__/
│   │               ├── device-card.test.tsx
│   │               └── filter-toolbar.test.tsx
│   │
│   ├── user-profile/                       # ══ FITUR 2 (FDD) ══
│   │   ├── domain/user.ts (+test)          #   User + displayName()
│   │   ├── use-cases/ user-repository.ts, get-user.ts (+test)
│   │   ├── infrastructure/ mock-user.ts, in-memory-user-repository.ts (450ms)
│   │   ├── controllers/ user-controller.ts (+test)
│   │   └── presentation/components/welcome-panel.tsx   # (dipakai DiscoverPage)
│   │
│   └── purchase/                           # ══ FITUR 3 (FDD) ══
│       ├── domain/purchase.ts (+test)      #   PurchaseInput, PurchaseResult, OutOfStockError
│       ├── use-cases/purchase-device.ts (+test)
│       ├── controllers/purchase-controller.ts (+test)
│       └── presentation/components/
│           ├── buy-button.tsx              #   busy/pending state
│           ├── specs-grid.tsx
│           └── purchase-dialog.tsx (+__tests__)   # modal sukses/insufficient + focus trap
│
├── composition/                            # ══ COMPOSITION ROOT ══
│   ├── registry.ts                         #   createDeviceRepository() → InMemory, dll. (DI)
│   └── store/
│       ├── index.ts                        #   configureStore + RootState + AppDispatch
│       ├── provider.tsx                    #   'use client' ReduxProvider
│       ├── hooks.ts                        #   useAppSelector / useAppDispatch (typed)
│       ├── slices/
│       │   ├── user-slice.ts               #   { user, walletBalance }
│       │   ├── device-catalog-slice.ts     #   { devices, loading, error } — data katalog
│       │   ├── device-filter-slice.ts      #   { search, category, sortBy } + selectFilteredDevices
│       │   └── orders-slice.ts             #   orders[]
│       └── __tests__/ *-slice.test.ts
│
├── shared/
│   ├── lib/formatters.ts (+test)           #   formatUsdPrice()
│   └── presentation/components/            #   atoms umum bila muncul kebutuhan
│
└── docs/                                   # artefak assessment (di root repo, di luar src/)
    ├── Refactoring Plan.md                 #   dokumen plan ini
    ├── refactoring-analysis.md             #   isi §2 dokumen ini
    └── test-cases/
        ├── product-catalog.md
        ├── user-profile.md
        └── purchase.md
```

> `docs/` bisa di root repo (bukan di dalam `src/`) — mengikuti konvensi referensi yang menaruh `docs/` di root.

### 3.2 Aturan Dependency (dipakai sebagai review checklist)

```
presentation → controllers → use-cases → domain
infrastructure → use-cases (implement interface)
composition → semua (tempat satu-satunya wiring konkret)
```

- `domain/` **dilarang** mengimpor React, Next.js, Redux, `fetch`.
- `use-cases/` menerima repository sebagai **parameter fungsi** (bukan import konkret).
- `infrastructure/` adalah satu-satunya tempat boleh ada `setTimeout` (simulasi) & `fetch`.
- `composition/registry.ts` satu-satunya tempat memilih implementasi konkret.

---

## 4. Keputusan Desain

| # | Keputusan | Alasan |
|---|---|---|
| D1 | UI/behavior 100% identik — markup & className di-copy persis, `globals.css` tak disentuh | Refactor struktural murni (pilihan user) |
| D2 | Data source ganda: `InMemoryDeviceRepository` (di-wire registry) + `ApiDeviceRepository` + Route Handlers | Persis pola referensi; menunjukkan nilai abstraction |
| D3 | Testing: unit (domain, use-case, slice) + component + controller | Pilihan user (paling lengkap) |
| D4 | Halaman tetap client component (useEffect + loading simulasi) — bukan Server Component/Suspense | UX loading 450/750/600/1100ms harus identik |
| D5 | `purchaseController` = fungsi async biasa (tanpa `'use server'`) dipanggil dari onClick | Button bukan form; UX busy-spinner harus sama |
| D6 | Sort pindah dari `useState` lokal → `device-filter-slice` | Konsisten dengan pola referensi; typed |
| D7 | State `selected` dihapus (dead), `orders` dipertahankan (parity) | Analisis S7 |
| D8 | Domain memakai istilah **Device** (bukan Product) mengikuti bahasa UI ("6 devices") | Ubiquitous language FDD |
| D9 | `priceLabel` dihapus dari state; view memanggil `formatUsdPrice()` | S6 — format adalah urusan presentation |

---

## 5. Behavior Parity Checklist

> Dicek ulang saat verification. Semua string **persis karakter** (termasuk apostrof typografik `’` dan ellipsis `…`).

### 5.1 Data & Timing

| ☐ | Behavior lama | Implementasi baru |
|---|---|---|
| ☐ | User API delay **450ms** → `{id:1, first_name:'Dilan', last_name:'Morgan', email:'dilan.1995@email.com', membership:'Orbit Plus', wallet_balance:1050}` | `InMemoryUserRepository.getUser()` + mapper snake_case→camelCase di infra |
| ☐ | Products API delay **750ms** → 6 device, field lengkap (`tone`, `tag`, `storage`, `screen`, `chip`, `camera`, `battery`, `os`) | `mock-data.ts` + `InMemoryDeviceRepository.getDevices()` |
| ☐ | Detail API delay **600ms** → device + **`stock: 12`**; ID tak dikenal → reject `We couldn’t find that device.` | `getDeviceById()` throw `DeviceNotFoundError` (pesan sama, `’` U+2019) |
| ☐ | Buy delay **1100ms**; `stock < 1` → throw `This device is out of stock.`; `price > balance` → **resolve** `{status:'insufficient_balance'}` (BUKAN throw); sukses → `{order_id:'ORB-'+Date.now().toString().slice(-8), ...}` | `purchaseDevice()` — union result; pesan & format ORB-XXXXXXXX sama |

### 5.2 Dashboard

| ☐ | Behavior lama |
|---|---|
| ☐ | Loading: `Getting your next favorites ready…` (dengan `…`) |
| ☐ | Error (catch Promise.all): `Something went wrong. Please refresh to try again.` dengan `role="alert"` |
| ☐ | Fallback user saat loading: nama `Alex`, email `Getting your profile ready…`, membership `Orbit Plus` |
| ☐ | Saldo tampil `$1,050 USD` via `toLocaleString('en-US')` |
| ☐ | Filter kategori `All devices / Smartphones / Tablets` (ikon LayoutGrid/Smartphone/Tablet), class `active` |
| ☐ | Search: `(name + brand).toLowerCase().includes(query.toLowerCase())` |
| ☐ | Sort: `featured` (urutan asli) / `low` / `high` |
| ☐ | Result count `N devices, endless possibilities`; kosong → `No devices found. Try another search.` |
| ☐ | Avatar `AM` hardcoded (by design — dipertahankan) |
| ☐ | Semua className & struktur DOM identik |

### 5.3 Detail & Purchase

| ☐ | Behavior lama |
|---|---|
| ☐ | Direct URL `/product/3` bekerja (client fetch by id) |
| ☐ | Loading: `A closer look is on its way…` |
| ☐ | Unknown id: `Device not found.` + pesan error + tombol `Back to dashboard` |
| ☐ | Button `Make it yours $X`; saat busy: spinner + `Making it yours…`, `disabled` |
| ☐ | Double-click saat busy/done tidak memicu POST ganda (`if (busy \|\| done) return`) |
| ☐ | Dialog sukses: `It’s officially in orbit.`, order ref `ORB-XXXXXXXX` |
| ☐ | Dialog insufficient: `Insufficient balance`, tampil saldo & `$(price-balance)` kekurangan |
| ☐ | Focus trap: Tab selalu kembali ke CTA `#success-cta`; fokus kembali ke elemen sebelumnya saat dialog tutup |
| ☐ | Saldo **tidak** berkurang setelah beli; state reset saat reload |
| ☐ | Redux `orders` tetap menerima order sukses (parity — walau tak dibaca UI) |

---

## 6. Step-by-Step Implementation

> Setiap fitur dikerjakan **satu per satu** (FDD), dan setiap unit mengikuti siklus **TDD**:
> 1. **RED** — tulis test yang gagal (fungsi/modul belum ada / behaviour belum benar)
> 2. **GREEN** — implementasi minimal agar test lulus
> 3. **REFACTOR** — bersihkan tanpa mengubah behavior (test harus tetap hijau)

### FASE 0 — Setup Infrastruktur

**0.1 Install dependencies**
```sh
npm install                                    # node_modules belum terpasang
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/dom @testing-library/user-event
```

**0.2 BACA DOCS NEXT 16 (WAJIB — peringatan AGENTS.md)**
- Buka `node_modules/next/dist/docs/` → baca guide App Router: konvensi `params` (Promise), Route Handlers (`route.ts`), `'use client'`, `next/link`, layout.
- Catat perbedaan vs Next 15 (mis. `params`/`searchParams` kini `Promise`, dipecahkan via `await` di Server Component atau `use()` di Client Component — kode lama sudah pakai `use(params)`).
- Sebelum menulis file di `src/app/**`, cek docs terkait file tersebut.

**0.3 Vitest config** — buat `vitest.config.ts` + `vitest.setup.ts` (pola dari referensi):
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'],
           exclude: ['**/node_modules/**', '**/.next/**'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

**0.4 package.json scripts** — tambah: `"test": "vitest run"`, `"test:watch": "vitest"`.

**0.5 Pindahkan app → src/app & alias path**
- `git mv app src/app` (buat `src/` dulu), `tsconfig.json` → tambah `"paths": {"@/*": ["./src/*"]}` di compilerOptions.
- Update import `./globals.css` dst. agar build tetap hijau.
- **Gate:** `npm run typecheck && npm run build` hijau sebelum lanjut.

**0.6 Tulis docs**
- `docs/refactoring-analysis.md` — salin isi §2 + keputusan §4.
- Simpan dokumen plan ini sebagai `docs/Refactoring Plan.md` di repo.

---

### FASE 1 — shared/lib (TDD warm-up)

**1.1 RED** — `src/shared/lib/formatters.test.ts`:
| TC | Input | Expected |
|---|---|---|
| TC-01 | `formatUsdPrice(999)` | `'$999'` |
| TC-02 | `formatUsdPrice(1050)` | `'$1,050'` |
| TC-03 | `formatUsdPrice(1299)` | `'$1,299'` |

**1.2 GREEN** — `src/shared/lib/formatters.ts`: `export function formatUsdPrice(value: number): string { return '$' + value.toLocaleString('en-US') }`
**1.3 REFACTOR** — pastikan tidak ada duplikasi logika harga di mana pun lagi (grep `toLocaleString` — selanjutnya hanya boleh di formatters + detail page yang menampilkan `$X` via komponen).

---

### FASE 2 — FITUR product-catalog (FDD + TDD)

**2.1 Dokumen test-case** — `docs/test-cases/product-catalog.md` (format tabel seperti referensi, urutan TC = urutan siklus TDD):

*Domain `filterByCategory` / `searchDevices` / `sortDevices`:*
| TC | Skenario | Expected |
|---|---|---|
| PC-01 | category `'Smartphones'` pada 6 device mock | 4 device, semua `type==='Smartphones'` |
| PC-02 | category `'All devices'` | 6 device (tanpa filter) |
| PC-03 | search `'ipHone'` (case-insensitive, cocok di name ATAU brand) | 2 (iPhone 16 Pro, iPhone 16) |
| PC-04 | search `'sams'` (cocok brand) | 2 |
| PC-05 | search `'zzz'` | `[]` |
| PC-06 | sort `'low'` | urutan harga naik (599…1299) |
| PC-07 | sort `'high'` | urutan harga turun |
| PC-08 | sort `'featured'` | urutan asli array (id 1..6) — fungsi mengembalikan salinan, tak memutasi input |

*Use case `getDevices` / `getDeviceById`:*
| TC | Skenario | Expected |
|---|---|---|
| PC-09 | `getDevices(repo)` mock 2 device | return 2 device dari repo |
| PC-10 | `getDeviceById(repo,'3')` | return iPad Air **dengan `stock: 12`** |
| PC-11 | `getDeviceById(repo,'99')` | throw `DeviceNotFoundError` berpesan `We couldn’t find that device.` |

**2.2 RED→GREEN domain** — `src/features/product-catalog/domain/device.test.ts` dulu, lalu `device.ts`:
```ts
export const DEVICE_TYPES = ['Smartphones', 'Tablets'] as const
export const CATEGORY_FILTERS = ['All devices', ...DEVICE_TYPES] as const
export type DeviceType = (typeof DEVICE_TYPES)[number]
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number]
export type SortOption = 'featured' | 'low' | 'high'
export type Device = { id: string; name: string; brand: string; type: DeviceType;
  price: number; color: string; tone: string; tag: string; storage: string;
  screen: string; chip: string; camera: string; battery: string; os: string; stock: number }
export function filterByCategory(devices: Device[], category: CategoryFilter): Device[]
export function searchDevices(devices: Device[], query: string): Device[]   // (name+brand).toLowerCase().includes
export function sortDevices(devices: Device[], sortBy: SortOption): Device[] // featured → [...list]
```
> Catatan: `tone`, `tag`, `color` adalah atribut display katalog — tetap di entity karena merupakan data produk (bukan format view).

**2.3 RED→GREEN use-cases** — test dulu (mock class `implements DeviceRepository`), lalu:
```ts
// use-cases/device-repository.ts
export interface DeviceRepository {
  getDevices(): Promise<Device[]>
  getDeviceById(id: string): Promise<Device | null>
}
// use-cases/get-device-by-id.ts
export class DeviceNotFoundError extends Error {
  constructor(id: string) { super(`We couldn’t find that device.`); this.name = 'DeviceNotFoundError' }
}
```

**2.4 Infrastructure**
- `mock-data.ts` — `export const MOCK_DEVICES: Device[]` = gabungan kedua sumber lama **+ stock: 12 untuk semua** (satu sumber kebenaran; S2 selesai).
- `in-memory-device-repository.ts` — delay `750ms` (getDevices) / `600ms` (getDeviceById), return salinan (`[...items]` / `{...item}`), `null` jika tak ada.
- `api-device-repository.ts` — `fetch('/api/products')` & `fetch('/api/products/'+id)`; unknown → `null`.
- Route Handlers: `src/app/api/products/route.ts` (GET → `NextResponse.json(MOCK_DEVICES)`), `src/app/api/products/[id]/route.ts` (GET → device atau **status 404**). *Cek docs Next 16 untuk API `NextResponse`/`params` di route handler sebelum menulis.*

**2.5 RED→GREEN controller** — `controllers/device-controller.test.ts` (assert via `createDeviceRepository()` → InMemory → data mock), lalu `device-controller.ts`:
```ts
export async function getDevicesController(): Promise<Device[]>
export async function getDeviceByIdController(id: string): Promise<Device>
```

**2.6 Presentation components** — dekomposisi `app/page.tsx` lama. **Aturan: markup & className di-copy persis**, hanya dipecah + dihubungkan via props/Redux typed hooks. Urutan pembuatan: `SiteHeader` → `SiteFooter` (props `variant`) → `LoadingIndicator` → `DeviceArt` (props: `tone, brand, isTablet, badge?, caption`) → `DeviceCard` → `FilterToolbar` → `WelcomePanel` → `BenefitsSection` → `CollectionHeading` (opsional digabung ke page).

---

### FASE 3 — FITUR user-profile (FDD + TDD)

**3.1** `docs/test-cases/user-profile.md`:
| TC | Skenario | Expected |
|---|---|---|
| UP-01 | `displayName(user)` | `'Dilan Morgan'` (first + ' ' + last) |
| UP-02 | `getUser(repo)` mock | return `User` camelCase lengkap `walletBalance: 1050` |
| UP-03 | `getUserController()` via registry | data mock yang sama |

**3.2 RED→GREEN** domain (`user.ts`: `type User`, `displayName()`) → use-case (`user-repository.ts` interface, `get-user.ts`) → infrastructure (`mock-user.ts` snake_case source + mapper ke `User`; `in-memory-user-repository.ts` delay 450ms) → controller.
**3.3 REFACTOR** — `WelcomePanel` (Fase 2.6) sudah dikonsumsi di sini; pastikan prop `user: User | null` + fallback `Alex` / `Getting your profile ready…` identik.

---

### FASE 4 — FITUR purchase (FDD + TDD)

**4.1** `docs/test-cases/purchase.md`:
| TC | Skenario | Expected |
|---|---|---|
| PU-01 | Device $799, saldo $1050 | `status:'success'`, `orderId` match `/^ORB-\d{8}$/`, `total:799` |
| PU-02 | Device $1299 > saldo $1050 | `status:'insufficient_balance'` (BUKAN throw) |
| PU-03 | `stock: 0` | throw `OutOfStockError` `'This device is out of stock.'` |
| PU-04 | deviceId `'99'` | throw `DeviceNotFoundError` |
| PU-05 | PU-02 tidak menambah order apa pun di result | result tak berisi orderId |

**4.2 RED→GREEN domain** — `domain/purchase.ts`:
```ts
export type PurchaseInput = { deviceId: string; balance: number }
export type PurchaseSuccess = { status: 'success'; orderId: string; deviceId: string; total: number }
export type PurchaseResult = PurchaseSuccess | { status: 'insufficient_balance' }
export class OutOfStockError extends Error { constructor() { super('This device is out of stock.'); this.name='OutOfStockError' } }
```
**4.3 RED→GREEN use-case** — `purchase-device.ts`: `purchaseDevice(repo: DeviceRepository, input: PurchaseInput): Promise<PurchaseResult>` — urutan: cari device (`DeviceNotFoundError`) → cek stok (throw `OutOfStockError`) → cek saldo (return insufficient) → sukses (`orderId: 'ORB-' + Date.now().toString().slice(-8)`). Delays (1100ms) **tidak** di use case — di repository/controller infrastructure simulation.
> Catatan: delay 1100ms milik "buy API" → taruh di controller (`await delay(1100)` sebelum/serentak dengan use case) agar UX identik dan use case tetap instan untuk test.

**4.4 RED→GREEN controller** — `purchase-controller.ts`: `purchaseDeviceController(input): Promise<PurchaseResult>` = delay 1100ms + `purchaseDevice(createDeviceRepository(), input)`.

**4.5 Presentation** — `PurchaseDialog` (modal markup persis + `useEffect` focus trap + restore), `BuyButton` (busy/done/disabled logic persis `buy()` lama), `SpecsGrid`. Setelah sukses, page mendispatch `addOrder` ke `orders-slice` (parity dengan `ORDER` lama).

---

### FASE 5 — Composition Root (TDD per slice)

**5.1 RED→GREEN slices** (pola test seperti `use-cart-store.test.ts` referensi — pakai `configureStore` nyata):
- `user-slice.ts`: state `{ user: User | null; walletBalance: number }`, initial `walletBalance: 1050`; action `setUser`; selectors `selectUser`, `selectWalletBalance`.
- `device-catalog-slice.ts`: `{ devices: Device[], loading: boolean, error: string }`; actions `setDevices`, `setCatalogLoading`, `setCatalogError`; selector `selectDevices`.
- `device-filter-slice.ts`: `{ search: '', category: 'All devices', sortBy: 'featured' }`; actions `setSearch`, `setCategory`, `setSortBy`; selectors masing-masing + `selectFilteredDevices` (memoized `createSelector` — komposisi `filterByCategory` + `searchDevices` + `sortDevices` dari domain, atas `selectDevices`).
- `orders-slice.ts`: `orders: PurchaseSuccess[]`; action `addOrder`; selector `selectOrders`.

**5.2** `store/index.ts` (reducer map + `RootState`/`AppDispatch`), `hooks.ts` (`useSelector.withTypes`), `provider.tsx` (`'use client'`), `registry.ts`:
```ts
export function createDeviceRepository(): DeviceRepository { return new InMemoryDeviceRepository() }
export function createUserRepository(): UserRepository { return new InMemoryUserRepository() }
```
**5.3** Hapus `src/app/provider.tsx` lama; update `layout.tsx` import `ReduxProvider` dari `@/composition/store/provider`.

---

### FASE 6 — Wiring Pages + Component Tests

**6.1 `DiscoverPage`** (`features/product-catalog/presentation/pages/discover-page.tsx`, `'use client'`):
- `useEffect` + `Promise.all([getUserController(), getDevicesController()])` + `alive` flag cleanup (pola lama dipertahankan), dispatch `setUser` + `setDevices`.
- State katalog di Redux dipecah dua slice (data ≠ UI state, sesuai pemisahan referensi):
  - `device-catalog-slice.ts` (BARU, ditambahkan di Fase 5): `{ devices: Device[], loading: boolean, error: string }`, actions `setDevices`/`setCatalogLoading`/`setCatalogError`, selector `selectDevices`.
  - `device-filter-slice.ts`: murni UI state `{ search, category, sortBy }` + selector memoized `selectFilteredDevices` (komposisi `filterByCategory` + `searchDevices` + `sortDevices` domain atas `selectDevices`).
- Render: `SiteHeader` + `WelcomePanel` + heading + `FilterToolbar` + grid `DeviceCard` (via `selectFilteredDevices`) + `BenefitsSection` + `SiteFooter`. Error/loading persis checklist §5.2.

**6.2 `ProductDetailPage`** (`'use client'`, menerima `id: string`):
- `useEffect` fetch `getDeviceByIdController(id)`; state `device/busy/done/err/loading` (pola lama); `BuyButton` → `purchaseDeviceController` → `PurchaseDialog`; dispatch `addOrder` saat sukses.
- `src/app/product/[id]/page.tsx` = Server Component tipis: unwrap `params` (sesuai docs Next 16 — `await params` / `use(params)`) → render `<ProductDetailPage id={id} />`.

**6.3 `src/app/page.tsx`** = `<DiscoverPage />` saja (metadata tetap di layout).

**6.4 Component tests (RED dulu bila memungkinkan):**
- `device-card.test.tsx`: render nama/brand/harga `$999`/badge `POPULAR`; link `href='/product/1'`; tag kosong → tak ada badge.
- `filter-toolbar.test.tsx`: ketik di search → dispatch `setSearch` (cek via store nyata/provider pembungkus); klik tab → category berubah; select sort → `setSortBy`.
- `purchase-dialog.test.tsx`: result success → teks `It’s officially in orbit.` + `ORB-`; insufficient → `Insufficient balance` + `$249` (1299-1050); CTA ter-focus saat mount (`toHaveFocus`).

**6.5 Cleanup akhir**: hapus kode lama yang tersisa; grep sanity:
```
grep -r "state: any" src/        → 0 hasil
grep -r "any" src/features/*/use-cases src/features/*/domain → 0 hasil
grep -c "iPhone 16 Pro" src/     → hanya 1 file (mock-data.ts)
```

---

## 7. Test Plan Lengkap

| Suite | File | Jenis | TC |
|---|---|---|---|
| Formatters | `shared/lib/formatters.test.ts` | unit | TC-01..03 |
| Device domain | `features/product-catalog/domain/device.test.ts` | unit | PC-01..08 |
| Catalog use-cases | `features/product-catalog/use-cases/*.test.ts` | unit | PC-09..11 |
| Catalog controller | `features/product-catalog/controllers/device-controller.test.ts` | unit+DI | PC-09..11 via registry |
| User domain+use-case+controller | `features/user-profile/**/+test` | unit | UP-01..03 |
| Purchase use-case | `features/purchase/use-cases/purchase-device.test.ts` | unit | PU-01..05 |
| Purchase controller | `features/purchase/controllers/purchase-controller.test.ts` | unit (fake timers utk 1100ms) | PU-01..02 |
| Slices | `composition/store/__tests__/*.test.ts` | unit | per action+selector, termasuk `selectFilteredDevices` kombinasi search+category+sort |
| DeviceCard / FilterToolbar / PurchaseDialog | `**/__tests__/*.test.tsx` | component | §6.4 |

**Total ± 40+ test cases.** Konvensi: `describe('Domain: …')`, `it('should …')`, mock repo = class `implements` interface (bukan jest.fn) — mengikuti referensi.

---

## 8. Verification & Acceptance Criteria

### 8.1 Otomatis
```sh
npm run typecheck   # hijau, nol any baru
npm test            # semua suite hijau
npm run build       # sukses
```

### 8.2 Manual parity (jalankan `npm run dev`)
| ☐ | Skenario | Expected |
|---|---|---|
| ☐ | Buka `/` | Loading teks → dashboard 6 device, welcome Dilan Morgan, saldo $1,050 |
| ☐ | Tab Smartphones | 4 device; tab Tablet → 2 |
| ☐ | Ketik `pixel` | 1 device; ketik `zzz` → `No devices found. Try another search.` |
| ☐ | Sort low→high | iPad Air $599 pertama |
| ☐ | Klik card → detail | Loading `A closer look…` → spesifikasi lengkap |
| ☐ | Direct URL `/product/3` | iPad Air langsung |
| ☐ | `/product/99` | `Device not found.` + tombol kembali |
| ☐ | Beli iPhone 16 ($799) | Spinner `Making it yours…` ±1.1s → dialog sukses `ORB-XXXXXXXX`, fokus di CTA, Tab ter-trap |
| ☐ | Beli Galaxy S25 Ultra ($1299) | Dialog `Insufficient balance`, tampil `$1,050` & `$249` |
| ☐ | Klik cepat 2× | Tak ada POST ganda (disabled saat busy) |
| ☐ | Kembali ke dashboard | Saldo masih $1,050 |
| ☐ | Reload penuh | State Redux reset |

### 8.3 Review arsitektur (checklist dependency §3.2)
- ☐ Domain/use-cases bebas import React/Next/Redux/fetch (verifikasi: cek imports + `npm run build` lint)
- ☐ Registry satu-satunya tempat `new InMemory*Repository()`
- ☐ Tidak ada logika bisnis di komponen (komponen hanya render + dispatch + panggil controller)

### Urutan eksekusi & git
- Kerjakan Fase 0→6 berurutan; **setiap fase diakhiri** `npm test && npm run typecheck` hijau.
- Commit per fase (opsional, menunggu konfirmasi user): `refactor(fase-N): …` — AGENTS.md dibiarkan ter-commit sesuai instruksinya.
