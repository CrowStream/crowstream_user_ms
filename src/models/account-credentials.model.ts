import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Account} from './account.model';

@model()
export class AccountCredentials extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @belongsTo(() => Account, {name: 'Account'})
  account_id: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  constructor(data?: Partial<AccountCredentials>) {
    super(data);
  }
}

export interface AccountCredentialsRelations {
  // describe navigational properties here
}

export type AccountCredentialsWithRelations = AccountCredentials & AccountCredentialsRelations;
