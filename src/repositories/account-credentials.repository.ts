import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Account, AccountCredentials, AccountCredentialsRelations} from '../models';
import {AccountRepository} from './account.repository';

export class AccountCredentialsRepository extends DefaultCrudRepository<
  AccountCredentials,
  typeof AccountCredentials.prototype.id,
  AccountCredentialsRelations
> {

  public readonly Account: BelongsToAccessor<Account, typeof AccountCredentials.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(AccountCredentials, dataSource);
    this.Account = this.createBelongsToAccessorFor('Account', accountRepositoryGetter,);
  }
}
