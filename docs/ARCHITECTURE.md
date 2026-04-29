# 🏗️ Gastronomie Web-App - Architektur Übersicht

## System Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│              (Next.js 14 + React + TypeScript)               │
│            http://localhost:3000                             │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway (CORS)                        │
├─────────────────────────────────────────────────────────────┤
│                        Backend API                           │
│          (Express.js + TypeScript + Prisma)                  │
│            http://localhost:3001/api                         │
├─────────────────────────────────────────────────────────────┤
│                      PostgreSQL Database                     │
│                      Port: 5432                              │
└─────────────────────────────────────────────────────────────┘
```

## Komponenten

### Frontend (Next.js 14)
- **Router**: App Router mit TypeScript
- **State Management**: Zustand für globalen State
- **Server State**: React Query für API Daten
- **Forms**: React Hook Form mit Zod Validierung
- **UI**: Tailwind CSS + shadcn/ui Komponenten
- **API Client**: Axios mit automatischer Token-Verwaltung

### Backend (Express.js)
- **Framework**: Express.js mit TypeScript
- **Database**: Prisma ORM
- **Authentication**: JWT Token-basiert
- **Validation**: Zod Schemas
- **Security**: Helmet, CORS, Password Hashing mit bcryptjs

### Database (PostgreSQL)
- **Models**: User, Product, Order, Coupon, Address
- **Relations**: Vollständige Beziehungen zwischen Entities
- **Migrations**: Prisma Migrations
- **Seeding**: Automatische Test-Daten

## Datenbankschema

### User (Benutzer)
```
- id: CUID (Primary Key)
- email: String (Unique)
- password: String (bcrypt gehashed)
- name: String
- role: UserRole (CUSTOMER, ADMIN, RESTAURANT_MANAGER)
- createdAt, updatedAt: DateTime
```

### Product (Produkt)
```
- id: CUID (Primary Key)
- name: String
- description: String (Optional)
- price: Float
- category: String
- image: String (Optional URL)
- active: Boolean
- createdAt, updatedAt: DateTime
```

### Order (Bestellung)
```
- id: CUID (Primary Key)
- userId: String (Foreign Key -> User)
- orderType: OrderType (PICKUP, DELIVERY)
- status: OrderStatus (PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED)
- totalAmount: Float
- items: OrderItem[] (Relations)
- addresses: Address[] (Relations)
- createdAt, updatedAt: DateTime
```

### OrderItem (Bestellzeile)
```
- id: CUID (Primary Key)
- orderId: String (Foreign Key -> Order)
- productId: String (Foreign Key -> Product)
- quantity: Int
- price: Float
- couponApplied: String (Optional)
```

### Coupon (Gutschein)
```
- id: CUID (Primary Key)
- code: String (Unique)
- discountType: String (PERCENTAGE, FIXED)
- discountValue: Float
- productId: String (Foreign Key -> Product)
- expiresAt: DateTime
- active: Boolean
- createdAt: DateTime
```

### Address (Adresse)
```
- id: CUID (Primary Key)
- userId: String (Foreign Key -> User)
- orderId: String (Optional Foreign Key -> Order)
- street: String
- city: String
- postalCode: String
- country: String
- isDefault: Boolean
- createdAt: DateTime
```

## API Endpoints

### Authentication
| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| POST | `/api/auth/register` | Registrierung |
| POST | `/api/auth/login` | Login |

### Products
| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| GET | `/api/products` | Alle Produkte abrufen | ❌ |
| POST | `/api/products` | Produkt erstellen | ✅ Admin |
| GET | `/api/products/:id` | Produkt Details | ❌ |

### Orders (geplant Phase 2)
| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| POST | `/api/orders` | Bestellung erstellen | ✅ |
| GET | `/api/orders/:id` | Bestellung abrufen | ✅ |
| PUT | `/api/orders/:id/status` | Status aktualisieren | ✅ Admin |

## Authentication Flow

```
1. Benutzer registriert/loggt sich ein
   POST /api/auth/register | /api/auth/login
   
2. Server prüft Daten und gibt JWT Token zurück
   Response: { token, user }
   
3. Frontend speichert Token im localStorage
   localStorage.setItem('token', token)
   
4. Frontend sendet Token in jedem Request
   Authorization: Bearer <token>
   
5. Backend verifiziert Token mit Middleware
   authMiddleware -> verifyToken()
   
6. Middleware setzt userId in Request
   req.userId = decoded.userId
```

## Deployment-Übersicht

### Docker Compose
```yaml
- PostgreSQL Service (Port 5432)
- Backend Service (Port 3001)
- Frontend Service (Port 3000)
```

### Environment Variablen

**Backend (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development Workflow

1. **Frontend-Entwicklung**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend-Entwicklung**
   ```bash
   cd backend
   npm run dev
   ```

3. **Mit Docker**
   ```bash
   docker-compose up
   ```

4. **Datenbank Migrations**
   ```bash
   cd backend
   npx prisma migrate dev --name <name>
   ```

## Sicherheitsfeatures

✅ JWT Token-basierte Authentifizierung  
✅ Password Hashing mit Bcryptjs (10 Salt Rounds)  
✅ CORS Schutz  
✅ Security Headers mit Helmet  
✅ Input Validierung mit Zod  
✅ Type-Safe mit TypeScript  
✅ Role-based Access Control (RBAC)

## Performance-Optimierungen (Phase 2+)

- [ ] Database Indexing
- [ ] API Response Caching
- [ ] Query Optimization
- [ ] Image Optimization & CDN
- [ ] Frontend Code Splitting
- [ ] Server-Side Rendering (SSR)
- [ ] Rate Limiting
- [ ] Database Connection Pooling

## Testing (Phase 2+)

- [ ] Unit Tests (Backend)
- [ ] Integration Tests (API)
- [ ] E2E Tests (Frontend)
- [ ] Load Testing

## Monitoring (Phase 2+)

- [ ] Error Tracking
- [ ] Performance Monitoring
- [ ] Logging & Analytics
- [ ] Health Checks
