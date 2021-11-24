import {property} from '@loopback/repository';
import {SchemaObject} from 'openapi3-ts';
import {Profile} from '../models';

export const ProfileSchema: SchemaObject = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
    },
  },
};

export const ProfilesSchema: SchemaObject = {
  type: 'object',
  properties: {
    account_id: {
      type: 'string',
    },
    profiles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          }
        }
      }
    }
  }
};

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
