import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';

export type Credentials = {
  email: string;
  password: string;
};

export class MyUserService implements UserService<User, Credentials> {
  constructor() {}

  async verifyCredentials(credentials: Credentials): Promise<User> {}
  convertToUserProfile(user: User): UserProfile {}
}
