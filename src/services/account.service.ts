import {BindingScope, injectable} from '@loopback/core';
import {Count, repository, Where} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import {Account, AccountRelations} from '../models';
import {AccountRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AccountService {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
  ) { }

  convertToUserProfile(account: Account): UserProfile {
    return {
      [securityId]: account.id,
      email: account.email,
    };
  }

  async create(newAccount: Account): Promise<Account> {
    return this.accountRepository.create(newAccount);
  }

  async findByEmail(email: string): Promise<(Account & AccountRelations) | null> {
    return this.accountRepository.findOne(
      {
        where: {
          email
        }
      }
    );
  }

  async count(where: Where<Account> | undefined): Promise<Count> {
    return this.accountRepository.count(where);
  }
}
