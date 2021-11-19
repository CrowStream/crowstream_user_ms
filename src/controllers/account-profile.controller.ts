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
import {
  Account,
  Profile,
} from '../models';
import {AccountRepository} from '../repositories';

export class AccountProfileController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
  ) { }

  @get('/accounts/{id}/profiles', {
    responses: {
      '200': {
        description: 'Array of Account has many Profile',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Profile)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Profile>,
  ): Promise<Profile[]> {
    return this.accountRepository.profiles(id).find(filter);
  }

  @post('/accounts/{id}/profiles', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {'application/json': {schema: getModelSchemaRef(Profile)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Account.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profile, {
            title: 'NewProfileInAccount',
            exclude: ['id'],
            optional: ['account_id']
          }),
        },
      },
    }) profile: Omit<Profile, 'id'>,
  ): Promise<Profile> {
    return this.accountRepository.profiles(id).create(profile);
  }

  @patch('/accounts/{id}/profiles', {
    responses: {
      '200': {
        description: 'Account.Profile PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profile, {partial: true}),
        },
      },
    })
    profile: Partial<Profile>,
    @param.query.object('where', getWhereSchemaFor(Profile)) where?: Where<Profile>,
  ): Promise<Count> {
    return this.accountRepository.profiles(id).patch(profile, where);
  }

  @del('/accounts/{id}/profiles', {
    responses: {
      '200': {
        description: 'Account.Profile DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Profile)) where?: Where<Profile>,
  ): Promise<Count> {
    return this.accountRepository.profiles(id).delete(where);
  }
}
