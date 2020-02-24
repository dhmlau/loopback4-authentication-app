## Test in API Explorer

There are extra steps needed to allow us to be able to test the JWT authentication in API Explorer. See docs page: https://loopback.io/doc/en/lb4/Authentication-Tutorial.html#specifying-the-security-settings-in-the-openapi-specification

1. Create `utils/security-spec.ts` with content:

```ts
import {SecuritySchemeObject, ReferenceObject} from '@loopback/openapi-v3';

export const OPERATION_SECURITY_SPEC = [{bearerAuth: []}];
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};
```

2. In `customer.controller.ts`,
   Add import:

```ts
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
```

For the endpoint that you want to add security spec:

```ts
  @get('/customers/count', {
    security: OPERATION_SECURITY_SPEC, // ---- ADD THIS LINE ------
    responses: {
      '200': {
        description: 'Customer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
```

3. In `application.ts`, add import:

```ts
import {SECURITY_SCHEME_SPEC} from './utils/security-spec';
```

```ts
/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');
```

Inside constructor:

```ts
this.api({
  openapi: '3.0.0',
  info: {title: pkg.name, version: pkg.version},
  paths: {},
  components: {securitySchemes: SECURITY_SCHEME_SPEC},
  servers: [{url: '/'}],
});
```
