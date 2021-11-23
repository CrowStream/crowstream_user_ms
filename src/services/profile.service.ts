import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Profile} from '../models';
import {ProfileRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ProfileService {
  constructor(
    @repository(ProfileRepository) protected profileRepository: ProfileRepository,
  ) { }

  async create(newProfile: Profile) {
    return this.profileRepository.create(newProfile);
  }

  async findByAccountId(accountId: string) {
    return this.profileRepository.findOne({
      where: {
        account_id: accountId,
      }
    })
  }
}
