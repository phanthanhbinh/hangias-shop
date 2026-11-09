# Fleur — Flower Shop Catalog

An online catalog for the "Fleur" flower shop (Minsk), featuring a shopping cart, a "favorites" list, and an order checkout process.
A portfolio project built with React 18, utilizing routing, global state management, URL-based filtering, and custom responsive design (no UI libraries used).

**Demo:** https://nkorshun.dev/fleur/

## Features

- **Home Page:** Promotional banner, category tiles, "Best Sellers" section, key benefits, customer reviews, and a call-to-action to visit the catalog.
- **Catalog:**
- Filters by category, price (min/max), size, availability, and discount status. 
- Search by product name or composition (with a 300ms debounce delay). 
- Sorting options: popularity, price (low to high), price (high to low), and new arrivals. 
- All filters, search queries, and sorting settings are stored in the URL, making it easy to share specific views. 
- Includes a product count indicator, a "clear filters" option, empty state handling, skeleton loaders, and an error screen with a "Retry" button. 
- "Show More" button (loads 12 additional items at a time). 
- On mobile devices, filters are accessible via a slide-out panel.
- **Product Page:** Image gallery with thumbnails, original and discounted prices, product composition, size, quantity selector, "Add to Cart" and "Add to Favorites" buttons, and a "You Might Also Like" section. Accessing a non-existent product URL triggers a 404 error page.
- **Shopping Cart:**
- Adjustable item quantities. 
- Option to remove items, with an "Undo" button provided in the notification. 
- Free delivery threshold (150 BYN) with a visual progress bar. 
- Promo code `FLEUR10` provides a 10% discount. - **Order Placement:** Phone number input with a `+375` mask, delivery date and time slot selection, gift message (up to 200 characters, with a character counter), anonymous delivery option, payment method selection, and form field validation. Upon submission, an "Order #[number] placed" confirmation appears, and the cart is cleared.
- **Favorites** and **404 (Not Found)** pages.
- The cart and favorites are persisted in `localStorage`. The application remains functional even if `localStorage` is empty or contains corrupted data.
- **Accessibility:** Semantic markup, field labels, `ARIA` attributes, visible focus indicators, full keyboard navigation (e.g., the `Esc` key closes menus, panels, and modals; focus is trapped within modal windows), and a "Skip to content" link.

## Tech Stack

- React 18 + Vite
- React Router v6 (using `useSearchParams` for filters)
- CSS Modules + global CSS variables (no UI component libraries)
- ESLint 9 (flat config)
- Deployment: Netlify

## Architecture

```
src/
main.jsx, App.jsx        Entry point, routing, automatic scroll-to-top on page navigation
pages/                   Home, Catalog, Product, Cart, Checkout, Favorites, NotFound
components/              Header, Footer, ProductCard, ProductGrid, Filters, SearchBar, SortSelect,
QuantityControl, CartItem, OrderSummary, EmptyState, Skeleton, Toast, Modal, Icons
context/                 CartContext, FavoritesContext, ToastContext
hooks/                   useLocalStorage, useDebounce, useProducts, usePageTitle
utils/                   formatPrice (BYN), validators (phone number, order form)
data/                    products.js (30 items), api.js (simulated API requests)
styles/                  variables.css, global.css
```

- **CartContext** (implemented via `useReducer`) stores only `{ id, qty }` pairs and the promo code. The subtotal, discount, shipping, and grand total are calculated from this data using `useMemo`. Upon loading, the data from `localStorage` is validated: unrecognized products and invalid quantities are discarded.
- **FavoritesContext** (using `useReducer`) stores a list of IDs for favorited products.
- **ToastContext** handles the display of pop-up notifications. It supports optional action buttons, such as "Undo."
- **useProducts** fetches products via `fetchProducts()`—a Promise that includes a 300–600ms delay. The hook returns `loading`, `error`, and a `retry` function.
- **useDebounce** delays search operations. **useLocalStorage** persists state to storage and is designed to handle cases where storage is inaccessible without crashing.

To simulate an error state, append `?error=1` to the catalog URL.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # run ESLint checks
npm run build    # build for production (dist/)
npm run preview  # preview the production build
```

## Deploying to Netlify

Configuration is defined in `netlify.toml`: the build command is `npm run build`, and the output directory is `dist`.

The rule `/* → /index.html 200` ensures the application loads correctly regardless of the URL path. Without this, navigating directly to a URL like `/catalog?category=roses` or `/product/...` would result in a 404 error.

Via the command line: `netlify deploy --build --prod`.

## Images

The images are sourced from [Unsplash](https://unsplash.com) via direct links.