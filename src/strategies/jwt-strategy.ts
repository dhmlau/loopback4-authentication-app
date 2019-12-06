import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {Request, HttpErrors} from '@loopback/rest';
import {TokenServiceBindings} from '../keys';
import {inject} from '@loopback/context';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'JWTStrategy';
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) {}
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    // always return a dummy user for now
    // return {email: 'test@test.com', [securityId]: 'test@test.com'};
    //always throws unauthorized error
    // throw new HttpErrors.Unauthorized('The credentials are not correct.');
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
}
