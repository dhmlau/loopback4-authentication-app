import {Client, expect} from '@loopback/testlab';
import {Loopback4AuthenticationAppApplication} from '../..';
import {setupApplication} from './test-helper';

describe('CustomerController', () => {
  let app: Loopback4AuthenticationAppApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes count', async () => {
    const res = await client.get('/customers/count').expect(200);
    expect(res.body).to.have.key('count');
  });
});
