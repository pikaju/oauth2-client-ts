import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import qs from 'qs';

import '../setup';

import { Client } from '../../lib/client';
import { ClientCredentials, TokenCredentials } from '../../lib/credentials';
import { NetworkingError, InvalidGrantError } from '../../lib/errors';
import { AccessTokenResponse } from '../../lib/flows/common/access_token_response';
import { RefreshTokenGrant } from '../../lib/grant';

describe('Flow: Refresh Token', () => {
  const clientCredentials = new ClientCredentials('clientId', 'clientSecret');
  const requiredHeaders = {
    'Accept': 'application/json', // Not strictly required.
    'Content-Type': 'application/x-www-form-urlencoded',
    ...clientCredentials.getRequestHeaders(),
  };

  const validGrant = new RefreshTokenGrant('ey.refresh.token');
  const networkingErrorGrant = new RefreshTokenGrant('ey.network.error');

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
      credentials: clientCredentials,
      tokenEndpoint: 'https://example.com/auth/token',
    });
    const adapter = new MockAdapter(client.httpClient);

    adapter
      .onPost(client.options.tokenEndpoint, qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: validGrant.refreshToken,
        scope: 'email.read',
      }), requiredHeaders)
      .reply(200, tokenResponse)
      .onPost(client.options.tokenEndpoint, qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: networkingErrorGrant.refreshToken,
      }), requiredHeaders)
      .networkError()
      .onPost(client.options.tokenEndpoint)
      .reply(400, { error: 'invalid_grant' });
  });

  it('returns the correct token credentials object', async () => {
    const handle = client.startRefreshTokenFlow();
    const token = await handle.getToken(validGrant, 'email.read');
    expect(token.accessToken).to.equal(tokenResponse.access_token);
    expect(token.tokenType).to.equal(tokenResponse.token_type);
    expect(token.expiresIn).to.equal(tokenResponse.expires_in);
    expect(token.refreshToken).to.equal(tokenResponse.refresh_token);
    expect(token.scope).to.equal(tokenResponse.scope);
  });

  it('throws client errors', async () => {
    const handle = client.startClientCredentialsFlow();
    await expect(handle.getToken('ey.invalid.refresh_token')).to.eventually.be.rejectedWith(InvalidGrantError);
  });

  it('throws networking errors', async () => {
    const handle = client.startRefreshTokenFlow();
    await expect(handle.getToken(networkingErrorGrant)).to.eventually.be.rejectedWith(NetworkingError);
  });
});
