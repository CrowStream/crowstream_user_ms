import {TokenService} from '@loopback/authentication';
import {
  TokenServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema, Where
} from '@loopback/repository';
import {
  get, HttpErrors, param, post, requestBody, response
} from '@loopback/rest';
import {AccountCredentialsBody} from '../bodies';
import {Account, AccountCredentials} from '../models';
import {AccountCredentialsSchema} from '../schemas';
import {AccountCredentialsService, AccountService} from '../services';

export class AccountController {
  constructor(
    @inject('services.AccountCredentialsService') protected accountCredentialsService: AccountCredentialsService,
    @inject('services.AccountService') public accountService: AccountService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) protected jwtService: TokenService,
  ) { }

  @post('/signup')
  @response(201, {
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
    newAccountRequest: AccountCredentialsBody,
  ): Promise<Account> {
    const existingAccount = await this.accountService.findByEmail(newAccountRequest.email);
    if (existingAccount !== null) {
      throw new HttpErrors[400]('The email provided is already in use');
    }

    const newAccount = new Account({
      email: newAccountRequest.email,
    });
    const accountCreated = await this.accountService.create(newAccount);
    if (accountCreated === undefined) {
      throw new HttpErrors[500]('Account could not be created :c');
    }

    const password = await this.accountCredentialsService.getPasswordHash(newAccountRequest.password);
    const newAccountCredentials = new AccountCredentials({
      account_id: accountCreated.id,
      password,
    });
    const accountCredentialsCreated = await this.accountCredentialsService.create(newAccountCredentials);
    if (accountCredentialsCreated === undefined) {
      throw new HttpErrors[500]('Account could not be created :c');
    }

    return accountCreated;
  }

  @post('/account/signin')
  @response(200, {
    description: 'Login',
    content: {
      'application/json': {
        schema: AccountCredentialsSchema
      }
    }
  })
  async signin(
    @requestBody({
      content: {
        'application/json': {
          schema: AccountCredentialsSchema,
        }
      }
    })
    credentials: AccountCredentialsBody,
  ): Promise<{token: string}> {
    const errorMessage = 'Email or password invalid';

    const account = await this.accountService.findByEmail(credentials.email);
    if (account === null) {
      throw new HttpErrors[404](errorMessage);
    }

    const accountCredentials = await this.accountCredentialsService.findByAccountId(account.id);
    if (accountCredentials === null) {
      throw new HttpErrors[404](errorMessage);
    }

    const doesPasswordMatch = await this.accountCredentialsService.comparePassword(
      credentials.password,
      accountCredentials.password
    );
    if (!doesPasswordMatch) {
      throw new HttpErrors[404](errorMessage);
    }

    const userProfile = this.accountService.convertToUserProfile(account);
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/account/count')
  @response(200, {
    description: 'Count all accounts registered',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Account) where?: Where<Account>,
  ): Promise<Count> {
    return this.accountService.count(where);
  }
}
