# Courier User Service

## Description

The **Courier User Service** is a micro-service responsible for managing users and roles in the `Courier system`. It provides APIs for creating, updating, deleting, and retrieving user information. This service communicates with others services via `OpenFeign` and `Kafka`, and uses `JWT` for authentication and authorization.

---

## Features

- **User Management**: Create, update, delete, and retrieve user information.
- **Role Management**: Create, update, delete, and retrieve role information.
- **Client Integration**: Users with the `client` role are linked to contacts in `courier-resource-service`.
- **Security**: Uses `JWT` authentication for secure API access.
- **User Blacklist**: Deleted users are added to a Redis blacklist to prevent further access while logged in.
- **Kafka Notifications**: Notifies `courier-auth-service` when a user is created or deleted.
- **API Key Authentication**: The endpoint `/api/user/find-by-email-or-phone` requires an API key for access.
- **Service Discovery**: Registers with `Eureka` for service discovery.
- **Error Handling**: Errors sent to `courier-error-service` for logging, include a severity level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) based on the exception type.

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

## Project Structure

```
user-service/
├── src/main/java/com/courier/userservice/
│   ├── config/                   # Security and FeignClient configuration
│   ├── controller/               # REST controllers
│   ├── exception/                # Global exception handlers
│   ├── feignclient/              # Feign clients for external service communication
│   ├── manager/                  # Business logic management
│   ├── objects/
│   │   ├── criteria/             # Query criteria specifications
│   │   ├── dto/                  # Data Transfer Objects (DTOs)
│   │   ├── entity/               # JPA Entities
│   │   ├── mapper/               # DTO to entity mapping
│   ├── repository/               # JPA repositories
│   ├── service/
│   │   ├── impl/                 # Service implementations
│   │   ├── ErrorLogService.java  # Service for error logging
│   │   ├── JwtService.java       # Service for JWT handling
│   │   ├── PublicKeyService.java # Service for public key handling
│   │   ├── RoleService.java      # Service for role management
│   │   ├── UserService.java      # Main user service logic
│   ├── CourierUserServiceApplication.java  # Main application class
└── ...
```

---

## Authentication & Security

This service uses `JWT` for authentication and authorization.

- The `JwtAuthenticationFilter` extracts the token from cookies and validates authentication.
- Permissions are managed via `@PreAuthorize` in controllers.
- The authenticated user details can be accessed using `authentication.princial`.

---

## Integration with `resource-service`

`Courier user service` communicates with the `courier-resource-service` for managing `client` using `OpenFeign`.

```java
@FeignClient(name = "courier-resource-service", configuration = FeignClientConfig.class)
public interface ResourceFeignClient {

  @PostMapping("/api/courier/resource/contact")
  ContactDto createContact(@RequestBody ContactDto contactDto);

  @PostMapping("/api/courier/resource/contact/{id}")
  ContactDto updateContact(@PathVariable Long id, @RequestBody ContactDto contactDto);

  @DeleteMapping("/api/courier/resource/contact/{id}")
  void disableContact(@PathVariable Long id);

  @PostMapping("/api/courier/resource/contact/enable")
  ContactDto enableContact(@RequestBody ContactDto contactDto);

  @GetMapping("/api/courier/resource/contact/phone/{phoneNumber}")
  ContactDto getContactByPhone(@PathVariable String phoneNumber);
}
```

---

## Key Endpoints

### User Endpoints

| Method | Endpoint                           | Description                                                    | Access                                             |
| ------ | ---------------------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| GET    | `/api/user`                        | Retrieve paginated users                                       | `ROLE_ADMIN`                                       |
| GET    | `/api/user/all`                    | Retrieve all users                                             | `ROLE_ADMIN`                                       |
| GET    | `/api/user/{userId}`               | Retrieve user details                                          | `ROLE_ADMIN`, `ROLE_COURIER`, `ROLE_CLIENT` (self) |
| POST   | `/api/user`                        | Create a new user                                              | `ROLE_ADMIN`                                       |
| PUT    | `/api/user/{userId}`               | Update user details                                            | `ROLE_ADMIN`                                       |
| DELETE | `/api/user/{userId}`               | Disable a user (adds to blacklist and notifies `auth-service`) | `ROLE_ADMIN`                                       |
| GET    | `/api/user/find-by-email-or-phone` | Retrieve user by email or phone (requires API Key)             | Public                                             |
| GET    | `/api/user/search`                 | Search users with pagination                                   | `ROLE_ADMIN`                                       |

### Role Endpoints

| Method | Endpoint                  | Description                                       | Access       |
| ------ | ------------------------- | ------------------------------------------------- | ------------ |
| GET    | `/api/user/role/all`      | Retrieve all roles                                | `ROLE_ADMIN` |
| GET    | `/api/user/role/{roleId}` | Retrieve role details                             | `ROLE_ADMIN` |
| POST   | `/api/user/role`          | Create a new role                                 | `ROLE_ADMIN` |
| PUT    | `/api/user/role/{roleId}` | Update role details                               | `ROLE_ADMIN` |
| DELETE | `/api/user/role/{roleId}` | Disable a role (if not assigned as the only role) | `ROLE_ADMIN` |

---

## Client Handling

- When a user with `ROLE_CLIENT` is created, a corresponding contact is created in `resource-service`.
- If a `CLIENT` role is removed, the contact is disabled in `resource-service`.
- If `resource-service` fails during client deletion, `user-service` sends a `CRITICAL` severity error to `error-service` for manual handling.

## Security

- **JWT-based authentication**: Uses a token extracted from cookies.
- **User Blacklist**: Deleted users are added to Redis blacklist and blocked at authentication level.
- **API Key Authentication**: Requests to `/api/user/find-by-email-or-phone` require a valid API key.
- **Role-based access control**: Enforced using `@PreAuthorize` annotations.

## Kafka Integration

- Sends error logs to `error-service`, including severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) based on the exception type.
- Listens for public key updates from `auth-service`.
- Notifies `auth-service` when a user is created or deleted.
- Sends `CRITICAL` severity error to `error-service` if `resource-service` fails during client deletion.

## Filters

- **JwtAuthenticationFilter**: Extracts and validates JWT from cookies, checks if the user is blacklisted.
- **ApiKeyFilter**: Validates API Key for requests to `/api/user/find-by-email-or-phone`.
- **ExceptionHandlerFilter**: Catches and processes exceptions globally.

---

## Environment Variables Configuration

```yml
spring:
  application:
    name: courier-user-service

  datasource:
    url: jdbc:mysql://localhost:3306/user_db?useSSL=false&createDatabaseIfNotExist=true&serverTimezone=UTC
    username: root
    password: root-workbench
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
      group-id: user-service-group
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
  port: 8084

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    fetch-registry: true
    register-with-eureka: true

  instance:
    hostname: courier-user-service
```

---

## Setup & Running

### Prerequisites

- Java 17
- MySQL
- Kafka running for event handling.
- Redis for user blacklist.
- Eureka server running for service discovery.

### Clone the Repository

```sh
git clone https://github.com/dmaman86/courier-user-service.git
cd courier-user-service
```

### Build and Run

```sh
mvn clean install
mvn spring-boot:run
```

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
