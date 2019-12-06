# Stage 2: Set up JWT authentication

## Create binding keys for the TokenService

Create `keys.ts` under `src` folder with the following content:

```ts
import {BindingKey} from '@loopback/context';
import {TokenService} from '@loopback/authentication';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t'; //you can put any value you want
  export const TOKEN_EXPIRES_IN_VALUE = '600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}
```

## Create JWTService to validate the token

This `JWTService` will validate the token. If the token is valid, it returns the user profile.

Create `src/services/jwt-service.ts` with the following content:

```ts
import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {id: '', name: ''},
        {id: decryptedToken.id, name: decryptedToken.name},
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${error.message}`,
      );
    }

    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token: ${error}`);
    }

    return token;
  }
}
```

Reference: https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/jwt-service.ts

## Improve on the existing JWT Authentication Strategy

Go to `src/strategies/jwt-strategy.ts` `authenticate` function.
It extracts the token from the `Authorization` header and call the JWTService to validate the token.

1. Modify/Add the import statements

```ts
import {AuthenticationStrategy, TokenService} from '@loopback/authentication'; //add TokenService
import {UserProfile, securityId} from '@loopback/security'; //add securityId
import {TokenServiceBindings} from '../keys'; //add this line
import {inject} from '@loopback/context'; // add this line
```

2. Add the following parameter in the constructor

```ts
@inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
```

3. Modify the `authenticate` function and add the `extractCredentials` function.

```ts
async authenticate(request: Request): Promise<UserProfile | undefined> {

    // reference implementation
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);
    return userProfile;
  }
  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example: Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts: 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];

    return token;
  }
```

Reference: https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/authentication-strategies/jwt-strategy.ts

## Bind JWT secret and other values to the binding keys

To bind the JWT secret, expires in values and the JWTService class to binding keys, go to `src/application.ts`

Add the imports:

```ts
import {TokenServiceBindings, TokenServiceConstants} from './keys';
```

```ts
constructor(options?: ApplicationConfig) {
    super(options);

    // add this to the bottom of the constructor
    this.setUpBindings();
  }

  setUpBindings(): void {

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

  }

```
