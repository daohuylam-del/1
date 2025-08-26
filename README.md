# Ad Finance Manager

This is a scaffolded Next.js (App Router) project with Tailwind CSS, shadcn/ui components, and Prisma.

## Getting Started

Create a `.env` file in the project root and define:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your_jwt_secret"
FB_API_VERSION="v19.0"
```

Then run the following commands:

```
npm i
npx prisma migrate dev
npm run seed
npm run dev
```

The app will be available at http://localhost:3000.
