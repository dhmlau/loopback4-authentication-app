# Create UserService

This really depends on how you're authenticating the users. You might have a database to check against, or you're calling external services.

The purpose of the `UserService` is to:

- obtain the credentials
- authenticate the user
- if the user exists, return the user profile.

## Create `User` and `UserCredentials` model

`UserCredentials` model:

- id: generated value
- userId: email
- password: hashed value of the real password

`User` model:

- id: generated value
- email
- first name
- last name
- userCredential (hasOne relation with `UserCredentials`)

## Create the DataSource and Repository

- UserRepository
- UserCredentialsRepository

---

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
