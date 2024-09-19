# Courier-App 

This project is a **courier management system** that allows admins, couriers, and clients to manage deliveries and orders. It is divided into two main components: **courier-backend** and **courier-frontend**, where each handles different aspects of the system.

## Project Structure
```
courier-app/
│
├── courier-backend/                # Contains all backend microservices
│   ├── authentication-server/      # Authentication service
│   ├── courier-server/             # Manages orders and couriers
│   ├── error-server/               # Logs and handles errors
│   ├── primes-server/              # Prime number generation for encryption keys
│   ├── service-registry            # Eureka Service Registry for microservice discovery
│   ├── spring-cloud-gateway        # API Gateway for routing requests   
│   ├── .gitignore
│   ├── docker-compose.yml
│
├── courier-frontend/               # React frontend application
│   └── README.md                   # Frontend setup instructions
│
└── README.md                       # Root README (this file)
```

## Overview
- **Backend:** The backend consists of several microservices, each responsible for a specific part of the system (authentication, order management, error handling, etc.). The services via REST APIs and use Kafka for asynchronous messaging.
- **Frontend:** The frontend is a React-based application that interacts with the backend through Axios to provide a user-friendly interface for different roles (admins, couriers, and clients).

## Technologies Used

- **Backend:**
    - **Spring Boot** for the microservices
    - **Spring Cloud** for service discovery and API gateway
    - **Eureka** for service discovery
    - **Kafka** for inter-service communication
    - **MySQL** as the database
    - **Docker Compose** for managing services locally
    - **JWT** for authentication and token management

- **Frontend:**
    - **React** and **TypeScript** for the user interface
    - **Redux** for the state management
    - **Axios** for API requests
    - **Bootstrap** and **Material UI** for styling and responsive design components

## Setup and Installation

### Prerequisites
- **Node.js** and **npm** (for the frontend)
- **Java 17** (for the backend)
- **Docker** (to run services with Docker Compose)

### Running the Application
1. **Clone the repository**
```bash
    git clone https://github.com/dmaman86/courier-app.git
    cd courier-app
```
### Backend

Each backend microservice has its own README that details the specific setup.
Below are the general instructions for running all services together.

#### 1. Start Backend Services with Docker Compose (feature, not yet completed)
   In the `courier-backend` directory, Docker Compose is configured to spin up all microservices, databases, and message brokers.

   ```bash
   cd courier-backend
   docker-compose up --build
   ```

   This will launch:
   - **Authentication-Server** on port `8088`
   - **Courier-Server** on port `8081`
   - **Error-Server** on port `8082`
   - **Primes-Server** on port `8090`
   - **Service-Registry** on port `8761`
   - **Spring-Cloud-Gatewat** on port `8080`
   - **Kafka** for messaging

   **Note**: You can check the individual README files in each service for more detailed instructions.

#### 2. Verify Backend Services
You can verify the services are running correctly by visiting the **Eureka Dashboard**:
```
http://localhost:8761/
```

### Frontend
1. **Navigate to the frontend directory**:
```bash
cd courier-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the frontend**:
```bash
npm run dev
```
This will start the application on `http://localhost:5173/courier-app/`.

## Services Overview

### Authentication Server
Handles user login, registration, and token management (JWT).
- **Port**: `8088`
- **Technology**: Spring Boot
- **Key Features**: JWT-based authentication, refresh tokens, user roles management.

### Courier Server
Manages the creation, updating, and tracking of courier orders.
- **Port**: `8081`
- **Technology**: Spring Boot
- **Key Features**: Order creation, status updates, assignment to couriers.

### Error Server
Handles logging and management of application-level errors.
- **Port**: `8082`
- **Technology**: Spring Boot
- **Key Features**: Centralized error logging and management.

### Primes Server
Generates primes numbers and calculates encryption keys for signing tokens.
- **Port**: `8090`
- **Technology**: Spring Boot
- **Key Features**: Prime number generation and RSA key creation for token signing.

### Service Registry
Manages microservice discovery using Eureka.
- **Port**: `8761`
- **Technology**: Spring Boot, Eureka
- **Key Features**: Registers all microservices and provides service discovery for inter-service communication.

### Spring Cloud Gateway
API Gateway that routes requests to the appropriate microservices.
- **Port**: `8080`
- **Technology**: Spring Boot, Spring Cloud Gateway
- **Key Features**: Load balancing, routing, security, and monitoring.

## Note
- The full Dockerization of the project is not yet completed, except for the use of Kafka. Please follow the instructions above to run the project locally.

## Contributing
Contributions are welcome! Please create a pull request or open an issue to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

