# 🛠️ Bakers Calculator: Technical Workflow

## 1. Login Process

### Frontend
- **File:** `src/client/components/Login.jsx`
- **Function:** `handleSubmit`
  - User enters email and password.
  - Calls `authAPI.login(email, password)` from `src/client/services/api.js`.
  - On success, token is saved to `localStorage` and user is redirected to `/dashboard`.

- **API Service:** `src/client/services/api.js`
  - **Function:** `authAPI.login`
    - Sends POST request to `/api/users/login` with credentials.
    - On success, saves `token` to `localStorage` via `setAuthToken`.

### Backend
- **Route:** `POST /api/users/login` (`src/server/routes/users.js`)
- **Controller:** `UserController.login` (`src/server/controllers/UserController.js`)
  - Finds user by email.
  - Verifies password with bcrypt.
  - If valid, creates JWT token and returns `{ token, user }`.

- **Database:** `User` model (`src/server/models/User.js`)
  - Stores user credentials and profile info.

---

## 2. Authentication for All Requests

- **Frontend:**  
  - All API requests use `apiRequest` in `src/client/services/api.js`.
  - If `authToken` is present in `localStorage`, it is sent as `Authorization: Bearer <token>`.

- **Backend:**  
  - Protected routes use `authenticateToken` middleware (`src/server/middleware/auth.js`).
  - Middleware verifies JWT, sets `req.userId` for use in controllers.

---

## 3. Profile Fetch & Update

### Frontend
- **File:** `src/client/components/Profile.jsx`
- **Function:** `useEffect` calls `profileAPI.getProfile()` on mount.
- **API Service:** `profileAPI.getProfile` in `src/client/services/api.js`
  - Calls `GET /api/users/me` with token.

### Backend
- **Route:** `GET /api/users/me` (`src/server/routes/users.js`)
- **Controller:** `UserController.getProfile`
  - Uses `req.userId` from JWT to find user in DB.
  - Returns user profile data.

---

## 4. Dashboard, Inventory, Products, Billing

### Frontend
- **Files:**  
  - `src/client/components/Dashboard.jsx`
  - `src/client/components/InventoryManagement.jsx`
  - `src/client/components/ProductManagement.jsx`
  - `src/client/components/BillingSystem.jsx`
- **Hooks:**  
  - `useInventory`, `useProducts`, `useBilling` in `src/client/hooks/`
  - Each hook fetches data from the API using the token.

### Backend
- **Routes:**  
  - `/api/inventory`, `/api/products`, `/api/bills` (see `src/server/routes/`)
- **Controllers:**  
  - `InventoryController`, `ProductController`, `BillController`
  - Use `req.userId` to fetch user-specific data from MongoDB.

---

## 5. Adding a Product to a Bill

- **Frontend:**  
  - In `BillingSystem.jsx`, user selects a product.
  - `addBillItem(productId)` adds product to `billItems` state.
  - On bill generation, calls `addBill` from `useBilling` hook, which sends bill data to backend.

- **Backend:**  
  - `POST /api/bills` handled by `BillController`.
  - Saves bill with reference to `userId` and product details.

---

## 6. Logout Process

- **Frontend:**  
  - User clicks logout (e.g., in `Profile.jsx` or navigation).
  - Calls `authAPI.logout()` which removes `authToken` from `localStorage`.
  - Redirects to `/login`.

- **Backend:**  
  - No action needed (JWT is stateless).

---

## 7. Route Protection

- **Frontend:**  
  - `PrivateRoute.jsx` component checks `authAPI.isAuthenticated()`.
  - If not authenticated, redirects to `/login`.
  - Used for `/dashboard`, `/inventory`, `/products`, `/billing`, `/profile` routes in `App.jsx`.

---

## 8. Data Flow Diagram (Textual)

```
User (browser)
  |
  |--[Login: email/password]--> [Frontend: Login.jsx] 
  |--[POST /api/users/login]--> [Backend: UserController.login] 
  |--[JWT token] <-------------|
  |--[token saved in localStorage]
  |
  |--[GET /api/users/me]--> [Backend: UserController.getProfile] 
  |--[User profile data] <------|
  |
  |--[GET /api/products]--> [Backend: ProductController.getAll]
  |--[Product list] <-----------|
  |
  |--[Add to bill]--> [Frontend: BillingSystem.jsx]
  |--[POST /api/bills]--> [Backend: BillController.create]
  |--[Bill saved in DB] <-------|
  |
  |--[Logout]--> [Frontend: authAPI.logout()]
  |--[Token removed, redirect to /login]
```

---

## 9. Key Files and Functions

| Layer      | File/Function                                 | Purpose                                 |
|------------|----------------------------------------------|-----------------------------------------|
| Frontend   | `Login.jsx` / `authAPI.login`                | User login, token storage               |
| Frontend   | `App.jsx` / `PrivateRoute.jsx`               | Route protection                        |
| Frontend   | `Profile.jsx` / `profileAPI.getProfile`      | Fetch user profile                      |
| Frontend   | `useProducts.js`, `useInventory.js`          | Fetch products/inventory                |
| Frontend   | `BillingSystem.jsx` / `addBillItem`          | Add products to bill                    |
| Backend    | `UserController.js` / `login`, `getProfile`  | Auth, profile endpoints                 |
| Backend    | `ProductController.js`, `BillController.js`  | Product, billing endpoints              |
| Backend    | `auth.js` (middleware)                       | JWT authentication                      |
| Backend    | `User.js`, `Product.js`, `Bill.js`           | MongoDB models                          |

---

## 10. Logout

- **Frontend:**  
  - `authAPI.logout()` removes token and redirects to `/login`.
- **Backend:**  
  - No action needed (JWT is stateless).

---

# Summary

- **Login:** User logs in, gets JWT, stored in localStorage.
- **Authenticated Requests:** All API calls include JWT in header.
- **Route Protection:** `PrivateRoute` ensures only logged-in users access protected pages.
- **Profile/Data:** Fetched using token, user-specific.
- **Billing:** Products added to bill, bill saved with user reference.
- **Logout:** Token removed, user redirected to login. 