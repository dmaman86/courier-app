# Courier Auth Service

## **Description**

The `Courier Auth Service` is a micro-service responsible for handling **user authentication**
, **JWT token management**, and **secure communication** within the Courier ecosystem. It
integrates with `couier-user-service` via **OpenFeign** and synchronizes user data using
**Kafka events**.

---

## **Features**

- **JWT-based authentication (RSA encryption)**
- **Automatic key rotation every 2 months (Semaphore-controlled)**
- **Token refresh mechanism with stored refresh tokens**
- **Redis for secure key storage**
- **Spring Security for role-based access control**
- **Kafka for user synchronization**
- **Stateless authentication with HttpOnly cookies**
- **Exception handling & security filters**
- **Blacklist mechanism for disabled users**

---

## **Technologies**

| **Technology**              | **Purpose**                                         |
| --------------------------- | --------------------------------------------------- |
| **Spring Boot**             | Backend framework                                   |
| **Spring Security**         | Authentication & authorization                      |
| **JWT (RSA encryption)**    | Secure token management                             |
| **Kafka**                   | Event-driven user synchronization                   |
| **Redis**                   | Storage for authentication keys & blacklisted users |
| **Spring Data JPA (MySQL)** | Persistence layer                                   |
| **OpenFeign**               | Communication with `user-service`                   |

---

## **API Endpoints**

### 1. `api/auth/`

| HTTP Method | Endpoint       | Description                | Access |
| ----------- | -------------- | -------------------------- | ------ |
| `POST`      | `login`        | User login                 | Public |
| `POST`      | `set-password` | Set password for new users | Public |

### 2. `api/credentials/`

| HTTP Method | Endpoint         | Description                 | Access        |
| ----------- | ---------------- | --------------------------- | ------------- |
| `POST`      | `reset-password` | Change user password        | Authenticated |
| `POST`      | `logout`         | User logout                 | Authenticated |
| `POST`      | `refresh-token`  | Generate a new access token | Authenticated |

---

## **JWT Token Management**

- **Access Token**: Valid for **15 minutes**.
- **Refresh Token**: Valid for **7 days** and stored in the database.
- **Token Storage**: Stored in **HttpOnly** cookies for security.
- **RSA Key Rotations**: Automatically rotated every **2 months** using a **Semaphore-controlled system**.

---

## **Key Rotation Mechanism**

`Courier Auth Service` **automatically rotates RSA keys** every **2 months** to enhance security.
This process is controlled by a **`Semaphore`**, ensuring that only **one instance of key rotation runs at a time**.

| **Process**            | **Description**                                                 |
| ---------------------- | --------------------------------------------------------------- |
| **Scheduled Rotation** | Keys are regenerated **every 2 months** using `@Scheduled`.     |
| **Semaphore Control**  | Ensures that **only one process at a time** rotates the keys.   |
| **Redis Storage**      | New **public/private keys and API secret** are stored in Redis. |
| **Kafka Notification** | The **new public key** is sent to other services via Kafka.     |

### **How Key Rotation Works**

1. **Before rotating, the `Semaphore` checks if another rotation is in progress.**
2. **If no process is running, a new RSA key pair is generated.**
3. **Keys are saved in Redis and the `authServiceSecret` is updated.**
4. **A Kafka event is sent to update the keys in other services.**
5. **After a successful rotation, the `Semaphore` is released.**

---

## **Blacklist for Disabled Users**

To prevent disabled users from accessing the system, `Courier Auth Service` maintains a **blacklist** of user IDs in Redis.

| **Feature**              | **Description**                                         |
| ------------------------ | ------------------------------------------------------- |
| **Kafka Integration**    | Listens for `user-disabled` events from `user-service`. |
| **Redis Storage**        | Blacklisted user IDs are stored for **20 minutes**.     |
| **Scheduled Cleanup**    | Every **20 minutes**, expired entries are removed.      |
| **Security Enforcement** | Requests from blacklisted users are blocked.            |

### **How Blacklist Works**

1. When a user is disabled in `user-service`, an event is sent to Kafka (`user-disabled`).
2. `auth-service` listens to this event and **stores the user ID in Redis**.
3. Every **20 minutes**, a scheduled task removes expired entries.
4. When a request is made, `JwtAuthenticationFilter` **checks the blacklist** before authenticating the user.
5. **If a user is blacklisted, the request is rejected.**

---

## **Kafka Events**

`Courier Auth Service` listens to user-related events from `courier-user-service` and sends authentication updates.

| **Topic**       | **Payload**     | **Description**                                         |
| --------------- | --------------- | ------------------------------------------------------- |
| `user-created`  | `UserDto`       | Handles new user creation                               |
| `user-disabled` | `Long (userId)` | Adds users to Redis blacklist and delete credentials    |
| `public-key`    | `AuthInfoDto`   | Sends updated public key & API secret to other services |

---

## **Security & Filters**

- **JWT Authentication Filter:** Extracts and validates tokens from cookies.
- **API Key Validation:** Ensures secure communication between services.
- **Exception Handling Filter:** Manages authentication errors.
- **Blacklist Verification:** Blocks disabled users.

---

## **Setup & Running the Service**

### **Clone the repository**

```sh
git clone https://github.com/dmaman86/courier-auth-service.git
cd courier-auth-service
```

### **Configure environment variables**

- Set up **Kafka**, **Redis**, and **MySQL** connections.

### **Build the project**

```sh
mvn clean install
```

### **Run the service**

```sh
mvn spring-boot:run
```

---

## **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
