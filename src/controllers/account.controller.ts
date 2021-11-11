import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema, repository,
  Where
} from '@loopback/repository';
import {
  get, HttpErrors, param, post, requestBody, response
} from '@loopback/rest';
import {compare, genSalt, hash} from 'bcryptjs';
import {AccountCredentialsBody} from '../bodies';
import {Account, AccountCredentials} from '../models';
import {AccountCredentialsRepository, AccountRepository} from '../repositories';
import {AccountCredentialsSchema} from '../schemas';
import {AccountService} from '../services';

export class AccountController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
    @repository(AccountCredentialsRepository) protected accountCredentialsRepository: AccountCredentialsRepository,
    @inject('services.AccountService') public accountService: AccountService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) protected jwtService: TokenService,
    // @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE) protected refreshTokenService: RefreshTokenService,
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

  @post('/accounts/signin')
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
  ): Promise<String> {
    const errorMessage = 'Email or password invalid';

    const account = await this.accountService.findByEmail(credentials.email);
    if (account === null) {
      throw new HttpErrors[404](errorMessage);
    }

    const accountCredentials = await this.accountCredentialsRepository.findOne({
      where: {
        account_id: account.id
      }
    });
    if (accountCredentials === null) {
      throw new HttpErrors[404](errorMessage);
    }

    const doesPasswordMatch = await compare(
      credentials.password,
      accountCredentials.password
    );
    if (!doesPasswordMatch) {
      throw new HttpErrors[404](errorMessage);
    }

    const userProfile = this.accountService.convertToUserProfile(account);
    const accessToken = await this.jwtService.generateToken(userProfile);
    // const refreshToken = await this.refreshTokenService.generateToken(userProfile, accessToken);

    return accessToken;
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
