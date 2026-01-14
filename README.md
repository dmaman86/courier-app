# Courier-App

### _Distributed Courier Management Platform — Microservices, Event‑Driven, Secure, Scalable_

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dmaman86/courier-app)
![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Kafka](https://img.shields.io/badge/Kafka-Event--Driven-black)
![Redis](https://img.shields.io/badge/Redis-Key%20Store-red)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)

## 🚧 Project Status

**This system is actively under development.**

> **📚 Interactive Documentation:** Click the DeepWiki badge above to explore AI-powered documentation you can chat with!

---

## ✨ Key Features

- 🔐 **Advanced Security**: RSA key rotation with Redis-based distribution
- 📦 **Microservices Architecture**: Independently deployable services
- 🚀 **Event-Driven**: Kafka for asynchronous communication
- 🎯 **Role-Based Access**: Admin, Courier, and Client roles
- 🔄 **Service Discovery**: Automatic service registration with Eureka
- 📊 **Centralized Logging**: Error tracking across all services

---

## System Overview

Courier-App is an enterprise-grade courier management system implemented using a modern microservices architecture.

It supports:

- **Admins**
- **Couriers**
- **Clients**

Architecture includes:

- React + TypeScript frontend
- Spring Boot microservices
- Spring Cloud Gateway
- Eureka Discovery
- RSA key rotation + JWT authentication
- Redis for key distribution, session metadata & caching
- Kafka event-driven communication
- MySQL persistence
- Makefile orchestration
- Docker Compose infrastructure service

This is a **true monorepo** - all code lives in a single repository without submodules.

---

## Repository Structure

```plaintext
courier-app/
│
├── courier-backend/                # Contains all backend microservices
|   ├── api-gateway/                # Spring Cloud Gateway
│   ├── auth-service/               # Authentication + RSA key generation + JWT cookies
│   ├── order-service/              # Order management
│   ├── user-service/               # User management (admin/courier/client)
│   ├── resource-service/           # Offices, branches, contacts
│   ├── error-service/              # Centralized error logging
│   ├── discovery-service/          # Eureka Service Registry
│   ├── .gitignore
│   └── docker-compose.yml          # Infrastructure stack (Kafka, Redis, MySQL, Zookeeper)
│
├── courier-frontend/               # React frontend application
│   └── README.md                   # Frontend setup instructions
├── package.json                    # Workspace root configuration
├── Makefile                        # Local orchestrator
└── README.md                       # Root README (this file)
```

---

## Microservices Overview

### **1. API Gateway (`api-gateway`)**

- Public-facing entry point for all requests
- Validates JWT using the public key loaded from Redis
- Routes traffic to backend microservices

---

### **2. Auth Service (`auth-service`)**

- Generating **RSA key pairs**
- Managing public/private key rotation
- Storing all key material safely in Redis
- Creating JWT access & refresh tokens
- Returning tokens via **HTTP-only cookies**
- Storing session and user metadata in Redis

#### Public Key Storage & Distribution

The `auth-service` uses Redis as the **single source of truth** for RSA key material:

- `RSA_KEYS:latest_public_key`  
  Stores the **current public key** used for JWT signature verification.

- `RSA_KEYS:public_keys_list`  
  Stores a **bounded list of recent public keys** for smooth key rotation.

- `RSA_KEYS:private_keys_map`  
  Maps `publicKey → privateKey`.  
  _Only `auth-service` uses this._  
  No other service ever sees private keys.

- `RSA_KEYS:auth_service_secret`  
  An internal secret used by the authentication server.

- `MAX_KEYS = 6`  
  Ensures only a limited history of keys is stored.  
  Oldest keys are automatically discarded (public + private) during rotation.

#### How Other Microservices Load the Public Key

1. On startup (or verification failure), a service loads the **latest public key** from Redis.
2. The service caches the public key in memory to avoid repeated Redis reads.
3. When `auth-service` rotates keys, the “latest” key in Redis changes.
4. Microservices detect this on the next refresh or verification failure and reload the updated key.

This approach ensures:

- Zero exposure of private keys
- Automatic propagation of new keys
- Consistent JWT verification across services

---

### **3. Discovery Service (`discovery-service`)**

- Eureka-based registry
- Tracks all running microservices
- Supports dynamic service lookup & load balancing

---

### **4. User Service (`user-service`)**

- Creating, updating, and disabling users
- Managing roles (admin, courier, client)
- Integrating with `resource-service` via Feign
- Synchronizing contact data for client users
- Business rules (e.g., office/branch assignments)
- Receiving tokens via cookies when calling resource-service

---

### **5. Resource Service (`resource-service`)**

- Offices
- Branches
- Contacts
- Searching (city, name, enabled branches)
- Role-restricted CRUD using `@PreAuthorize`
- Publishing errors to Kafka for the error-service
- JWT verification using the Redis-loaded public key

---

### **6. Order Service (`order-service`)**

- Order creation & updates
- Delivery status transitions
- Date validation (createdAt vs deliveryDate)
- Publishing order events to Kafka
- Caching order-related metadata in Redis

---

### **7. Error Service (`error-service`)**

- Kafka consumer for centralized error logging
- Persists error entries in MySQL
- Helps with cross-service debugging & observability

---

## Infrastructure

The backend stack includes:

| Service          | Port | Description                      |
| ---------------- | ---- | -------------------------------- |
| MySQL            | 3306 | Main database                    |
| Redis            | 6379 | Key/secret storage + token/cache |
| Kafka            | 9092 | Event streaming                  |
| Zookeeper        | 2181 | Kafka coordination               |
| Eureka           | 8761 | Service registry                 |
| API Gateway      | 8080 | Entry point                      |
| Auth Service     | 8088 | RSA keys + JWT issuing           |
| Order Service    | 8081 | Orders                           |
| Resource Service | 8083 | Offices, branches, contacts      |
| User Service     | 8084 | Users + roles                    |
| Error Service    | 8082 | Logging                          |

---

## Frontend (`courier-frontend`)

Built using:

- **React + TypeScript**
- **Redux Toolkit**
- **Axios**
- **Material UI + Bootstrap**
- **Vite**

Features include:

- Role-based UI (Admin, Courier, Client)
- Generic `ItemsContainer` system
- Advanced search filters + debounced text search
- Inline create forms
- Modal-based update forms
- Snackbar system based on `notistack`
- Clean architecture with adapters and business separation

---

## Setup and Installation

### Prerequisites

- **Node.js** and **npm** (for the frontend)
- **Java 17** (for the backend services)
- **Docker & Docker Compose** (installed and running)
- **Maven** (for building backend services)

---

### Clone the repository

```bash
git clone https://github.com/dmaman86/courier-app.git
cd courier-app
npm install
```

---

### Running the Application (Recommended)

The **Makefile is the main orchestrator** for running the entire system locally.

1. **Run EVERYTHING (infrastructure + backend + frontend)**:

   ```bash
   make start-all
   ```

   This executes, in order:
   - **Infrastructure** (Kafka, Redis, MySQL, Zookeeper)
   - **Discovery Service**
   - **API Gateway**
   - **All backend microservices**
   - **Frontend application**

2. **Stop the entire system**:

   ```bash
   make stop-all
   ```

   This stops:
   - Frontend
   - All backend microservices
   - Infrastructure containers

---

### Backend Setup (Makefile)

1. **Start infrastructure services**:

   ```bash
   make start-infra
   ```

2. **Start Discovery Service**:

   ```bash
   make start-discovery
   ```

3. **Start API Gateway**:

   ```bash
   make start-api-gateway
   ```

4. **Start all backend microservices**:

   ```bash
   make start-microservices
   ```

5. **Start a specific microservice**:
   ```bash
   make start-microservice SERVICE=auth-service
   ```

---

### Manual Backend Startup (Optional)

1. **Start infrastructure manually**:

   ```bash
   cd courier-backend
   docker-compose -f docker-compose-infra.yml up -d
   ```

2. **Start a microservice manually**:
   ```bash
   cd courier-backend/auth-service
   mvn spring-boot:run
   ```

Recommended order:

1. `discovery-service`
2. `api-gateway`
3. `auth-service`
4. `resource-service`
5. `user-service`
6. `order-service`
7. `error-service`

---

### Verify Backend Services

You can verify the services are running correctly by visiting the **Eureka Dashboard**:

```plaintext
http://localhost:8761/
```

All services should appear as **UP**.

---

### Frontend Setup (Makefile)

- **Start frontend**:

  ```bash
  make start-frontend
  ```

- **Stop frontend**:
  ```bash
  make stop-frontend
  ```

---

### Manual Frontend Startup (Optional)

```bash
cd courier-frontend
npm install
npm run dev
```

Frontend available at:

```plaintext
http://localhost:5173/courier-app/
```

---

## Note

- The full Dockerization of the project is not yet completed, except for the use of Kafka. Please follow the instructions above to run the project locally.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
