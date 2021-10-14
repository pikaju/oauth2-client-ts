import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import qs from 'qs';

import '../setup';

import { Client } from '../../lib/client';
import { ClientCredentials } from '../../lib/credentials';
import { NetworkingError, InvalidGrantError } from '../../lib/errors';
import { AccessTokenResponse } from '../../lib/flows/common/access_token_response';

describe('Flow: Client Credentials Grant', () => {
  const credentials = new ClientCredentials('clientId', 'clientSecret');
  const requiredHeaders = {
    'Accept': 'application/json', // Not strictly required.
    'Content-Type': 'application/x-www-form-urlencoded',
    ...credentials.getRequestHeaders(),
  };

  const tokenResponse = {
    access_token: 'ey.nice.token',
    token_type: 'Bearer',
    expires_in: 5,
    refresh_token: 'ey.refresh.too',
    scope: 'email.read email.write',
  } as AccessTokenResponse;

  let client: Client;
  beforeEach(() => {
    client = new Client({
      credentials,
      tokenEndpoint: 'https://example.com/auth/token',
    });
    const adapter = new MockAdapter(client.httpClient);

    adapter
      .onPost(client.options.tokenEndpoint, qs.stringify({
        grant_type: 'client_credentials',
        scope: 'email.read',
      }), requiredHeaders)
      .reply(200, tokenResponse)
      .onPost(client.options.tokenEndpoint, qs.stringify({
        grant_type: 'client_credentials',
        scope: 'email.write',
      }), requiredHeaders)
      .networkError()
      .onPost(client.options.tokenEndpoint)
      .reply(400, { error: 'invalid_grant' });
  });

  it('returns the correct token credentials object', async () => {
    const handle = client.startClientCredentialsFlow();
    const token = await handle.getToken('email.read');
    expect(token.accessToken).to.equal(tokenResponse.access_token);
    expect(token.tokenType).to.equal(tokenResponse.token_type);
    expect(token.expiresIn).to.equal(tokenResponse.expires_in);
    expect(token.refreshToken).to.equal(tokenResponse.refresh_token);
    expect(token.scope).to.equal(tokenResponse.scope);
  });

  it('throws client errors', async () => {
    const handle = client.startClientCredentialsFlow();
    await expect(handle.getToken()).to.eventually.be.rejectedWith(InvalidGrantError);
  });

  it('throws networking errors', async () => {
    const handle = client.startClientCredentialsFlow();
    await expect(handle.getToken('email.write')).to.eventually.be.rejectedWith(NetworkingError);
  });
});
