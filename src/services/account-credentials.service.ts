import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {compare, genSalt, hash} from 'bcryptjs';
import {AccountCredentials, AccountCredentialsRelations} from '../models';
import {AccountCredentialsRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AccountCredentialsService {
  constructor(
    @repository(AccountCredentialsRepository) protected accountCredentialsRepository: AccountCredentialsRepository,
  ) { }

  async create(newAccountCredentials: AccountCredentials): Promise<AccountCredentials> {
    return this.accountCredentialsRepository.create(newAccountCredentials);
  }

  async findByAccountId(accountId: string): Promise<(AccountCredentials & AccountCredentialsRelations) | null> {
    return this.accountCredentialsRepository.findOne({
      where: {
        account_id: accountId,
      },
    });
  }

  async getPasswordHash(password: string): Promise<string> {
    return await hash(password, await genSalt());
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
