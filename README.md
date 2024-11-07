# Todo App - Nest.js

## Overview

This project is a comprehensive Todo App built using the NestJS framework. It covers a wide range of concepts and skills, including authentication, authorization, database integration, error handling, and more. This project is part of a course designed to teach you how to build robust and scalable applications using NestJS.

## Concepts and Skills Learned

1. **NestJS Basics**:

    - Understanding of NestJS framework and its core concepts (modules, controllers, services, providers).
    - Familiarity with NestJS CLI for generating and managing project files.

2. **TypeScript**:

    - Strong understanding of TypeScript, including types, interfaces, classes, and decorators.

3. **Dependency Injection**:

    - Using dependency injection to manage service dependencies in NestJS.

4. **Database Integration**:

    - Setting up and configuring TypeORM with NestJS.
    - Creating and managing entities and repositories.
    - Performing CRUD operations using TypeORM.

5. **Environment Variables**:

    - Using `@nestjs/config` to manage environment variables.
    - Loading and accessing environment variables in the application.

6. **Authentication and Authorization**:

    - Implementing JWT-based authentication using `jose` library.
    - Creating and verifying JWT tokens.
    - Implementing middleware for authentication and authorization.

7. **Error Handling**:

    - Implementing custom error handling and logging.
    - Using NestJS built-in exception filters.

8. **Middleware**:

    - Creating and applying custom middleware for request processing.

9. **Data Seeding**:

    - Using `typeorm-seeding` to seed initial data into the database.

10. **Pagination**:

    - Implementing pagination for API endpoints.

11. **Testing**:

    - Writing unit tests and end-to-end tests using Jest and Supertest.

12. **API Design**:
    - Designing RESTful API endpoints.
    - Using decorators to handle request parameters, query parameters, and request bodies.

## Tasks Implemented

1. **Project Setup**:

    - Initialized a new NestJS project using NestJS CLI.
    - Configured environment variables using `@nestjs/config`.

2. **Database Configuration**:

    - Set up TypeORM with MySQL database.
    - Created entities for `User`, `Todo`, and `Auth`.

3. **Authentication**:

    - Implemented JWT-based authentication.
    - Created login and logout endpoints.
    - Implemented token generation, verification, and invalidation.
    - Created middleware for authentication.

4. **Authorization**:

    - Implemented role-based access control (if applicable).

5. **CRUD Operations**:

    - Implemented CRUD operations for `Todo` entity.
    - Created endpoints for creating, reading, updating, and deleting todos.

6. **Data Seeding**:

    - Used `typeorm-seeding` to seed initial data into the database.

7. **Pagination**:

    - Implemented pagination for listing todos.

8. **Error Handling**:

    - Implemented custom error handling and logging.

9. **Testing**:

    - Wrote unit tests for services and controllers.
    - Wrote end-to-end tests for API endpoints.

10. **API Design**:
    - Designed RESTful API endpoints for authentication and todo management.
    - Used decorators to handle request parameters, query parameters, and request bodies.

## Key Files and Their Purpose

1. **`src/app.module.ts`**:

    - Main application module that imports other modules and configures the application.

2. **`src/auth/auth.module.ts`**:

    - Module for authentication-related functionality.

3. **`src/auth/auth.service.ts`**:

    - Service for handling authentication logic, including token generation, verification, and invalidation.

4. **`src/auth/auth.controller.ts`**:

    - Controller for handling authentication-related API endpoints (login, logout).

5. **`src/auth/auth.middleware.ts`**:

    - Middleware for handling authentication and authorization.

6. **`src/todo/todo.module.ts`**:

    - Module for todo-related functionality.

7. **`src/todo/todo.service.ts`**:

    - Service for handling todo-related logic.

8. **`src/todo/todo.controller.ts`**:

    - Controller for handling todo-related API endpoints.

9. **`src/user/user.module.ts`**:

    - Module for user-related functionality.

10. **`src/user/user.service.ts`**:

    - Service for handling user-related logic.

11. **`src/user/user.controller.ts`**:

    - Controller for handling user-related API endpoints (if applicable).

12. **`src/common/common.module.ts`**:

    - Common module for shared functionality across the application.

13. **`src/main.ts`**:

    - Entry point of the application.

14. **`test/app.e2e-spec.ts`**:

    - End-to-end tests for the application.

15. **`src/todo/todo.service.spec.ts`**:

    - Unit tests for the `TodoService`.

16. **`src/app.controller.spec.ts`**:

    - Unit tests for the `AppController`.

17. **`src/todo/todo.controller.spec.ts`**:

    - Unit tests for the `TodoController`.

18. **`src/user/user.controller.spec.ts`**:

    - Unit tests for the `UserController`.

19. **`src/user/user.service.spec.ts`**:
    - Unit tests for the `UserService`.
