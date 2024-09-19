# Error-Server

## Overview
The **Error Server** is a microservice designed to handle and log application-level errors. It listens to error messages sent over Kafka and stores the error logs in a database for future analysis and monitoring.

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

1. **Clone the repository** and navigate to the `Error Server` directory.
    ```bash
    git clone https://github.com/dmaman86/courier-app.git
    cd courier-app/courier-backend/error-server
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
    - **Build and run:** Navigate to server directory: `error-server` and run:
        ```bash
        mvn spring-boot:run
        ```

### Key Configuration Details

- **MySQL Database**:
  - The application connects to a MySQL database named `errordb`. If the database doesn't exist, it will be created automatically.
  - Default credentials: `root` / `root-workbench`
  
- **Kafka Configuration**:
  - The application sends and receives messages using Kafka, with the Kafka server running at `localhost:9092`.
  - The producer uses `StringSerializer` for the key and `JsonSerializer` for the value to send data.
  - The consumer belongs to the `error-log-group` group, which listens to messages from the Kafka topic.

## Endpoints
The Error Server doesn't expose any public REST endpoints. It listens to messages from Kafka and interacts with the database for error logging.

## Error-Server Structure:
```bash
.
├── Dockerfile                  # Docker setup for containerization
├── HELP.md                     # Standard Spring Boot help documentation
├── mvnw                        # Maven wrapper for Unix systems
├── mvnw.cmd                    # Maven wrapper for Windows systems
├── pom.xml                     # Project Object Model (POM) file for Maven dependencies and configuration
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── david
    │   │           └── maman
    │   │               └── errorserver
    │   │                   ├── ErrorServerApplication.java         # Main Spring Boot application class
    │   │                   ├── models
    │   │                   │   ├── dto
    │   │                   │   │   └── ErrorLogDto.java            # Data transfer object for error logs
    │   │                   │   └── entity
    │   │                   │       └── ErrorLog.java               # Entity class representing error logs
    │   │                   ├── repositories
    │   │                   │   └── ErrorLogRepository.java         # Repository interface for database interactions
    │   │                   └── services
    │   │                       └── KafkaErrorLogListener.java      # Service listening to Kafka for error messages
    │   └── resources
    │       └── application.yml             # Application configuration (database, Kafka, etc.)
    └── test
        └── java
            └── com
                └── david
                    └── maman
                        └── errorserver
                            └── ErrorServerApplicationTests.java
```