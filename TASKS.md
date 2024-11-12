# Todo App - Nest.js

## Tasks

-   401 unauthorized, 403 forbidden(no token)
-   media handling

## Done

-   email/username login
-   user signup
-   fix get all todo, get todo by id api
-   createdAt, updatedAt, description, media\*(figure out form data) field in Todo
-   authJTI entity
    -   id (auto)
    -   JTI (string,`varchar36`, unique)
    -   userID
    -   expirationTime
    -   revokedAt (nullable)
    -   createdAt
    -   updatedAt
-   seeder (faker js)
-   pagination
-   authorization/authentication (jose npm)
-   login/logout
-   middleware
