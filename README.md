# Courier Fullstack Project

This project includes a backend developed with Spring Boot Cloud, Eureka, API Gateway, and Kafka, and a frontend developed with React and TypeScript.

## Backend Structure:

```plaintext
.
├── authentication-server
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── david
│       │   │           └── maman
│       │   │               └── authenticationserver
│       │   │                   ├── AuthenticationServerApplication.java
│       │   │                   ├── configuration
│       │   │                   │   ├── ExceptionHandlerFilter.java
│       │   │                   │   ├── JwtAuthenticationFilter.java
│       │   │                   │   └── security
│       │   │                   │       ├── ApplicationConfig.java
│       │   │                   │       ├── KafkaProducerConfig.java
│       │   │                   │       └── SecurityConfiguration.java
│       │   │                   ├── controllers
│       │   │                   │   └── AuthController.java
│       │   │                   ├── exceptions
│       │   │                   │   ├── GlobalExceptionsHandler.java
│       │   │                   │   └── TokenValidationException.java
│       │   │                   ├── helpers
│       │   │                   │   ├── CustomUserDetails.java
│       │   │                   │   ├── TokenType.java
│       │   │                   │   └── UserDetailsServiceImpl.java
│       │   │                   ├── models
│       │   │                   │   ├── dto
│       │   │                   │   │   ├── AuthResponse.java
│       │   │                   │   │   ├── ErrorLogDto.java
│       │   │                   │   │   ├── LoginDto.java
│       │   │                   │   │   ├── PrimeProductDto.java
│       │   │                   │   │   ├── RSAKeyManager.java
│       │   │                   │   │   └── UserCredentialsPassword.java
│       │   │                   │   └── entities
│       │   │                   │       ├── Role.java
│       │   │                   │       ├── Token.java
│       │   │                   │       ├── User.java
│       │   │                   │       └── UserCredentials.java
│       │   │                   ├── repositories
│       │   │                   │   ├── RoleRepository.java
│       │   │                   │   ├── TokenRepository.java
│       │   │                   │   ├── UserCredentialsRepository.java
│       │   │                   │   └── UserRepository.java
│       │   │                   └── services
│       │   │                       ├── AuthService.java
│       │   │                       ├── ConsumerListenerService.java
│       │   │                       ├── ErrorLogService.java
│       │   │                       ├── JwtKeyService.java
│       │   │                       ├── JwtService.java
│       │   │                       ├── RoleService.java
│       │   │                       ├── UserCredentialsService.java
│       │   │                       └── impl
│       │   │                           ├── AuthServiceImpl.java
│       │   │                           └── JwtServiceImpl.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── java
│               └── com
│                   └── david
│                       └── maman
│                           └── authenticationserver
│                               └── AuthenticationServerApplicationTests.java
├── courier-server
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── david
│       │   │           └── maman
│       │   │               └── courierserver
│       │   │                   ├── CourierServerApplication.java
│       │   │                   ├── configuration
│       │   │                   │   ├── AuthFilter.java
│       │   │                   │   ├── ExceptionHandlerFilter.java
│       │   │                   │   └── security
│       │   │                   │       ├── KafkaProviderConfig.java
│       │   │                   │       └── SecurityConfig.java
│       │   │                   ├── controllers
│       │   │                   │   ├── BranchController.java
│       │   │                   │   ├── ContactController.java
│       │   │                   │   ├── OfficeController.java
│       │   │                   │   ├── RoleController.java
│       │   │                   │   ├── StatusController.java
│       │   │                   │   └── UserController.java
│       │   │                   ├── exceptions
│       │   │                   │   ├── GlobalExceptionsHandler.java
│       │   │                   │   ├── PublicKeyNotAvailableException.java
│       │   │                   │   └── TokenValidationException.java
│       │   │                   ├── helpers
│       │   │                   │   ├── CustomUserDetails.java
│       │   │                   │   ├── IdExtractor.java
│       │   │                   │   ├── SearchByDate.java
│       │   │                   │   ├── SearchByDateRange.java
│       │   │                   │   ├── SearchFunction.java
│       │   │                   │   └── StateEnum.java
│       │   │                   ├── models
│       │   │                   │   ├── criteria
│       │   │                   │   ├── dto
│       │   │                   │   │   ├── BranchDto.java
│       │   │                   │   │   ├── ClientDto.java
│       │   │                   │   │   ├── ContactDto.java
│       │   │                   │   │   ├── ErrorLogDto.java
│       │   │                   │   │   ├── OfficeDto.java
│       │   │                   │   │   ├── RoleDto.java
│       │   │                   │   │   ├── StatusDto.java
│       │   │                   │   │   └── UserDto.java
│       │   │                   │   └── entities
│       │   │                   │       ├── Branch.java
│       │   │                   │       ├── Contact.java
│       │   │                   │       ├── Office.java
│       │   │                   │       ├── Role.java
│       │   │                   │       ├── Status.java
│       │   │                   │       └── User.java
│       │   │                   ├── repositories
│       │   │                   │   ├── BranchRepository.java
│       │   │                   │   ├── ContactRepository.java
│       │   │                   │   ├── OfficeRepository.java
│       │   │                   │   ├── RoleRepository.java
│       │   │                   │   ├── StatusRepository.java
│       │   │                   │   └── UserRepository.java
│       │   │                   └── services
│       │   │                       ├── BranchService.java
│       │   │                       ├── ContactService.java
│       │   │                       ├── ErrorLogService.java
│       │   │                       ├── JwtService.java
│       │   │                       ├── JwtValidationService.java
│       │   │                       ├── KafkaProducerService.java
│       │   │                       ├── OfficeService.java
│       │   │                       ├── RoleService.java
│       │   │                       ├── StatusService.java
│       │   │                       ├── UserService.java
│       │   │                       └── impl
│       │   │                           ├── BranchServiceImpl.java
│       │   │                           ├── ContactServiceImpl.java
│       │   │                           ├── JwtServiceImpl.java
│       │   │                           ├── OfficeServiceImpl.java
│       │   │                           ├── RoleServiceImpl.java
│       │   │                           ├── StatusServiceImpl.java
│       │   │                           └── UserServiceImpl.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── java
│               └── com
│                   └── david
│                       └── maman
│                           └── courierserver
│                               └── CourierServerApplicationTests.java
├── docker-compose.yml
├── error-server
│   ├── Dockerfile
│   ├── HELP.md
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── david
│       │   │           └── maman
│       │   │               └── errorserver
│       │   │                   ├── ErrorServerApplication.java
│       │   │                   ├── models
│       │   │                   │   ├── dto
│       │   │                   │   │   └── ErrorLogDto.java
│       │   │                   │   └── entity
│       │   │                   │       └── ErrorLog.java
│       │   │                   ├── repositories
│       │   │                   │   └── ErrorLogRepository.java
│       │   │                   └── services
│       │   │                       └── KafkaErrorLogListener.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── java
│               └── com
│                   └── david
│                       └── maman
│                           └── errorserver
│                               └── ErrorServerApplicationTests.java
├── primes-server
│   ├── Dockerfile
│   ├── HELP.md
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── david
│       │   │           └── maman
│       │   │               └── primesserver
│       │   │                   ├── PrimesServerApplication.java
│       │   │                   ├── configurations
│       │   │                   │   └── KafkaProviderConfig.java
│       │   │                   ├── listeners
│       │   │                   │   └── PrimeProductListener.java
│       │   │                   ├── models
│       │   │                   │   ├── dto
│       │   │                   │   │   └── PrimeProductDto.java
│       │   │                   │   └── entities
│       │   │                   │       └── PrimeProduct.java
│       │   │                   ├── repositories
│       │   │                   │   └── PrimeProductRepository.java
│       │   │                   └── services
│       │   │                       └── PrimeProductService.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── java
│               └── com
│                   └── david
│                       └── maman
│                           └── primesserver
│                               └── PrimesServerApplicationTests.java
├── service-registry
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── david
│       │   │           └── maman
│       │   │               └── serviceregistry
│       │   │                   └── ServiceRegistryApplication.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── java
│               └── com
│                   └── david
│                       └── maman
│                           └── serviceregistry
│                               └── ServiceRegistryApplicationTests.java
└── spring-cloud-gateway
    ├── Dockerfile
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── src
        ├── main
        │   ├── java
        │   │   └── com
        │   │       └── david
        │   │           └── maman
        │   │               └── springcloudgateway
        │   │                   ├── SpringCloudGatewayApplication.java
        │   │                   └── config
        │   │                       ├── GatewayConfig.java
        │   │                       └── RouterValidator.java
        │   └── resources
        │       └── application.yml
        └── test
            └── java
                └── com
                    └── david
                        └── maman
                            └── springcloudgateway
                                └── SpringCloudGatewayApplicationTests.java
```

## Frontend Structure:

```plaintext
.
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── common
│   │   │   └── Navbar.tsx
│   │   ├── index.ts
│   │   ├── modal
│   │   │   ├── GenericModal.tsx
│   │   │   ├── RoleForm.tsx
│   │   │   ├── UpdatePassword.tsx
│   │   │   ├── UserForm.tsx
│   │   │   └── index.ts
│   │   ├── pages
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorPage.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── admin
│   │   │   │   ├── HomeAdmin.tsx
│   │   │   │   ├── SettingsAdmin.tsx
│   │   │   │   └── UsersPageAdmin.tsx
│   │   │   ├── client
│   │   │   │   └── HomeClient.tsx
│   │   │   └── courier
│   │   │       └── HomeCourier.tsx
│   │   ├── partials
│   │   │   ├── PasswordRulesList.tsx
│   │   │   ├── RoleList.tsx
│   │   │   ├── RolePartial.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── index.ts
│   │   └── shared
│   │       ├── AlertDialog.tsx
│   │       ├── PageHeader.tsx
│   │       ├── ReusableInput.tsx
│   │       ├── ReusableSelect.tsx
│   │       ├── ReusableTable.tsx
│   │       └── index.ts
│   ├── helpers
│   │   ├── index.ts
│   │   ├── load-abort-axios.ts
│   │   ├── paths.ts
│   │   └── validation.form.ts
│   ├── hooks
│   │   ├── authContext.tsx
│   │   ├── index.ts
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useFetchAndLoad.ts
│   │   ├── useFetchQuery.ts
│   │   ├── useForm.ts
│   │   ├── useList.ts
│   │   ├── useLocalStorage.ts
│   │   └── useRouteConfig.ts
│   ├── index.css
│   ├── main.tsx
│   ├── routes
│   │   ├── PrivateRoutes.tsx
│   │   ├── PublicRoutes.tsx
│   │   ├── index.ts
│   │   └── routes.tsx
│   ├── services
│   │   ├── api.ts
│   │   ├── cache.ts
│   │   ├── index.ts
│   │   └── service-request.ts
│   ├── types
│   │   ├── axios.models.ts
│   │   ├── form.models.ts
│   │   ├── index.ts
│   │   ├── models.ts
│   │   └── props.models.ts
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```



