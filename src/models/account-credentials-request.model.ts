import {Model, model, property} from '@loopback/repository';

@model()
export class AccountCredentialsRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<AccountCredentialsRequest>) {
    super(data);
  }
}

export interface AccountCredentialsRequestRelations {
  // describe navigational properties here
}

export type AccountCredentialsRequestWithRelations = AccountCredentialsRequest & AccountCredentialsRequestRelations;
