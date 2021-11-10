import {
  Count,
  CountSchema, repository,
  Where
} from '@loopback/repository';
import {
  get, HttpErrors, param, post, requestBody, response
} from '@loopback/rest';
import {genSalt, hash} from 'bcryptjs';
import {Account, AccountCredentials, AccountCredentialsRequest} from '../models';
import {AccountCredentialsRepository, AccountRepository} from '../repositories';
import {AccountCredentialsSchema} from '../schemas';

export class AccountController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
    @repository(AccountCredentialsRepository) protected accountCredentialsRepository: AccountCredentialsRepository,
  ) { }

  // @post('/accounts/signin')
  // @response(200, {
  //   description: 'Login',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         'x-ts-type': AccountCredentialsSchema
  //       }
  //     }
  //   }
  // })
  // async signin(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: AccountCredentialsSchema,
  //       }
  //     }
  //   })
  //   credentials: AccountCredentials,
  // ): Promise<String> {
  //   return 'Login UwU';
  // }

  @post('/accounts/signup')
  @response(200, {
    description: 'Register a new account',
    content: {
      'application/json': {
        schema: AccountCredentialsSchema,
      }
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: AccountCredentialsSchema,
        },
      },
    })
    newAccountRequest: AccountCredentialsRequest,
  ): Promise<Account> {
    const existingAccount = await this.accountRepository.count(
      {
        email: newAccountRequest.email
      }
    );
    if (existingAccount.count > 0) {
      throw new HttpErrors[400]('The email provided is already in use');
    }

    const password = await hash(newAccountRequest.password, await genSalt());
    const newAccount = new Account({
      email: newAccountRequest.email,
    });
    const accountCreated = await this.accountRepository.create(newAccount);
    if (accountCreated === undefined) {
      throw new HttpErrors[500]('Account could not be created :c');
    }
    console.log('Account created:\n', accountCreated, '\n');

    const newAccountCredentials = new AccountCredentials({
      account_id: accountCreated.id,
      password,
    });
    const accountCredentialsCreated = await this.accountCredentialsRepository.create(newAccountCredentials);
    if (accountCredentialsCreated === undefined) {
      throw new HttpErrors[500]('Account could not be created :c');
    }

    return accountCreated;
  }

  @get('/account/count')
  @response(200, {
    description: 'Count all accounts registered',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Account) where?: Where<Account>,
  ): Promise<Count> {
    return this.accountRepository.count(where);
  }
}
