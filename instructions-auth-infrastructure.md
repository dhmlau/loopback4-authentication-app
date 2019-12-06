## Stage 1: Setting up the minimal infrastructure for authentication

First, ensure you have the necessary packages installed:

```sh
npm install --save @loopback/authentication @loopback/security
```

## Add authentication to the sequence

Authentication is not enabled by default. We need to tell loopback that every
incoming HTTP request should check to see if authentication is required.

Open `src/sequence.ts` and add the following:

```ts
// At the top
import { AuthenticationBindings, AuthenticateFn } from '@loopback/authentication';
// In the constructor's arguments
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
// In the handle function
    const route = this.findRoute(request);
    await this.authenticateRequest(request);    // ADD THIS LINE
    const args = await this.parseParams(request, route);
```

## Create a authentication strategy

TODO: we want to have jwt authentication eventually?

The AuthenticationStrategy is where the work really happens.

Make a new folder `src/strategies`

Create the file `src/strategies/jwt-strategy.ts` with the following content:

```ts
import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {HttpErrors, Request} from '@loopback/rest';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'JWTStrategy';
  constructor() {}
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    //always return a dummy user for now
    return {email: 'test@test.com', [securityId]: 'test@test.com'};

    //always throws unauthorized error
    //throw new HttpErrors.Unauthorized('The credentials are not correct.');
  }
}
```

## Register the Basic authentication strategy

Now we need to tell our application that this strategy exists and can be used.

Open `src/application.ts` and add the following lines:

```ts
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from './strategies/jwt-strategy';
// At the bottom of the constructor function
this.component(AuthenticationComponent);
registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
```

## Start using the Basic authentication strategy in controllers

Add import

```ts
import {authenticate} from '@loopback/authentication';
```

Say we want to protect all endpoints in this controller.

```ts
@authenticate('JWTStrategy') //add this line to protect all endpoints
export class CustomerController {
  //...
}
```

If we want to skip a particular endpoint, we can use `@authenticate.skip()`, i.e.

```ts
  @authenticate.skip() //add this line for the endpoint you don't want to be protected
  @post('/customers', ..)
```

## Add a test to ensure it works as expected

Create acceptance tests for the controller.
Under `src/__tests__`, in my example, create `customer.controller.acceptance.ts`.

Add the following to one of your acceptance tests:

```ts
import {Client, expect} from '@loopback/testlab';
import {Loopback4AuthenticationAppApplication} from '../..';
import {setupApplication} from './test-helper';

describe('CustomerController', () => {
  let app: Loopback4AuthenticationAppApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes count', async () => {
    const res = await client.get('/customers/count').expect(200);
    expect(res.body).to.have.key('count');
  });
});
```

Now running `npm test` will verify that your authentication pipeline works.

The test should always pass, because the `authenticate` function always return a user.
To test the authentication really works, in `jwt-strategy.ts` `authenticate` function, uncomment the snippet that always throw unauthorized error, i.e.

```ts
//always throws unauthorized error
throw new HttpErrors.Unauthorized('The credentials are not correct.');
```

When running `npm test`, you will get an error saying:

```
Error: expected 200 "OK", got 401 "Unauthorized"
```

At this point, you have set up the minimal infrastructure for enabling authentication.
