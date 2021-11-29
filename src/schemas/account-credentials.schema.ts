import {SchemaObject} from 'openapi3-ts';

export const AccountCredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const TokenSchema: SchemaObject = {
  type: 'object',
  properties: {
    token: {
      type: 'string',
    }
  },
};
