# Bensaoud AUTO - Backend API

NestJS backend for the Bensaoud AUTO administration dashboard with PostgreSQL database.

## 🚀 Features

- **Authentication & Authorization**: Session-based auth with Passport.js, role-based access control
- **Offers Management**: Car listings with multi-image upload via Cloudinary
- **Visitors Tracking**: Lead management with status tracking and conversion
- **Orders Management**: Complete workflow (pending → confirmed → completed → canceled)
- **Clients Management**: Customer database with financial tracking
- **Payments Management**: Transaction tracking with multiple payment methods
- **Statistics & Analytics**: Dashboard metrics, monthly sales charts, conversion rates

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Cloudinary account (for image storage)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration.

3. Create PostgreSQL database:
```sql
CREATE DATABASE bensaoud_auto;
```

## 🌱 Seed Database

Populate with sample data (2 admins, 5 offers, 4 visitors, 2 orders, 2 clients, 2 payments):
```bash
npm run seed
```

**Default admin login:**
- Email: `admin@bensaoud.com`
- Password: `admin123`

## 🏃 Running

```bash
# Development with watch mode
npm run start:dev

# Production
npm run build
npm run start:prod
```

API available at: `http://localhost:3000/api`

## 📚 API Endpoints

All routes prefixed with `/api` and require authentication (except `/auth/login`).

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout current session
- `GET /auth/me` - Get authenticated user info

### Admins (Super Admin only)
- `GET /admins` - List all admins
- `POST /admins` - Create new admin
- `PATCH /admins/:id` - Update admin
- `DELETE /admins/:id` - Delete admin

### Offers
- `GET /offers?page=1&limit=10&status=AVAILABLE&brand=Toyota` - List with filters
- `POST /offers` - Create offer (multipart/form-data for images)
- `GET /offers/:id` - Get offer with images
- `PATCH /offers/:id` - Update offer
- `DELETE /offers/:id` - Delete offer (blocked if SOLD)
- `POST /offers/:id/images` - Add images to offer
- `DELETE /offers/images/:imageId` - Remove image

### Visitors
- `GET /visitors?status=NEW` - List visitors
- `POST /visitors` - Create visitor
- `PATCH /visitors/:id/status` - Update status
- `DELETE /visitors/:id` - Delete visitor

### Orders
- `GET /orders?status=PENDING` - List orders
- `POST /orders` - Create order (auto-updates offer & visitor status)
- `POST /orders/:id/confirm` - Confirm order
- `POST /orders/:id/complete` - Complete order & mark offer SOLD
- `POST /orders/:id/cancel` - Cancel & reset statuses

### Clients
- `GET /clients?name=search` - List clients
- `POST /clients` - Create client
- `PATCH /clients/:id/financials` - Update financial data

### Payments
- `GET /payments?status=PAID&method=CASH` - List payments
- `POST /payments` - Create payment
- `POST /payments/:id/mark-paid` - Mark payment as paid
- `GET /payments/order/:orderId` - Get all payments for order
- `GET /payments/client/:clientId` - Get all payments for client

### Statistics
- `GET /statistics/overview` - Dashboard counts
- `GET /statistics/monthly-sales?year=2026` - Monthly revenue chart
- `GET /statistics/conversion-rate` - Visitor→Client conversion
- `GET /statistics/offers-by-status` - Status distribution
- `GET /statistics/revenue` - Financial summary
- `GET /statistics/recent-activity?limit=10` - Recent entities

## 🏗️ Project Structure

```
src/
├── admins/          - Admin user management
├── auth/            - Authentication (Passport Local + Sessions)
├── clients/         - Client management
├── common/          - Shared utilities
│   ├── cloudinary/ - Image upload service
│   ├── decorators/ - @Roles() decorator
│   ├── dto/        - PaginationQueryDto, ApiResponseDto
│   ├── enums/      - Status enums
│   ├── filters/    - Global exception filter
│   └── interceptors/ - Response wrapper
├── offers/          - Offers with images
├── orders/          - Orders with workflow
├── payments/        - Payment transactions
├── statistics/      - Analytics queries
├── visitors/        - Lead tracking
└── seed.ts          - Database seeder
```

## 🔒 Security

- Bcrypt password hashing
- HTTP-only session cookies
- CORS configuration
- Input validation (class-validator)
- Role-based access control (@Roles decorator)
- SQL injection protection (TypeORM)

## 📝 Environment Variables

See `.env.example` for all variables. Key ones:
- `DB_*` - PostgreSQL connection
- `SESSION_SECRET` - Session signing key
- `CLOUDINARY_*` - Image storage credentials
- `PORT` - Server port (default: 3000)

## ⚠️ Production Checklist

- [ ] Set `synchronize: false` in `app.module.ts` (use migrations)
- [ ] Configure CORS with specific origins
- [ ] Use HTTPS (enable `secure: true` for cookies)
- [ ] Set strong `SESSION_SECRET`
- [ ] Enable PostgreSQL SSL
- [ ] Configure Cloudinary production settings
- [ ] Set up proper logging
- [ ] Configure rate limiting

## 📄 License

Private - Bensaoud AUTO
