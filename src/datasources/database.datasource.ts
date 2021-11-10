import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

require('dotenv').config();

const config = {
  name: 'database',
  connector: 'postgresql',
  url: '',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DatabaseDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'database';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.database', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
