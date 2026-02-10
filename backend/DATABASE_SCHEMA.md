# Bensaoud AUTO - Database Schema

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Admins    │       │    Offers    │───┬───│ OfferImages │
└─────────────┘       └──────────────┘   │   └─────────────┘
                             │            │
                             │            └─── (One-to-Many)
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────▼──────┐    ┌────▼────────┐
              │   Orders   │    │  Visitors   │
              └─────┬──────┘    └─────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼────┐ ┌───▼─────┐ ┌───▼──────┐
   │ Clients │ │Payments │ │(Visitor) │
   └─────────┘ └─────────┘ └──────────┘
```

---

## Tables

### 1. **admins**

User accounts with authentication credentials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `name` | VARCHAR(100) | NOT NULL | Admin full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | ENUM | NOT NULL, DEFAULT 'ADMIN' | AdminRole: ADMIN, SUPER_ADMIN |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_admins_email` on `email` (unique)

---

### 2. **offers**

Car listings available for sale.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `brand` | VARCHAR(100) | NOT NULL | Car brand (e.g., Toyota) |
| `model` | VARCHAR(100) | NOT NULL | Car model (e.g., Corolla) |
| `year` | INTEGER | NOT NULL | Manufacturing year |
| `km` | INTEGER | NOT NULL | Kilometers/mileage |
| `price` | DECIMAL(12,2) | NOT NULL | Asking price |
| `location` | VARCHAR(100) | NOT NULL | Car location |
| `owner_name` | VARCHAR(100) | NOT NULL | Owner full name |
| `owner_phone` | VARCHAR(20) | NOT NULL | Owner contact number |
| `owner_email` | VARCHAR(255) | NULLABLE | Owner email (optional) |
| `status` | ENUM | NOT NULL, DEFAULT 'AVAILABLE' | OfferStatus: AVAILABLE, RESERVED, SOLD |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Listing creation time |

**Indexes:**
- `idx_offers_status` on `status`
- `idx_offers_brand` on `brand`

---

### 3. **offer_images**

Image URLs for offers (Cloudinary).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `offer_id` | INTEGER | NOT NULL, FK → offers(id) | Parent offer |
| `image_url` | TEXT | NOT NULL | Cloudinary image URL |
| `public_id` | VARCHAR(255) | NOT NULL | Cloudinary public ID (for deletion) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Upload timestamp |

**Foreign Keys:**
- `offer_id` → `offers(id)` ON DELETE CASCADE

**Indexes:**
- `idx_offer_images_offer_id` on `offer_id`

---

### 4. **visitors**

Potential buyers (leads).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `name` | VARCHAR(100) | NOT NULL | Visitor full name |
| `phone` | VARCHAR(20) | NOT NULL | Contact number |
| `email` | VARCHAR(255) | NULLABLE | Email (optional) |
| `car_brand` | VARCHAR(100) | NOT NULL | Interested car brand |
| `car_model` | VARCHAR(100) | NOT NULL | Interested car model |
| `budget` | DECIMAL(12,2) | NOT NULL | Budget amount |
| `remarks` | TEXT | NULLABLE | Additional notes |
| `status` | ENUM | DEFAULT 'NEW' | VisitorStatus: NEW, CONTACTED, MATCHED, CONVERTED, LOST |
| `created_at` | TIMESTAMP | DEFAULT NOW() | First contact time |

**Indexes:**
- `idx_visitors_status` on `status`

---

### 5. **orders**

Sales orders linking offers to buyers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `offer_id` | INTEGER | NOT NULL, FK → offers(id) | Sold car |
| `visitor_id` | INTEGER | NULLABLE, FK → visitors(id) | Source visitor (if from lead) |
| `client_name` | VARCHAR(100) | NOT NULL | Buyer name |
| `client_phone` | VARCHAR(20) | NOT NULL | Buyer phone |
| `client_email` | VARCHAR(255) | NULLABLE | Buyer email (optional) |
| `agreed_price` | DECIMAL(12,2) | NOT NULL | Final sale price |
| `deposit` | DECIMAL(12,2) | DEFAULT 0 | Initial deposit paid |
| `profit` | DECIMAL(12,2) | NULLABLE | Profit margin |
| `remarks` | TEXT | NULLABLE | Order notes |
| `status` | ENUM | DEFAULT 'PENDING' | OrderStatus: PENDING, CONFIRMED, COMPLETED, CANCELED |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Order creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Foreign Keys:**
- `offer_id` → `offers(id)`
- `visitor_id` → `visitors(id)` ON DELETE SET NULL

**Indexes:**
- `idx_orders_status` on `status`
- `idx_orders_offer_id` on `offer_id`

---

### 6. **clients**

Customers who completed purchases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `name` | VARCHAR(100) | NOT NULL | Client full name |
| `phone` | VARCHAR(20) | NOT NULL | Contact number |
| `email` | VARCHAR(255) | NULLABLE | Email (optional) |
| `address` | TEXT | NULLABLE | Physical address |
| `total_spent` | DECIMAL(12,2) | DEFAULT 0 | Lifetime spending |
| `remaining_balance` | DECIMAL(12,2) | DEFAULT 0 | Outstanding amount |
| `notes` | TEXT | NULLABLE | Client notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Customer since |

**Indexes:**
- `idx_clients_phone` on `phone`

---

### 7. **payments**

Payment transactions for orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `order_id` | INTEGER | NOT NULL, FK → orders(id) | Related order |
| `client_id` | INTEGER | NULLABLE, FK → clients(id) | Paying client |
| `amount` | DECIMAL(12,2) | NOT NULL | Payment amount |
| `method` | ENUM | DEFAULT 'CASH' | PaymentMethod: CASH, TRANSFER, CHEQUE |
| `status` | ENUM | DEFAULT 'UNPAID' | PaymentStatus: UNPAID, ADVANCE, PAID |
| `notes` | TEXT | NULLABLE | Payment notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Payment timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`
- `client_id` → `clients(id)` ON DELETE SET NULL

**Indexes:**
- `idx_payments_status` on `status`
- `idx_payments_order_id` on `order_id`
- `idx_payments_client_id` on `client_id`

---

### 8. **session** (auto-created by connect-pg-simple)

Session storage for authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `sid` | VARCHAR | PRIMARY KEY | Session ID |
| `sess` | JSON | NOT NULL | Session data |
| `expire` | TIMESTAMP | NOT NULL | Expiration time |

---

## Enums

### AdminRole
```typescript
enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}
```

### OfferStatus
```typescript
enum OfferStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD'
}
```

### VisitorStatus
```typescript
enum VisitorStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  MATCHED = 'MATCHED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}
```

### OrderStatus
```typescript
enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  UNPAID = 'UNPAID',
  ADVANCE = 'ADVANCE',
  PAID = 'PAID'
}
```

### PaymentMethod
```typescript
enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CHEQUE = 'CHEQUE'
}
```

---

## Business Rules

### Status Cascades

**Order Creation:**
- Offer status: `AVAILABLE` → `RESERVED`
- Visitor status (if linked): `*` → `MATCHED`

**Order Completion:**
- Offer status: `RESERVED` → `SOLD`
- Visitor status (if linked): `MATCHED` → `CONVERTED`
- Order status: `CONFIRMED` → `COMPLETED`

**Order Cancellation:**
- Offer status: `RESERVED` → `AVAILABLE`
- Visitor status (if linked): `*` → `LOST`
- Order status: `*` → `CANCELED`

### Validation Rules

- Cannot update/delete SOLD offers
- Cannot update/delete COMPLETED or CANCELED orders (except cancel action)
- Cannot update/delete PAID payments
- Visitor status must progress logically (no backwards jumps)

---

## Migrations

**For Production:**

Disable `synchronize: true` in `app.module.ts` and use TypeORM migrations:

```bash
npm run typeorm migration:generate -- -n InitialSchema
npm run typeorm migration:run
```
