# Dripyard — Warp AI Repo Index

This repository is a static front-end for an e‑commerce experience called "Drip Yard." It is built with vanilla HTML/CSS/JavaScript and talks to a backend API via a small client wrapper in `api/client.js`. There is no build system; everything is served as static files.

## Tech stack
- HTML, CSS, JavaScript (no framework, no bundler)
- Static assets under `assets/`
- Backend API documented by `api/openapi.json`

## Project layout (high level)
- `index.html`, `main.js`, `styles.css` — landing page and global styles/scripts
- `api/`
  - `client.js` — minimal API client used by pages
  - `openapi.json` — backend OpenAPI spec for available endpoints
- `assets/` — images and videos (cart.png, dripyard.mp4, etc.)
- Page modules (each has `index.html`, `script.js`, `styles.css`):
  - `Admin_Dashboard/`, `adminProducts/`, `adminReviewCheck/`
  - `accountSetting/`, `userProfile/`, `users/`
  - `login/`, `signup/`
  - `cart/`, `wishlist/`, `productDetails/`, `categoryPage/`
  - `orderCheckout/`, `orderConfirmation/`, `orderDetails/`, `myOrders/`
  - `orderManagement/`, `paymentSuccess/`, `paymentFailure/`
  - `customerReview/`, `customerReviewSubmission/`
  - `helpSubmission/`, `myTickets/`
- `SHIPROCKET_INTEGRATION_GUIDE.md` — notes about shipping integration

## API client overview (api/client.js)
- BASE URL selection:
  - If `location.hostname === 'dripyardwebsite.vercel.app'` → `https://skillful-nature-production.up.railway.app`
  - Otherwise → `http://localhost:8080`
- Auth:
  - Stores JWT in `localStorage` under key `auth_token`
  - Sends `Authorization: Bearer <token>` header when `auth: true`
- Exposes namespaces:
  - `auth` — signin, signup, send OTP
  - `products` — list, get, product reviews (list/create)
  - `cart` — get, add, update item, delete item
  - `wishlist` — get, add/remove product
  - `user` — get/update profile
  - `orders` — create, getById, cancel
  - `helpdesk` — submit ticket
  - `admin` — products, orders, transactions, coupons

See `api/openapi.json` for the full endpoint list and schema references.

## Running locally
Because the app uses relative paths and fetch, use a static file server (don’t open HTML directly from the file system).

Options:
- Node.js: `npx http-server . -p 5173 -c-1` or `npx serve -s .`
- Python 3: `python -m http.server 5173`

Then open `http://localhost:5173/`.

Backend expectations:
- Start a compatible backend at `http://localhost:8080` to fully exercise authenticated and data-backed flows. Without it, pages relying on the API will show loading/error states.

## Common flows
- Landing page (`index.html` + `main.js`) shows featured products via `apiClient.products.list` and toggles auth UI based on `auth_token`.
- Cart and Wishlist pages require a logged-in user (JWT in localStorage).
- Product details and reviews use `apiClient.products.get(...)` and review subroutes.
- Checkout creates orders via `apiClient.orders.create(...)` and handles payment redirects.
- Admin pages (products/orders/transactions) call `/api/admin/*` endpoints; expect role-based access on the server.

## Environment and configuration
- Production host check is domain-based in `api/client.js`. To point staging builds elsewhere, modify `PROD_API_HOST` or `BASE_URL` logic.
- No .env usage in the frontend; secrets are not embedded. Auth token is stored in `localStorage` as `auth_token`.

## Development tips
- Keep UTF‑8 encoding for HTML to avoid garbled characters (meta charset is already present). If you see characters like â‚¹ instead of ₹, ensure editor saves files as UTF‑8.
- Each page folder is self-contained; prefer reusing utilities in `api/client.js` rather than duplicating fetch logic.
- Handle API errors gracefully; `api/client.js` throws with status and message excerpt.

## Deployment
- Any static host (Vercel, Netlify, GitHub Pages, S3+CDN) works.
- Ensure the production domain matches the check in `api/client.js` or adjust accordingly so the frontend talks to the correct backend.

## Quick reference
- Entry: `index.html`
- Global assets: `assets/`
- API definitions: `api/openapi.json`
- API wrapper: `api/client.js`
- Auth token key: `auth_token` (localStorage)
