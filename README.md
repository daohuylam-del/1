# ad-finance-manager

ad-finance-manager is a progressive web application (PWA) for tracking personal finances. It runs on a Node.js backend with a PostgreSQL database.

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ad-finance-manager
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment variables**
   Copy `.env.example` to `.env` and adjust the values.
   ```bash
   cp .env.example .env
   ```
4. **Database setup**
   Run migrations and seed initial data.
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```

## Available scripts

- `npm run dev` – start development server with hot reload
- `npm run build` – compile the production build
- `npm start` – start the compiled app
- `npm run db:migrate` – apply database migrations
- `npm run db:seed` – seed the database with sample data

## PWA installation

Open the application in a supported browser (e.g., Chrome, Edge, or Safari). Use the “Install app” button in the address bar or select “Add to Home Screen” from the browser menu.

## Core features

- Track income and expenses
- Categorize transactions
- Visualize budgets with charts
- Works offline once installed as a PWA

