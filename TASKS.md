# Todo App - Nest.js

## Tasks

-   fix get all todo, get todo by id api
-   401 unauthorized, 403 forbidden(no token)
-   media handling
-   user signup
-   email/username login

## Done

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
