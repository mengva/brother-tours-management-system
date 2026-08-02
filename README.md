# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```




<!-- **************************************************************=========******************************************************************* -->


# 🧳 Brother Tours Management System

1. ✅ **GitHub Repository:** (Public)

Github Link: https://github.com/mengva/brother-tours-management-system.git

2. ✅ **Deployed Link:** Link on Vercel

A full-stack monorepo web application for managing tour packages, bookings, and operations.

## 🔗 Deployed Links
- **Web Admin Portal:** [https://brother-tours-management-system-web-admin-1v1p0o3nm.vercel.app](https://brother-tours-management-system-web-admin-1v1p0o3nm.vercel.app)
- **Web Landing (Customer):** [https://brother-tours-web-landing.vercel.app](https://brother-tours-web-landing.vercel.app)
- **Backend API:** Hosted on Render
- **Database:** PostgreSQL on Supabase

---

## 🛠️ Tech Stack & DB Architecture

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js / Hono (tRPC)
- **Database:** PostgreSQL (Supabase) + Drizzle ORM
- **Monorepo Tool:** Turborepo + pnpm

### Database ER Diagram

*(ໃສ່ Link ຮູບ ER Diagram ຫຼື ອະທິບາຍ Table Schema ຢູ່ບ່ອນນີ້)*

![alt text](brother_tour_EFD.pgerd.png)

- `User`: Handles authentication and roles (ADMIN, SALES, VIEWER).

-

- `User Crediental`: Get a user password or crediential

-

- `Tour_categories`:  Manages categories for grouping tour packages.

-

- `Tours`: Tour packages info, duration, price, images.

-

- `Tour_itineraries`: Defines day-by-day itineraries (day numbers, titles, meal arrangements, accommodation) tied directly to a master Tour.

-

- `Itineraries`: Custom day-by-day itinerary proposals tailored specifically to a customer's enquiry.

-

- `Booking`: Customer booking details and status.

-

- `Invoices`: Billing documentation linked to bookings. Calculates subtotal, tax, discounts, paid amounts, and due balances with issue/due dates.

-

- `Payments`: Records financial transactions made against bookings and invoices. Captures payment methods (e.g., ONEPAY, BCEL QR, Cash, Transfer), transaction status, and timestamps.

-

- `Suppliers`:Stores third-party vendor details (hotels, transport providers, guides) linked to specific destinations and contact persons.

-

- `Service_rates`:Tracks seasonal or group-size cost rates provided by suppliers.

-

- `Supplier_availability`:Logs daily booking availability for external suppliers.

-

- `Price_histories`:Audit log that tracks price modifications in service_rates to detect anomalies (isSuspicious) and audit user changes.

-

- `Images`:Polymorphic/flexible media table storing cloud file URLs and keys. Dynamically links images to users, suppliers, tours, categories, itineraries, or bookings via foreign key references.

