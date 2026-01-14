# Courier Discovery Service (Eureka Server)

This microservice acts as a discovery server using **Spring Cloud Eureka**. Its main function is to register and monitor other microservices within the ecosystem, enabling efficient communication between services.

## Key Features

- Service registration and discovery.
- Automatic status updates for registered services.
- Monitoring of the status of connected microservices.

## Technologies Used

- Java 17
- Spring Boot
- Spring Cloud Netflix Eureka
- Maven

## Prerequisites

- Java 17 installed.
- Kafka must be running since the backend depends on it.
- MySQL is not required for this service.

## Installation and Running

1. Clone the repository:

   ```bash
   git clone https://github.com/dmaman86/courier-service-discovery.git
   cd courier-service-discovery
   ```

2. Build the project:

   ```bash
   mvn clean install
   ```

3. Run the service:

   ```bash
   mvn spring-boot:run
   ```

The Eureka server will be available at: [http://localhost:8761](http://localhost:8761)

## Basic Configuration (`application.yml`)

```yaml
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false
```

## Usage

- Microservices should register with this server using the `eureka.client.service-url.defaultZone` property.
- The server provides a web interface to monitor the status of registered services.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).