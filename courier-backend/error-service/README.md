# Courier Error Service

The **Courier Error-Service** is part of the **Courier App** system and is responsible for receiving, processing, and storing error logs sent from other microservices via **Kafka**. All received errors are stored in the database for later analysis.

---

## Features

- Listens for error messages from the Kafka topic `error-topic`.
- Maps received error logs and persists them in the database.

---

## Technologies Used

- Java 17
- Spring Boot
- Spring Kafka
- Spring Data JPA
- MySQL
- Docker (optional)

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/dmaman86/courier-error-service.git
cd courier-error-service
```

### 2. Configure Environment Variables

Create an `application.yml` file and ensure the following configurations are configured:

```yml
spring:
  application:
    name: error-service
  datasource:
    url: jdbc:mysql://localhost:3306/error_db?createDatabaseIfNotExist=true&serverTimezone=UTC
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
      group-id: error-service-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"

server:
  port: 8082

eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    hostname: error-service
```

### 3. Build the Project

Run the following command to build the project:

```bash
./mvnw clean install
```

### 4. Run the Error Service

Start the service using:

```bash
./mvnw spring-boot:run
```

---

## Kafka Configuration

This service listens for error logs from the `error-topic` Kafka topic.

### Example of JSON message sent from another service:

```json
{
  "timestamp": "2025-02-22T18:45:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "exception": "org.springframework.security.access.AccessDeniedException",
  "path": "/api/courier/office/update"
}
```

---

## Project Structure

```
courier-error-service/
│
├── src/
│   ├── main/
│   │   ├── java/com/courier/errorservice/
│   │   │   ├── config/          # KafkaConsumerConfig
│   │   │   ├── listener/        # ErrorLogListener
│   │   │   ├── objects/
│   │   │   │   ├── dto/         # ErrorLogDto
│   │   │   │   ├── entity/      # ErrorLog entity
│   │   │   │   ├── mapper/      # ErrorLogMapper
│   │   │   ├── repository/      # Database access layer
│   ├── pom.xml                  # Project dependencies
│
├── README.md
├── LICENSE.md
```

---

## Useful Commands

### Check Kafka Status

```bash
docker-compose ps # If using Docker
```

### Build All Modules

```bash
./mvnw clean install
```

### Run Error Service

```bash
./mvnw spring-boot:run
```

---

## Error Logging

The errors are stored in the `error_logs` table with the following schema:

| ID  | Timestamp           | Status | Error     | Message       | Exception                                                 | Path                       |
| --- | ------------------- | ------ | --------- | ------------- | --------------------------------------------------------- | -------------------------- |
| 1   | 2025-02-22T18:45:00 | 403    | Forbidden | Access denied | org.springframework.security.access.AccessDeniedException | /api/courier/office/update |

---

## License

This project is licensed under the [LICENSE.md](LICENSE.md).

