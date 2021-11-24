import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {get, getModelSchemaRef, HttpErrors, param, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Profile} from '../models';
import {ProfileSchema, ProfilesResponse, ProfilesSchema} from '../schemas';
import {ProfileService} from '../services';

@authenticate('jwt')
export class ProfileControllerController {
  constructor(
    @inject(SecurityBindings.USER) protected user: UserProfile,
    @inject('services.ProfileService') protected profilesService: ProfileService,
  ) { }

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

  @get('/profiles', {
    responses: {
      '200': {
        description: 'Return the profile asosiated to the given id',
        content: {
          'application/json': {
            schema: ProfilesSchema
          }
        }
      }
    }
  })
  async getProfiles(): Promise<ProfilesResponse> {
    const response = new ProfilesResponse(this.user[securityId]);
    const profiles = await this.profilesService.findByAccountId(response.account_id);
    profiles.forEach((profile) => {
      response.profiles.push(new Profile({
        id: profile.id,
        name: profile.name,
      }));
    });
    return response;
  }

  @get('/profiles/{profileId}', {
    responses: {
      '200': {
        description: 'Return the profile asosiated to the given id',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Profile)
          }
        }
      }
    }
  })
  async getProfileById(
    @param.path.string('profileId') profileId: string,
  ): Promise<Profile | null> {
    return this.profilesService.findById(profileId);
  }
}
