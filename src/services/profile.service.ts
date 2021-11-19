import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ProfileRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ProfileService {
  constructor(
    @repository(ProfileRepository) protected profileRepository: ProfileRepository,
  ) { }
}
