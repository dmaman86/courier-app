# Courier API Gateway

This micro-service serves as the API Gateway for the **courier-app** system. Built using **Spring Cloud Gateway**, it functions as the central entry point for all other micro-services, handling routing and load balancing by forwarding incoming requests to the appropriate service.

## Key Features

- Centralized API routing and request forwarding.
- Load balancing and request filtering.
- **JWT validation and security enforcement.**
- **User blacklist management (Redis).**
- **Real-time security event processing (Kafka).**

## Technologies Used

- Java 17
- Spring Boot
- Spring Cloud Gateway
- Kafka (Event-driven security alerts)
- Redis (User blacklist)
- Maven

## Prerequisites

- Java 17 installed.
- **Kafka must be running** since the backend depends on it for security event processing.
- **Redis must be running** to store JWT validation keys and manage the user blacklist.
- MySQL is not required for this service.

## Installation and Running

1. Clone the repository:

   ```bash
   git clone https://github.com/dmaman86/courier-api-gateway.git
   cd courier-api-gateway
   ```

2. Build the project:

   ```bash
   mvn clean install
   ```

3. Run the service:

   ```bash
   mvn spring-boot:run
   ```

The API Gateway will be available at: [http://localhost:8080](http://localhost:8080)

## Security and Token Validation

The API Gateway performs several security-related checks before forwarding requests:

1. **JWT Validation**

   - Extracts tokens from cookies.
   - Verifies the token signature using the public key stored in Redis.
   - Extracts and validates claims (user ID, IP, User-Agent).

2. **Blacklist Enforcement**

   - Users flagged for suspicious activity are **added to a Redis blacklist**.
   - Requests from blacklisted users are rejected automatically.

3. **Suspicious Activity Detection**

   - If a token is **used from a different IP or User-Agent**, the user is blacklisted.
   - An alert is sent to `error-service` via Kafka.

4. **Security Event Processing (Kafka)**
   - All security alerts are published to Kafka (`error-topic`).
   - Blacklisted users are notified to all microservices via `user-disabled` Kafka topic.

## Routing Configuration

The routing configuration is defined in the `GatewayConfig` class instead of the `application.yml` file.  
This includes **rate limiting (Redis), token validation, and security event handling**.

```java
@Configuration
public class GatewayConfig {

  @Bean
  public RouteLocator routes(RouteLocatorBuilder builder, RedisRateLimiter redisRateLimiter) {
    return builder
        .routes()
        .route(
            "auth-service",
            r ->
                r.path("/api/auth/**", "/api/credential/**")
                    .filters(
                        f ->
                            f.requestRateLimiter(
                                c ->
                                    c.setRateLimiter(redisRateLimiter)
                                        .setKeyResolver(ipKeyResolver())))
                    .uri("lb://courier-auth-service"))
        .route(
            "user-service",
            r ->
                r.path("/api/user/**")
                    .filters(
                        f ->
                            f.requestRateLimiter(
                                c ->
                                    c.setRateLimiter(redisRateLimiter)
                                        .setKeyResolver(ipKeyResolver())))
                    .uri("lb://courier-user-service"))
        .route(
            "resource-service",
            r ->
                r.path("/api/resource/**")
                    .filters(
                        f ->
                            f.requestRateLimiter(
                                c ->
                                    c.setRateLimiter(redisRateLimiter)
                                        .setKeyResolver(ipKeyResolver())))
                    .uri("lb://courier-resource-service"))
        .build();
  }

  @Bean
  public KeyResolver ipKeyResolver() {
    return exchange ->
        Mono.just(exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
  }

  @Bean
  public RedisRateLimiter redisRateLimiter() {
    return new RedisRateLimiter(10, 20);
  }
}
```

## License

This project is licensed under the [MIT License](LICENSE).
