# Refactoring Analysis — Orbit Storefront

Dokumentasi analisis codebase awal (code smells, dampak, dan keputusan perbaikan) sesuai bagian 2 & 4 pada dokumen *Refactoring Plan*.

---

## 1. Code Smells yang Diidentifikasi

| # | Smell | Lokasi | Dampak |
|---|---|---|---|
| S1 | Mock API inline di komponen | `app/page.tsx:16-24` (`userApi`, `productsApi`), `app/product/[id]/page.tsx:20-32` | Data access tak bisa diganti/diuji terpisah |
| S2 | Katalog diduplikasi, shape beda | `app/page.tsx:18-23` (array of object, tanpa `stock`) vs `app/product/[id]/page.tsx:22-28` (array of arrays, +`stock: 12`) | Perubahan produk harus di 2 tempat, rawan drift |
| S3 | Satu reducer raksasa untyped | `app/provider.tsx:7-15` — 6 tanggung jawab dalam 1 fungsi | Tak ada type safety; seluruh state ter-select (`useSelector((state:any)=>state)`) |
| S4 | `buy()` campur aduk | `app/product/[id]/page.tsx:44-58` — validasi stok + cek saldo + buat order + set presentation state | Aturan bisnis tak teruji, tak reusable |
| S5 | Komponen monolitik | Kedua page = satu ekspresi JSX blok tunggal (±40 baris per return) | Tak bisa direuse (header, footer, device art diduplikasi) |
| S6 | Presentation bocor ke state | `priceLabel: '$'+x.toLocaleString()` di-dispatch ke Redux (`app/page.tsx:25`) | Store menyimpan format view |
| S7 | Dead state | `selected` di-dispatch (`SELECTED`) tapi tak pernah dibaca | Kompleksitas tanpa guna |
| S8 | Nol test, nol types | Semua `useState<any>`, `p: any`, `s: any` | Regresi tak terdeteksi |

---

## 2. Dampak Perbaikan & Layer Tujuan

| Smell | Perbaikan | Layer tujuan |
|---|---|---|
| S1 | `DeviceRepository` / `UserRepository` + implementasi InMemory & Api | infrastructure |
| S2 | `mock-data.ts` single source of truth (+`stock: 12`) | infrastructure |
| S3 | Redux Toolkit slices typed (`user`, `device-catalog`, `device-filter`, `orders`) + typed hooks | composition/store |
| S4 | `purchaseDevice` use case murni | use-cases |
| S5 | Dekomposisi komponen (`SiteHeader`, `SiteFooter`, `DeviceCard`, `FilterToolbar`, `PurchaseDialog`, dll.) | presentation |
| S6 | `formatUsdPrice()` dipanggil di view | shared/lib |
| S7 | State `selected` dihapus | — |
| S8 | Vitest + strict TypeScript types | semua layer |

---

## 3. Keputusan Desain (Design Decisions)

- **D1:** UI & behavior 100% identik — markup & className di-copy persis, `globals.css` tak diubah.
- **D2:** Dual repository implementation: `InMemoryDeviceRepository` (default via registry) + `ApiDeviceRepository` + Route Handlers Next.js App Router.
- **D3:** Pengujian menyeluruh: Unit tests (domain, use-case, store slice, controller) + Component tests (Testing Library).
- **D4:** Halaman utama & detail tetap Client Component dengan simulasi delay realistis (450ms, 750ms, 600ms, 1100ms) untuk menjaga parity UX loading asli.
- **D5:** `purchaseDeviceController` berupa async function dipanggil dari event handler onClick.
- **D6:** Search & Filter dikelola Redux slice (`device-filter-slice`) dengan selector memoized.
- **D7:** Ubiquitous Language: menggunakan istilah `Device` konsisten dengan UI.
