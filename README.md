# Todo App - Nest.js

## Tasks

- authJTI entity
    - id (auto)
    - JTI (string, (no limit) `varchar255`, unique)
    - userID
    - expirationTime
    - revokedAt (nullable)
    - createdAt
    - updatedAt
- email/username login
- createdAt/updatedAt def timestamp | migration
- description, media*(figure out form data) field in Todo

## Done

- seeder (faker js)
- pagination
- authorization/authentication (jose npm)
- login/logout
- middleware
