### Backend

```bash
# install root dependencies
npm install

# run in development (auto-restart via nodemon)
npm run dev          # alias for nodemon index.js
# or
node index.js        # plain Node server
```

The backend listens on **http://localhost:3000** by default.

### Frontend

```bash
cd frontend
npm install

# start Vite dev server with proxy to Express
npm run dev


## Features

- **Mock Product Catalog** – 10 curated products defined in `data/products.json`.
- **Express API** – REST routes for reading products, managing an in-memory cart, and generating mock receipts.
- **React Frontend** – Responsive gallery with API-driven state, loading/error guards, and a cart page.
- **Receipt Page** – Dedicated `/receipt` route that mimics a real order confirmation.
- **Modern UI** – Custom styling, gradient branding, and accessible feedback states.
-**Cart Functinality**- You can add the items in cart and can remove them.
- **CORS + Proxy Support** – Frontend can call the backend during development without manual configuration.

---

## Tech Stack

- **Backend:** Node.js, Express 5, Mongoose (optional/user model placeholder), CORS.
- **Frontend:** React 19 + Vite 7, React Router, modern CSS.
- **Tooling:** Nodemon (dev server reload), npm scripts.
