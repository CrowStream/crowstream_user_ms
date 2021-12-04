import {SchemaObject} from 'openapi3-ts';

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
