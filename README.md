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
- `User`: Handles authentication and roles (ADMIN, SALES, VIEWER).
- `User Crediental`: Get a user password or crediential
- `Tour`: Tour packages info, duration, price, images.
- `Booking`: Customer booking details and status.


1. 👥 User Management & Authentication
users: Central table for system staff and platform users. Stores identity details, account status (isActive), roles (role), granular permissions (permissions array), and session metadata (userAgent).

user_credentials: Stores hashed passwords (passwordHash) separated from the main users table for enhanced security (1-to-1 relationship with users).

customers: Represents end-client profiles. Contains identity numbers, passport information, contact numbers (including WhatsApp), and location details. Can optionally link to a system User ID (userId).

2. 🧳 Tour Packages & Master Data
tour_categories: Manages categories for grouping tour packages (e.g., Adventure, Cultural). Includes unique URL slugs for SEO routing.

tours: The core catalog table for master tour packages. Holds pricing models (adult base price, child, infant, discount, single supplement, and internal cost), durations, destinations, and status flags (isFeatured, isActive).

tour_itineraries: Defines day-by-day itineraries (day numbers, titles, meal arrangements, accommodation) tied directly to a master Tour.

3. 📩 Enquiries & Bookings Flow
enquiries: Tracks incoming customer requests from the Landing Page or manual input. Holds travel dates, passenger counts, and assignment to staff members (assignedStaffId).

itineraries: Custom day-by-day itinerary proposals tailored specifically to a customer's enquiry.

bookings: Main transaction table generated from confirmed enquiries or direct tour selections. Generates a unique bookingRef and tracks financial states (totalAmount, depositAmount, outstandingBalance, and paymentStatus).

4. 💳 Finance & Billing
invoices: Billing documentation linked to bookings. Calculates subtotal, tax, discounts, paid amounts, and due balances with issue/due dates.

payments: Records financial transactions made against bookings and invoices. Captures payment methods (e.g., ONEPAY, BCEL QR, Cash, Transfer), transaction status, and timestamps.

5. 🏢 Suppliers & Rate Management
suppliers: Stores third-party vendor details (hotels, transport providers, guides) linked to specific destinations and contact persons.

service_rates: Tracks seasonal or group-size cost rates provided by suppliers.

supplier_availability: Logs daily booking availability for external suppliers.

price_histories: Audit log that tracks price modifications in service_rates to detect anomalies (isSuspicious) and audit user changes.

6. 🖼️ Media & File Attachments
images: Polymorphic/flexible media table storing cloud file URLs and keys. Dynamically links images to users, suppliers, tours, categories, itineraries, or bookings via foreign key references.
---

## 🔑 Test Accounts (บัญชีทดสอบ)

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@brothertours.com | Admin@123! |
| **Sales** | sales@brothertours.com | Sales@123! |
| **Viewer** | viewer@brothertours.com | Viewer@123! |

---

## ⚙️ Environment Variables (`.env`)

Create `.env` file in the root and respective sub-packages:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:1234@localhost:5432/brother_tours_db?schema=public"
PORT=5050
NODE_ENV=production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_IN=30d

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:5050"

# JWT / Auth Secret

CORS_ORIGIN='http://localhost:3000,http://localhost:3001'

USER_SECRET="934198Eo9dbdhsyw86678XoNIP0045"
SESSION_SECRET="Eo8XoN98867IPpsWci98dbdhsyw8667FR2iR_jUEIFEE02345"

# Uptsash redis catch 

UPSTASH_REDIS_REST_URL=https://pleasing-pup-69269.upstash.io
UPSTASH_REDIS_REST_TOKEN=gQAAAAAAAQ6VAAIncDFhZWE2YjVkNmI1ZTg0ZTU0YWQ2ZTU3MjM1ZDUwZTViYnAxNjkyNjk