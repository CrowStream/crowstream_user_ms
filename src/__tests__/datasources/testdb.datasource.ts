import {juggler} from '@loopback/repository';

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'crowstream_user_db',
  connector: 'memory',
});
