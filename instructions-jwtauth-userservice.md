## Stage 3: Create UserService

## Create `User` and `UserCredentials` model

First, we're going to define the `User` and `UserCredentials` model using the `lb4 model` command.

`User` model has the following properties. All are of string type and required.

- id: generated value
- email
- first name
- last name

`UserCredentials` model has the following properties.

- id: generated value
- userId: this is the same as the email.
- password: hashed value of the real password

## Create the datasource and Repository for User and UserCredentials

## Add model relation

There is a `hasOne` relation between `User` and `UserCredentials`. Next, we're going to define it using the `lb4 relation` command.

```sh
$ lb4 relation
? Please select the relation type hasOne
? Please select source model User
? Please select target model UserCredentials
? Foreign key name to define on the target model userId
? Source property name for the relation getter (will be the relation name) userCredent
ials
? Allow User queries to include data from related UserCredentials instances? Yes
   create src/controllers/user-user-credentials.controller.ts

Relation HasOne was created in src/
```

### Create UserService

This really depends on how you're authenticating the users. You might have a database to check against, or you're calling external services.

The purpose of the `UserService` is to:

- obtain the credentials
- authenticate the user
- if the user exists, return the user profile.

1. Create a HashPassword service, `services/hash.password.bcryptjs.ts`

   Run

   ```sh
   $ npm i bcryptjs --save
   $ npm i @types/bcryptjs --save-dev
   ```

See https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/hash.password.bcryptjs.ts

2. Add `PasswordHasherBindings` key which will be used later.

Go to `keys.ts`.

Add:

```ts
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
```

and add import:

```ts
import {PasswordHasher} from './services/hash.password.bcryptjs';
```

3. In UserService,

   Add import:

   ```ts
   import {UserRepository} from '../repositories';
   import {repository} from '@loopback/repository';
   import {inject} from '@loopback/context';
   import {PasswordHasher} from './hash.password.bcryptjs';
   import {PasswordHasherBindings} from '../keys';
   ```

Modify the constructor:

```ts
constructor(@repository(UserRepository) public userRepository: UserRepository,
@inject(PasswordHasherBindings.PASSWORD_HASHER)
public passwordHasher: PasswordHasher) {}
```

`verifyCredentials` function: Use the code in https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/user-service.ts as a reference.

## (Optional) Create tables for User and UserCredentials in SQL database

---

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
