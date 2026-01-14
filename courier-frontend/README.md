# Courier App - Frontend

This repository contains the frontend of the **Courier App**, developed with **React + TypeScript + Vite**. Its design is focused on scalability, maintainability, and separation of concerns, following principles inspired by **Clean Architecture**.

---

## Project Structure

```plaintext
src/
├── adapters/             # Adapters for transforming data between layers
├── assets/               # Static assets used in code (images, icons, etc.)
├── hoc/                  # Reusable higher-order components
├── hooks/                # Custom reusable hooks
├── models/               # Shared models and types
├── redux/                # Global state (Redux Toolkit)
├── routes/               # Routing and protected routes configuration
├── services/             # API service logic
├── ui/                   # Presentation layer (UI)
│   ├── components/       # Reusable and entity-specific components
│   │   ├── features/     # Components organized by entity (users, contacts, etc.)
│   │   ├── forms/        # Reusable form components
│   │   ├── itemsContainer/ # Reusable container and table for displaying entities
│   │   └── snackbar/     # Snackbar components for visual feedback
│   ├── layout/           # Main application layout (Navbar, structure)
│   └── pages/            # High-level pages (Home, SignIn, Users, etc.)
├── utilities/            # Utility functions (validation, helpers, etc.)
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── vite-env.d.ts         # Vite environment types
```

---

## Main Technologies

- **React + TypeScript**
- **Redux Toolkit**
- **React Hook Form + Yup** for validations
- **Vite** as a modern bundler
- **React Router 6** for routing
- **Axios** for HTTP requests
- **notistack** for centralized snackbars
- **Material UI (MUI)** for layout, tables, dialogs, and form components
- **Bootstrap 5** for grid system and additional styling

---

## Current Status

- Modular implementation of components by entity (users, contacts, branches, etc.)
- Reusable components for forms, tables, and validation
- Structure inspired by Clean Architecture principles
- Clear separation between adapters, services, and presentation
- Role-based protected routes

---

## Authentication & Axios Interceptors

The app uses **Axios interceptors** to manage authentication and token refreshing.

- Requests are made with `withCredentials: true` to support cookies.
- If a request returns a `401 Unauthorized` error:
  - The app checks whether the endpoint is retryable.
  - If retryable and not yet retried, it attempts to **refresh the access token** via `/credential/refresh-token`.
  - Upon success, it **automatically retries the original request**.
- This logic is centralized in the **apiService**, ensuring consistent behavior across the app.

```javascript
if (response.status === 401 && !originalRequest._retry) {
  const refreshSuccess = await refreshAccessToken();
  if (refreshSuccess) return api(originalRequest);
}
```

This pattern helps maintain seamless user sessions and avoids redirecting to login unnecessarily.

---

## Reusable Component: `ItemsContainer`

The `ItemsContainer` is a core generic component designed to handle **CRUD operations, pagination, search, and filtering** for any entity in the system.

**Key Features:**

- Generic typing via `<T extends BaseEntity>`, enabling reuse across entities.
- Encapsulates local list state with `useList` and remote fetching logic.
- Supports:
  - Text search and advanced filters.
  - Inline creation form (`ItemInlineForm`).
  - Row expansion and expandable content.
  - Table actions (edit, delete) with role-based permissions.
  - Snackbar feedback and deletion confirmation.
- Highly customizable via props: adapters, actions, form components, and column mapping.

**Example Usage:**

```javascript
<ItemsContainer
  auth={userDetails}
  header={{
    title: 'Users',
    placeholder: 'Search by name',
    buttonName: 'Add User',
  }}
  actions={userActions}
  adapters={userAdapters}
  list={userListConfig}
  allowedActions={{
    create: ['ROLE_ADMIN'],
    update: ['ROLE_ADMIN'],
    delete: ['ROLE_ADMIN'],
  }}
  formatMessage={(item) => `Are you sure you want to delete ${item.fullname}?`}
  rowExpandable={(item) => item.roles.includes('client')}
  expandContent={(item) => <ClientDetails client={item} />}
  advancedSearchContent={<UserSearchContent onSubmit={...} onClose={...} />}
/>
```

This approach allows you to **add new entities with minimal boilerplate**, promoting consistency and scalability across the application.

---

## Pending/Future Work

- Add unit tests (React Testing Library, Jest)
- Improve theming and accessibility support
- Implement lazy loading for better performance
- Add technical documentation for components/hooks

---

## Backend Project

The frontend communicates with a backend made up of microservices, including:

- Authentication service (auth-service)
- User management (user-service)
- Resources (resource-service: offices, branches, contacts)
- Orchestration via Spring Cloud Gateway and Eureka
