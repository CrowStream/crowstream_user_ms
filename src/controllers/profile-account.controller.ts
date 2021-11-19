import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Profile,
  Account,
} from '../models';
import {ProfileRepository} from '../repositories';

export class ProfileAccountController {
  constructor(
    @repository(ProfileRepository)
    public profileRepository: ProfileRepository,
  ) { }

  @get('/profiles/{id}/account', {
    responses: {
      '200': {
        description: 'Account belonging to Profile',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Account)},
          },
        },
      },
    },
  })
  async getAccount(
    @param.path.string('id') id: typeof Profile.prototype.id,
  ): Promise<Account> {
    return this.profileRepository.account(id);
  }
}
