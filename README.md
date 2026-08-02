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
- **Web Admin Portal:** [https://brother-tours-management-system-web-roan.vercel.app/auth/signin]
- **Web Landing (Customer):** [https://brother-tours-management-system-web-phi.vercel.app/home]
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


## 🔑 Test Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@brothertours.com | Admin@123 |
| **Sales** | sales@brothertours.com | Sales@123 |
| **Viewer** | viewer@brothertours.com | Viewer@123 |

---

## ⚙️ Environment Variables (`.env`)

Create `.env` file in the root and respective sub-packages:

```env
# Database Connection server
DATABASE_URL="postgresql://postgres:1234@localhost:5432/brother_tours_db?schema=public"
PORT=5050
NODE_ENV=development
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_IN=30d

CORS_ORIGIN='http://localhost:3000,http://localhost:3001'

USER_SECRET="demo"
SESSION_SECRET=demo"


# API Configuration web-admin and landing
NEXT_PUBLIC_API_URL="http://localhost:5050"



## ⚠️ Known Limitations & Future Improvements

### Current Limitations:
1. **Render Free Tier Cold Starts:** The backend API hosted on Render's free tier spins down after inactivity, causing an initial 30-second response latency (Cold Start) on the first request.
2. **File Upload Limit:** Images are uploaded using local cloud key identifiers. AWS S3 / Cloudinary integration is fully structured but currently mocked/limited to basic URLs.

### Future Enhancements (With more time):
- **Webhooks & Real-time Notifications:** Implement Socket.io / Supabase Realtime for instant notification of new bookings and supplier price changes.
- **Redis Caching:** Expand Upstash Redis caching layer to cover tour search filtering and dynamic dashboard metrics for ultra-fast response times.


## 🧪 Automated Tests (5 Required Scenarios)

Automated tests are implemented using **Vitest** for backend business logic. 

Run tests locally:
```bash
pnpm test





---

### 4. 🧠 Technical Screening & Problem Solving Answers

```markdown
## 🧠 Technical Architecture & Incident Handling Notes

### 1. Overbooking Prevention (Concurrency Control)
- **Solution:** Utilized **Database Transactions with Pessimistic Locking** (`SELECT ... FOR UPDATE` via PostgreSQL/Drizzle) during booking creation to lock seat capacity rows until the transaction completes, preventing double-booking on simultaneous requests.

### 2. Payment Succeeded but Booking Creation Failed (Resiliency)
- **Solution:** Implemented **Idempotency Keys** sent with payment gateways and transactional DB rollbacks. If payment callback arrives without a booking record, a background job uses Webhook Retries to rebuild the booking or flag for manual reconciliation.

### 3. Dashboard Performance Optimization (1M+ Records)
- **Solution:** Applied **Database Indexing** on high-frequency columns (`createdAt`, `status`, `userId`), implemented pagination, and leveraged **Upstash Redis** to cache summary metrics with a 5-minute TTL invalidation on new entries.

### 4. Supplier Price Anomaly Protection & Audit Recovery
- **Solution:** Any price change exceeding **30% threshold** triggers a UI Warning modal requiring a written audit reason. All edits write to `price_histories` (Audit Log). Admins can inspect logs and execute a **Point-In-Time Restore (Rollback)** using historical rate IDs.