import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, AccountCredentials, AccountRelations, Profile} from '../models';
import {AccountCredentialsRepository} from './account-credentials.repository';
import {ProfileRepository} from './profile.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {

  public readonly accountCredentials: HasOneRepositoryFactory<AccountCredentials, typeof Account.prototype.id>;

  public readonly profiles: HasManyRepositoryFactory<Profile, typeof Account.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DbDataSource,
    @repository.getter('AccountCredentialsRepository') protected accountCredentialsRepositoryGetter: Getter<AccountCredentialsRepository>, @repository.getter('ProfileRepository') protected profileRepositoryGetter: Getter<ProfileRepository>,
  ) {
    super(Account, dataSource);
    this.profiles = this.createHasManyRepositoryFactoryFor('profiles', profileRepositoryGetter,);
    this.registerInclusionResolver('profiles', this.profiles.inclusionResolver);
    this.accountCredentials = this.createHasOneRepositoryFactoryFor('accountCredentials', accountCredentialsRepositoryGetter);
    this.registerInclusionResolver('accountCredentials', this.accountCredentials.inclusionResolver);
  }
}
