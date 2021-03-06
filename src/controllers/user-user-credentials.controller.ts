import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User, UserCredentials} from '../models';
import {UserRepository} from '../repositories';
import {inject} from '@loopback/core';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcryptjs';

export class UserUserCredentialsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  @get('/users/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'User has one UserCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCredentials),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCredentials>,
  ): Promise<UserCredentials> {
    return this.userRepository.userCredentials(id).get(filter);
  }

  @post('/users/{email}/user-credentials', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(UserCredentials)},
        },
      },
    },
  })
  async create(
    @param.path.string('email') id: typeof User.prototype.email,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {
            title: 'NewUserCredentialsInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userCredentials: Omit<UserCredentials, 'id'>,
  ): Promise<UserCredentials> {
    const password = await this.passwordHasher.hashPassword(
      userCredentials.password,
    );
    userCredentials.password = password;
    return this.userRepository.userCredentials(id).create(userCredentials);
  }

  @patch('/users/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'User.UserCredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {partial: true}),
        },
      },
    })
    userCredentials: Partial<UserCredentials>,
    @param.query.object('where', getWhereSchemaFor(UserCredentials))
    where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.userRepository
      .userCredentials(id)
      .patch(userCredentials, where);
  }

  @del('/users/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'User.UserCredentials DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCredentials))
    where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.userRepository.userCredentials(id).delete(where);
  }
}
