import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Account} from './account.model';

@model()
export class Profile extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @belongsTo(() =>
    Account,
    {name: 'Account'},
    {type: 'string', required: true}
  )
  account_id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<Profile>) {
    super(data);
  }
}

export interface ProfileRelations {
  // describe navigational properties here
}

export type ProfileWithRelations = Profile & ProfileRelations;
