import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import '../setup';

import { Client } from '../../lib/client';
import { ClientCredentials, TokenCredentials } from '../../lib/credentials';
import { InvalidClientError, InvalidOptionsError, NetworkingError } from '../../lib/errors';
import '../../lib/extensions/token_introspection';
import { IntrospectionResponse } from '../../lib/extensions/token_introspection/types';

describe('Client', () => {
  const activeTokenInfo = <const>{
    active: true,
    token_type: 'access_token',
    client_id: 'clientId',
    username: 'jsc',
  };
  const credentials = new TokenCredentials('token', 'Bearer');
  const requiredHeaders = {
    'Accept': 'application/json', // Not strictly required.
    'Content-Type': 'application/x-www-form-urlencoded',
    ...credentials.getRequestHeaders(),
  };

  let client: Client;
  beforeEach(() => {
    client = new Client({
      credentials: new ClientCredentials('clientId', 'clientSecret'),
      tokenEndpoint: 'https://example.com/auth/token',
      introspectionEndpoint: 'https://example.com/auth/introspect',
    });
    const adapter = new MockAdapter(client.httpClient);

    adapter
      .onPost(client.options.introspectionEndpoint, 'token=ey.valid.access.token', requiredHeaders)
      .reply(200, activeTokenInfo as IntrospectionResponse)
      .onPost(client.options.introspectionEndpoint, 'token=ey.unauthorized_client.token', requiredHeaders)
      .reply(400, { error: 'invalid_client' })
      .onPost(client.options.introspectionEndpoint, 'token=ey.networking.error.token', requiredHeaders)
      .networkError()
      .onPost(client.options.introspectionEndpoint)
      .reply(200, { active: false } as IntrospectionResponse);
  });

  it('detects missing introspection endpoint option', async () => {
    const client = new Client({
      credentials: new ClientCredentials('clientId', 'clientSecret'),
      tokenEndpoint: 'https://example.com/auth/token',
    });
    await expect(client.introspect(credentials, 'ey.how.u.doin')).to.eventually.be.rejectedWith(InvalidOptionsError);
  });

  it('returns the correct token info object', async () => {
    await expect(client.introspect(credentials, 'ey.valid.access.token')).to.eventually.eql(activeTokenInfo);
    await expect(client.introspect(credentials, 'ey.invalid.token')).to.eventually.eql({ active: false });
  });

  it('throws networking errors', async () => {
    await expect(client.introspect(credentials, 'ey.networking.error.token')).to.eventually.be.rejectedWith(NetworkingError);
  });

  it('throws client errors', async () => {
    await expect(client.introspect(credentials, 'ey.unauthorized_client.token')).to.eventually.be.rejectedWith(InvalidClientError);
  });
});
