# Primes-Server

## Overview
The `Primes-Server` is responsible for generating two distinct primes numbers **(p, q)** using the **Rabin-Miller algorithm**. It sends the product of these prime numbers **(n = p * q)** and the **φ(n)** of the product to the `Authentication-Server` via **Kafka** messaging.

## Setup

### Prerequisites
- **Java 17** (Install using Homebrew: `brew install openjdk@17`)
- **Docker** and **Docker Compose** (Required for running Kafka and other dependecies)
- **MySQL 8.0** or higher (You can also run MySQL in Docker if preferred)

    If you don't have MySQL installed, you can install it via Homebrew:
    ```bash
    brew install mysql
    ```
    Or run it with Docker:
    ```bash
    docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root-workbench -d -p 3306:3306 mysql:8.0
    ```
- **Kafka**: Kafka is a key part of the backend, and you will need to run it using Docker.

### Running the Application

1. **Clone the repository** and navigate to the `Primes-Server` directory.
    ```bash
    git clone https://github.com/dmaman86/courier-app.git
    cd courier-app/courier-backend/primes-server
    ```

2. **Configure the enviroment**
    - Update the database connection details in `./src/main/resources/application.yml`:
        ```yaml
        spring:
        datasource:
            username: your_db_username
            password: your_db_password
        ```

3. **Run the application**

    - **Start necessary services**: Use Docker to start Kafka services, navigate to directory `courier-backend` and run:
        ```bash
        docker-compose up --build -d
        ```
    - **Build and run:** Navigate to server directory: `primes-server` and run:
        ```bash
        mvn spring-boot:run
        ```

### Key Configuration Details

- **MySQL Database**:
  - The application connects to a MySQL database named `primesdb`. If the database doesn't exist, it will be created automatically.
  - Default credentials: `root` / `root-workbench`
  
- **Kafka Configuration**:
  - The application sends and receives messages using Kafka, with the Kafka server running at `localhost:9092`.
  - The producer uses `StringSerializer` for the key and `JsonSerializer` for the value to send data.
  - The consumer belongs to the `primes-consumer` group, which listens to messages from the Kafka topic.

## Endpoints
The Primes Server doesn't expose any public REST endpoints. It listens to messages from Kafka and interacts with the database.

## Primes-Server Structure:
```bash
.
├── Dockerfile
├── HELP.md
├── README.md
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── david
    │   │           └── maman
    │   │               └── primesserver
    │   │                   ├── PrimesServerApplication.java
    │   │                   ├── configurations
    │   │                   │   └── KafkaProviderConfig.java
    │   │                   ├── listeners
    │   │                   │   └── PrimeProductListener.java
    │   │                   ├── models
    │   │                   │   ├── dto
    │   │                   │   │   └── PrimeProductDto.java
    │   │                   │   └── entities
    │   │                   │       └── PrimeProduct.java
    │   │                   ├── repositories
    │   │                   │   └── PrimeProductRepository.java
    │   │                   └── services
    │   │                       └── PrimeProductService.java
    │   └── resources
    │       └── application.yml
    └── test
        └── java
            └── com
                └── david
                    └── maman
                        └── primesserver
                            └── PrimesServerApplicationTests.java
```