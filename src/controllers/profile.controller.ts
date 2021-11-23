import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Profile} from '../models';
import {ProfileSchema} from '../schemas';
import {ProfileService} from '../services';

@authenticate('jwt')
export class ProfileControllerController {
  constructor(
    @inject(SecurityBindings.USER) protected user: UserProfile,
    @inject('services.ProfileService') protected profilesService: ProfileService,
  ) { }

  // TODO: Look for good practice to call the path
  @post('/profiles', {
    responses: {
      '201': {
        description: 'Create a new profile for an existing account',
        content: {
          'application/json': {
            schema: ProfileSchema,
          }
        }
      }
    }
  })
  async createprofile(
    @requestBody({
      content: {
        'application/json': {
          schema: ProfileSchema,
        }
      }
    })
    profile: Profile,
  ): Promise<Profile> {
    profile.account_id = this.user[securityId];
    const profileCreated = await this.profilesService.create(profile);
    if (profileCreated === undefined) {
      throw new HttpErrors[500]('Profile could not be created :c');
    }
    return profileCreated;
  }
}
