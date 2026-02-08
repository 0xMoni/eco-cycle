# EcoCycle - Sustainable Second-Hand Marketplace

A modern, eco-friendly marketplace for buying and selling pre-loved items. Built with Next.js 15 and React 19.

## Features

- **User Authentication** - Login and registration system
- **Product Listings** - Create, edit, and manage your listings
- **Browse & Search** - Find items by category or search
- **Shopping Cart** - Add items and checkout
- **Purchase History** - Track your orders
- **Responsive Design** - Works on mobile and desktop

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React Framework |
| React 19 | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Zustand | State Management |
| React Hook Form | Form Handling |
| Zod | Validation |
| Lucide React | Icons |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/0xMoni/eco-cycle.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

| Email | Username |
|-------|----------|
| demo@ecofinds.com | DemoUser |
| seller@ecofinds.com | EcoSeller |
| buyer@ecofinds.com | GreenBuyer |

*Use any password to login*

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/login/      # Authentication
│   ├── dashboard/       # Home dashboard
│   ├── products/        # Browse, view, create, edit products
│   ├── cart/            # Shopping cart
│   ├── my-listings/     # Manage your listings
│   ├── purchases/       # Purchase history
│   └── profile/         # User profile
├── components/          # Reusable components
├── store/               # Zustand state stores
├── lib/                 # Utilities and services
└── types/               # TypeScript types
```

---

Made with :seedling: for a sustainable future
