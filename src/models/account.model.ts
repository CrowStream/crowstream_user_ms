import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {AccountCredentials} from './account-credentials.model';
import {Profile} from './profile.model';

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

  @hasOne(() => AccountCredentials, {keyTo: 'account_id'})
  accountCredentials: AccountCredentials;

  @hasMany(() => Profile, {keyTo: 'account_id'})
  profiles: Profile[];

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
