# Test Cases — Fitur Product Catalog

Dokumentasi test case untuk fitur `product-catalog` mengikuti metodologi TDD dan FDD.

---

## 1. Domain: Filter, Search, & Sort

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| PC-01 | Filter berdasarkan category `'Smartphones'` | 6 devices mock (4 smartphones, 2 tablets) | Mengembalikan 4 device dengan `type === 'Smartphones'` |
| PC-02 | Filter dengan category `'All devices'` | 6 devices mock | Mengembalikan seluruh 6 device tanpa pengurangan |
| PC-03 | Search case-insensitive cocok pada `name` atau `brand` | Search query `'ipHone'` | Mengembalikan 2 devices (iPhone 16 Pro, iPhone 16) |
| PC-04 | Search cocok pada `brand` | Search query `'sams'` | Mengembalikan 2 devices Galaxy |
| PC-05 | Search tidak ada yang cocok | Search query `'zzz'` | Mengembalikan array kosong `[]` |
| PC-06 | Sort price low to high (`'low'`) | 6 devices mock | Urutan harga naik: iPad Air ($599) pertama, Galaxy S25 Ultra ($1299) terakhir |
| PC-07 | Sort price high to low (`'high'`) | 6 devices mock | Urutan harga turun: Galaxy S25 Ultra ($1299) pertama |
| PC-08 | Sort `'featured'` | 6 devices mock | Mengembalikan urutan asli tanpa memutasi array input asli |

---

## 2. Use Cases: Get Devices & Get Device by ID

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| PC-09 | `getDevices(repo)` | Mock repository dengan 2 device | Mengembalikan array 2 device dari repository |
| PC-10 | `getDeviceById(repo, '3')` | Mock repository dengan device '3' | Mengembalikan device yang sesuai dan memiliki properti `stock: 12` |
| PC-11 | `getDeviceById(repo, '99')` | Device ID tidak ada di repo | Melemparkan error `DeviceNotFoundError` dengan pesan `"We couldn’t find that device."` |

---

## 3. Controller: Device Controller

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| PC-12 | `getDevicesController()` | Menggunakan registry default (`InMemoryDeviceRepository`) | Mengembalikan 6 device mock katalog |
| PC-13 | `getDeviceByIdController('1')` | Menggunakan registry default | Mengembalikan iPhone 16 Pro lengkap dengan atribut teknis |
| PC-14 | `getDeviceByIdController('unknown')` | ID tidak ada | Melempar `DeviceNotFoundError` |

---

## 4. Presentation: Components

| ID | Skenario | Target Komponen | Expected Result |
|---|---|---|---|
| PC-15 | Render DeviceCard lengkap | `DeviceCard` dengan device mock | Menampilkan brand, nama, storage, warna, harga terformat (`$999 USD`), dan badge `POPULAR` |
| PC-16 | FilterToolbar interaksi search & tab | `FilterToolbar` terhubung ke store | Memanggil action / callback perubahan state dengan payload yang tepat |
