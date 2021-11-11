import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  RefreshTokenServiceBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';

require('dotenv').config();

export {ApplicationConfig};

export class AccountMicroService extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Mount authentication system
    this.component(AuthenticationComponent);

    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // For jwt access token
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.ACCESS_TOKEN_SECRET || 'access_secret');
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.ACCESS_TOKEN_EXPIRATION_TIME || '3600');

    // For jwt refresh token
    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(process.env.REFRESH_TOKEN_SECRET || 'refresh_secret');
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(process.env.REFRESH_TOKEN_EXPIRATION_TIME || '604800');

    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
  }
}
