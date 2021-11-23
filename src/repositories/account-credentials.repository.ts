import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, AccountCredentials, AccountCredentialsRelations} from '../models';
import {AccountRepository} from './account.repository';

export class AccountCredentialsRepository extends DefaultCrudRepository<
  AccountCredentials,
  typeof AccountCredentials.prototype.id,
  AccountCredentialsRelations
> {

  public readonly account: BelongsToAccessor<Account, typeof AccountCredentials.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DbDataSource,
    @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(AccountCredentials, dataSource);
    this.account = this.createBelongsToAccessorFor('Account', accountRepositoryGetter,);
  }
}
