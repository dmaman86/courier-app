# Courier Resource Service

The **Resource Service** is a micro-service responsible for managing offices, branches, and contacts within the courier application. It handles business logic related to office operations,
including creating, updating, disabling, and retrieving data about offices, branches, and contacts.

---

## Features

- **Office Management**: Create, update, and retrieve office information.
- **Branch Management**: Handle branch-related operations linked to offices.
- **Contact Management**: Manage contacts associated with branches and offices.
- **Security**: JWT-based authentication and role-based access control.
- **Kafka Integration**: Listens for public key updates and sends error logs to `error-service`.

---

## Technologies

- **Java 17**
- **Spring Boot 3**
- **Spring Security**
- **Spring Data JPA** (with MySQL)
- **Spring Cloud (Eureka, OpenFeign)**
- **Lombok**
- **MapStruct** for DTO mapping
- **JWT (JSON Web Token)**
- **Kafka**
- **Redis**

---

### Prerequisites

Ensure you have the following installed:

- Docker (for running Kafka)
- Java 17
- Maven
- MySQL running locally

---

### **Running Kafka with Docker**

1. **Start Kafka and Zookeeper:**

```bash
docker run -d --name zookeeper -p 2181:2181 zookeeper

docker run -d --name kafka -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 --network="host" wurstmeister/kafka
```

2. **Verify Kafka is running:**

```bash
docker ps
```

---

## API Endpoints

### Office Endpoints

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| POST   | `/api/resource/office/base`   | Create an office                   |
| POST   | `/api/resource/office`        | Create an office with branches     |
| GET    | `/api/resource/office/{id}`   | Get office details                 |
| GET    | `/api/resource/office/all`    | Get all offices without pagination |
| PUT    | `/api/resource/office/{id}`   | Update an office                   |
| DELETE | `/api/resource/office/{id}`   | Disable an office                  |
| GET    | `/api/resource/office/search` | Search offices                     |

### Branch Endpoints

| Method | Endpoint                                 | Description                         |
| ------ | ---------------------------------------- | ----------------------------------- |
| POST   | `/api/resource/branch`                   | Create a branch                     |
| GET    | `/api/resource/branch/{id}`              | Get branch details                  |
| GET    | `/api/resource/branch/all`               | Get all branches without pagination |
| GET    | `/api/resource/branch/office/{officeId}` | Get branches by office              |
| PUT    | `/api/resource/branch/{id}`              | Update a branch                     |
| DELETE | `/api/resource/branch/{id}`              | Disable a branch                    |
| GET    | `/api/resource/branch/search`            | Search branches                     |

### Contact Endpoints

| Method | Endpoint                                    | Description            |
| ------ | ------------------------------------------- | ---------------------- |
| POST   | `/api/resource/contact`                     | Create a contact       |
| GET    | `/api/resource/contact/{id}`                | Get contact details    |
| GET    | `/api/resource/contact/phone/{phoneNumber}` | Get contact by phone   |
| PUT    | `/api/resource/contact/{id}`                | Update a contact       |
| DELETE | `/api/resource/contact/{id}`                | Disable a contact      |
| POST   | `/api/resource/contact/enable`              | Enable a contact       |
| GET    | `/api/resource/contact/search`              | Search contacts        |
| GET    | `/api/resource/contact/office/{officeId}`   | Get contacts by office |
| GET    | `/api/resource/contact/branch/{branchId}`   | Get contacts by branch |

---

## Security

- Authentication is handled via JWT tokens.
- Redis is used to store a blacklist of disabled users, preventing them from accessing the system.
- Only users with `ROLE_ADMIN` can create, update, and delete offices, branches, and contacts.
- Security filters validate JWT tokens and extract user roles from them.

## Kafka Integration

- Listens for public key updates from `auth-service`.
- Sends error logs to `error-service` via Kafka.

---

### Running the Service

1. Clone the repository:

   ```sh
   git clone https://github.com/dmaman86/courier-resource-service.git
   ```

2. Navigate to the project directory:

   ```sh
   cd courier-resource-service
   ```

3. Configure the database and Redis settings in `application.yml`:

```yml
spring:
  application:
    name: courier-resource-service

  datasource:
    url: jdbc:mysql://localhost:3306/resource_db?useSSL=false&createDatabaseIfNotExist=true&serverTimezone=UTC
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: resource-service-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*" # Allow all packages to be deserialized
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.StringSerializer

  redis:
    host: localhost
    port: 6379

  cloud:
    openfeign:
      client:
        config:
          default:
            connectTimeout: 5000
            readTimeout: 5000
            loggerLevel: full
      circuitbreaker:
        enabled: true

server:
  port: 8083

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    fetch-registry: true
    register-with-eureka: true

  instance:
    hostname: courier-resource-service
```

4. Build & Run the application:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
