import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, Profile, ProfileRelations} from '../models';
import {AccountRepository} from './account.repository';

export class ProfileRepository extends DefaultCrudRepository<
  Profile,
  typeof Profile.prototype.id,
  ProfileRelations
> {

  public readonly account: BelongsToAccessor<Account, typeof Profile.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DbDataSource,
    @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Profile, dataSource);
    this.account = this.createBelongsToAccessorFor('Account', accountRepositoryGetter,);
    this.registerInclusionResolver('account', this.account.inclusionResolver);
  }
}
