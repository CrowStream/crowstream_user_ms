import {Entity, hasOne, model, property} from '@loopback/repository';
import {AccountCredentials} from './account-credentials.model';

@model()
export class Account extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    format: 'email',
  })
  email: string;

  @property({
    type: 'boolean',
    default: false,
  })
  is_email_verified: boolean;

  @property({
    type: 'number',
  })
  payment_method: number;

  @hasOne(() => AccountCredentials, {keyTo: 'account_id'})
  accountCredentials: AccountCredentials;

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
