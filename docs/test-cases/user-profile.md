# Test Cases — Fitur User Profile

Dokumentasi test case untuk fitur `user-profile` (FDD + TDD).

---

## 1. Domain: User & Display Name

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| UP-01 | Format `displayName(user)` | User `{ firstName: 'Dilan', lastName: 'Morgan', ... }` | Mengembalikan `'Dilan Morgan'` |
| UP-02 | Format `displayName(user)` jika `lastName` kosong | User `{ firstName: 'Alex', lastName: '', ... }` | Mengembalikan `'Alex'` |

---

## 2. Use Case: Get User

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| UP-03 | `getUser(repo)` | Mock UserRepository yang mengembalikan user | Mengembalikan object `User` berformat camelCase (`walletBalance: 1050`) |

---

## 3. Controller: User Controller

| ID | Skenario | Input / Prekondisi | Expected Result |
|---|---|---|---|
| UP-04 | `getUserController()` | Registry default (`InMemoryUserRepository`) | Mengembalikan data mock user Dilan Morgan dengan walletBalance 1050 |
