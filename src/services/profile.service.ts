import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Profile, ProfileRelations} from '../models';
import {ProfileRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ProfileService {
  constructor(
    @repository(ProfileRepository) protected profileRepository: ProfileRepository,
  ) { }

  async create(newProfile: Profile): Promise<Profile> {
    return this.profileRepository.create(newProfile);
  }

  async findById(id: string): Promise<(Profile & ProfileRelations)> {
    return this.profileRepository.findById(id);
  }

  async findByAccountId(accountId: string): Promise<(Profile & ProfileRelations)[]> {
    return this.profileRepository.find({
      where: {
        account_id: accountId,
      }
    })
  }
}
