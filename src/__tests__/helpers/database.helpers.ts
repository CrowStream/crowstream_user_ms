import {AccountCredentialsRepository, AccountRepository} from '../../repositories';
import {testdb} from '../datasources/testdb.datasource';

export async function givenEmptyDataBase() {
  let accountRepository: AccountRepository;
  let accountCredentialsRepository: AccountCredentialsRepository;

  accountRepository = new AccountRepository(
    testdb,
    async () => accountCredentialsRepository,
  );

  accountCredentialsRepository = new AccountCredentialsRepository(
    testdb,
    async () => accountRepository,
  );

  await accountRepository.deleteAll();
  await accountCredentialsRepository.deleteAll();
}
