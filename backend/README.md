# Multi-Tenant E-Commerce Platform - Backend Microservices

## Architecture Overview

This backend follows a microservices architecture with Clean Architecture principles and SOLID design patterns.

### Microservices

1. **Identity.Service** - Authentication, Authorization, Multi-tenancy
2. **Catalog.Service** - Products, Categories, Inventory
3. **Order.Service** - Cart, Checkout, Order Management
4. **Payment.Service** - Payment Gateway Integrations
5. **AI.Service** - AI-powered features (SEO, Analytics, Content Generation)
6. **Media.Service** - Image Processing, SVG Conversion
7. **Notification.Service** - Email, WhatsApp, SMS
8. **Social.Service** - Facebook, Instagram, WhatsApp Business Integration
9. **Subscription.Service** - Tenant Billing, Plan Management
10. **Theme.Service** - Branding, Customization

### Technology Stack

- .NET 8 Web API
- Entity Framework Core 8
- Azure SQL Database
- Redis Cache
- Azure Service Bus
- Azure Blob Storage
- Azure OpenAI Service
- Docker & Kubernetes

### Getting Started

```bash
# Navigate to each service directory
cd src/Services/Identity.Service
dotnet restore
dotnet build
dotnet run

# Or use Docker Compose
docker-compose up -d
```

### Database Migrations

```bash
cd src/Services/Identity.Service
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### API Documentation

Each service exposes Swagger UI at `/swagger`

- Identity Service: http://localhost:5001/swagger
- Catalog Service: http://localhost:5002/swagger
- Order Service: http://localhost:5003/swagger
- AI Service: http://localhost:5004/swagger

### Environment Variables

See `.env.example` in each service directory for required configuration.
