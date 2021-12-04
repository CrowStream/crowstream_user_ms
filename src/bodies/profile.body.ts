import {property} from '@loopback/repository';
import {Profile} from '../models';

export class ProfilesResponse {
  @property({
    type: 'string',
    required: true
  })
  account_id: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  profiles: Array<Omit<Profile, "account_id">>;

  constructor(account_id: string) {
    this.account_id = account_id;
    this.profiles = [];
  }
};
