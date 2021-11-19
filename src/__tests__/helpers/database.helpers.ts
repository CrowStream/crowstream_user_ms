import { Account, AccountCredentials } from '../../models';
import {AccountCredentialsRepository, AccountRepository} from '../../repositories';
import {testdb} from '../datasources/testdb.datasource';

export function getRepositories() {
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

  return {
    accountRepository,
    accountCredentialsRepository,
  };
}

export async function givenEmptyDataBase() {
  const {accountRepository, accountCredentialsRepository} = getRepositories();
  await accountRepository.deleteAll();
  await accountCredentialsRepository.deleteAll();
}


// For Account

export function givenAccountData(data?: Partial<Account>) {
  return Object.assign(
    {
      email: 'testuser@test.com'
    },
    data,
  );
}

export async function givenAccount(data?: Partial<Account>) {
  const {accountRepository} = getRepositories();
  return accountRepository.create(givenAccountData(data));
}


// For Account Credentials

export function givenAccountCredentialsData(data?: Partial<AccountCredentials>) {
  return Object.assign(
    {
      password: 'test1234'
    },
    data,
  );
}

export async function givenAccountCredentials(data?: Partial<AccountCredentials>) {
  const {accountCredentialsRepository} = getRepositories();
  return accountCredentialsRepository.create(givenAccountCredentialsData(data));
}