import {Client} from '@loopback/testlab';
import {AccountMicroService} from '../..';
import {givenEmptyDataBase} from '../helpers/database.helpers';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: AccountMicroService;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  beforeEach(givenEmptyDataBase);

  after(async () => {
    await app.stop();
  });

  // it('invokes GET /ping', async () => {
  //   const res = await client.get('/ping?msg=world').expect(200);
  //   expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  // });

  // TODO: Follow this tutorial: https://loopback.io/doc/en/lb4/Testing-your-application.html#create-a-stub-repository
});
