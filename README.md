# TMS — Transportation Management System

A Next.js app for managing shipments, tracking deliveries, and viewing reports. It uses a single GraphQL API with mock auth and in-memory storage.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) (Radix UI, new-york style) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **API** | [GraphQL](https://graphql.org) via [Apollo Server 5](https://www.apollographql.com/docs/apollo-server) |
| **Client data** | [Apollo Client 4](https://www.apollographql.com/docs/react) |
| **Data layer** | In-memory `Map` (no external DB); seed runs on first API hit |

- **Fonts:** [Geist](https://vercel.com/font) (sans + mono) via `next/font`
- **Config:** `NEXT_PUBLIC_GRAPHQL_ENDPOINT` optional; defaults to `/api/graphql` on same origin

## API

### Endpoint

- **URL:** `POST` and `GET` `/api/graphql`
- **Handler:** Apollo Server in `src/app/api/graphql/route.ts`
- **Context:** Built per request from the `x-mock-role` header (`admin` or `employee`).

### GraphQL schema

- **Queries**
  - `getShipmentsQuery(filter, sort)` — list shipments with optional filter/sort
  - `getShipmentByIdQuery(id)` — single shipment by ID
  - `getShipmentsPaginatedQuery(filter, sort, pagination)` — cursor-style pagination with `edges` and `pageInfo`
- **Mutations**
  - `addShipmentMutation(input)` — create shipment (requires authenticated context)
  - `updateShipmentMutation(id, input)` — update shipment (**admin** only; employees get Forbidden)

Types include `Shipment` (with `pickupLocation`, `deliveryLocation`, `trackingData`, `rates`), filters, sort, and pagination inputs. See `src/graphql/schema.ts` and `src/graphql/shipments/` for full definitions.

### Auth (mock)

- No real login. Role is chosen in the UI and stored in `localStorage` under `tms-mock-role` (`admin` or `employee`).
- Apollo Client sends it on every request via the `x-mock-role` header.
- The API uses this to set `GraphQLContext.user` and `GraphQLContext.role`; mutations enforce “authenticated” and “admin only” where applicable.

## Application flow

1. **Entry**
   - `layout.tsx` wraps the app in `Providers` and `AppShell`.
   - `Providers`: `MockAuthProvider` (role from localStorage) → `ApolloProvider` (client pointing at `/api/graphql` and adding `x-mock-role`).

2. **Routing**
   - **Dashboard:** `/` — links to Shipments, Create Shipment, Reports.
   - **Shipments:** `/shipments` — list/detail/create/edit via GraphQL queries and mutations.
   - **Reports:** `/reports`, `/reports/analytics`, `/reports/export`.
   - **Settings:** `/settings` (admin-only in nav).

3. **Data flow**
   - **Server:** First request to `/api/graphql` runs `seedDemoShipments()` and fills the in-memory shipment store. Resolvers in `src/graphql/shipments/` read/write this store; mutations also read `context.role` for auth/admin checks.
   - **Client:** Pages and components use Apollo Client (e.g. `useQuery`, `useMutation`) with the operations in `src/graphql/shipments/operations.ts`. All requests automatically include `x-mock-role` from `getStoredMockRole()`.

4. **Role behavior**
   - **Employee:** Can list/view shipments and create shipments; cannot update shipments or open admin-only routes (e.g. Settings, Export).
   - **Admin:** Same as employee plus update shipments and access admin-only sections.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the app shell (or Settings) to switch between **admin** and **employee** to see different permissions and mutation behavior.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server)
- [Apollo Client (React)](https://www.apollographql.com/docs/react)
