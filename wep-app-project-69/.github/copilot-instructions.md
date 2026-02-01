# FoodHub - AI Coding Guidelines

## Architecture Overview
- **Next.js 16 App Router** with TypeScript and React 19
- **Prisma ORM** with SQLite database for recipes, users, inventory, and favorites
- **Tailwind CSS v4** for styling with Lucide React icons
- Bilingual UI: Thai text with English code comments

## Key Patterns
- **Server Components** for data fetching (e.g., `app/page.tsx` fetches recipes with `db.recipe.findMany({ include: { author: true, ingredients: { include: { ingredient: true } } } })`)
- **Client Components** for interactivity (e.g., `recipes/[id]/page.tsx` uses `useState` for serving adjustments)
- **Database Relations**: Always use `include` for nested data (see `lib/db.ts` for singleton setup)
- **Component Structure**: Shared components in `src/components/`, pages in `src/app/`
- **Ingredient Scaling**: Calculate amounts as `(baseAmount / baseServings) * newServings` (see `recipes/[id]/page.tsx`)

## Development Workflow
- **Start Dev**: `npm run dev` (auto-reloads on changes)
- **Database Setup**: `npx prisma generate && npx prisma db push` after schema changes
- **Seed Data**: `npm run prisma:seed` to populate sample recipes/users
- **Linting**: `npm run lint` with Next.js config (ignores `.next/**`)

## Database Interactions
- **User Recipes**: Query with `db.recipe.findMany({ where: { authorId: userId } })`
- **Inventory Management**: Link via `InventoryItem` with `userId` and `ingredientId`
- **Recipe Ingredients**: Many-to-many through `RecipeIngredient` with amounts
- **Favorites**: Unique constraint on `[userId, recipeId]`

## UI Conventions
- **Color Scheme**: Orange (`orange-500`) for primary actions, gray tones for neutrals
- **Icons**: Lucide React (e.g., `ChefHat`, `PlusCircle`, `User`)
- **Layout**: Responsive grid (`grid-cols-1 md:grid-cols-3`), sticky navbar
- **Typography**: Inter font, bold headings, line-clamp for descriptions

## File Organization
- `src/app/`: Route pages (e.g., `dashboard/`, `inventory/shopping-list/`)
- `src/components/`: Reusable UI (e.g., `Navbar.tsx`)
- `src/lib/db.ts`: Prisma client singleton
- `prisma/schema.prisma`: Database models and relations
- `prisma/seed.ts`: Sample data creation</content>
<parameter name="filePath">c:\Users\pipez\Desktop\web-app-project-69\wep-app-project-69\.github\copilot-instructions.md