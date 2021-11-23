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
