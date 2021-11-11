import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, AccountCredentials, AccountRelations} from '../models';
import {AccountCredentialsRepository} from './account-credentials.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {

  public readonly accountCredentials: HasOneRepositoryFactory<AccountCredentials, typeof Account.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DbDataSource,
    @repository.getter('AccountCredentialsRepository') protected accountCredentialsRepositoryGetter: Getter<AccountCredentialsRepository>,
  ) {
    super(Account, dataSource);
    this.accountCredentials = this.createHasOneRepositoryFactoryFor('accountCredentials', accountCredentialsRepositoryGetter);
    this.registerInclusionResolver('accountCredentials', this.accountCredentials.inclusionResolver);
  }
}
