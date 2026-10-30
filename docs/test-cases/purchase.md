# Test Cases — Fitur Purchase

Dokumentasi test case untuk alur pembelian simulasi (FDD + TDD).

---

## 1. Domain & Business Rules

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| PU-01 | Pembelian berhasil (saldo cukup) | Device price: $799, balance: $1050 | Mengembalikan status `'success'`, `total: 799`, `orderId` diawali format `'ORB-'` |
| PU-02 | Saldo tidak cukup | Device price: $1299, balance: $1050 | Mengembalikan `{ status: 'insufficient_balance' }` (BUKAN throw error) |
| PU-03 | Device kehabisan stok (`stock < 1`) | Device dengan `stock: 0` | Melempar error `OutOfStockError` dengan pesan `"This device is out of stock."` |
| PU-04 | Device tidak ditemukan | Device id `'99'` tidak ada | Melempar `DeviceNotFoundError` |

---

## 2. Controller: Purchase Controller

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| PU-05 | `purchaseDeviceController` eksekusi sukses | Input device id '6' ($799), balance $1050 | Mengembalikan result sukses dengan simulasi delay 1100ms |
| PU-06 | `purchaseDeviceController` saldo tidak cukup | Input device id '2' ($1299), balance $1050 | Mengembalikan status `'insufficient_balance'` |

---

## 3. Presentation: Purchase Dialog & Buy Button

| ID | Skenario | Target Komponen | Expected Result |
|---|---|---|---|
| PU-07 | Modal sukses | `PurchaseDialog` result sukses | Menampilkan judul `"It’s officially in your orbit."` dan Order reference |
| PU-08 | Modal insufficient | `PurchaseDialog` result insufficient | Menampilkan `"Insufficient balance"` dan kekurangan harga `$(price - balance)` |
| PU-09 | Focus trap & CTA autofocus | `PurchaseDialog` mount | CTA button mendapatkan fokus otomatis dan Tab terjebak di modal |
