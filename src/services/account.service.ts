import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
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

  async findByEmail(email: string): Promise<(Account & AccountRelations) | null> {
    return this.accountRepository.findOne(
      {
        where: {
          email
        }
      }
    );
  }
}
