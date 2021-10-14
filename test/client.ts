import { expect } from 'chai';
import sinon from 'sinon';
import { Client } from '../lib/client';
import { ClientCredentials, TokenCredentials } from '../lib/credentials';
import { AutoRefreshTokenExpiredError } from '../lib/errors';

describe('Client', () => {
  const client = new Client({
    credentials: new ClientCredentials('clientId', 'clientSecret'),
    tokenEndpoint: 'sgehdn.io/auth/token',
  });

  it('can automatically refresh credentials', async () => {
    const credentials = new TokenCredentials('accessToken1', 'Bearer', -5, 'refreshToken', 'scope', new Date(Date.now()));

    const refreshedTokenStub = sinon.stub();
    refreshedTokenStub.onCall(0).returns(new TokenCredentials('accessToken2', 'Bearer'));
    refreshedTokenStub.onCall(1).returns(new TokenCredentials('accessToken3', 'Bearer'));

    client.refreshAccessToken = async (credentials) => { credentials.refreshWith(refreshedTokenStub()); };

    const resourceStub = sinon.stub();
    // The token should have been automatically refreshed already, as we started out with an outdated token.
    resourceStub.onCall(0).throws(new AutoRefreshTokenExpiredError());
    resourceStub.onCall(1).returns(5);

    await expect(client.autoRefreshToken<number>(credentials, resourceStub)).to.eventually.equal(5);
    expect(resourceStub.getCall(0).calledWith(sinon.match.has('accessToken', 'accessToken2')));
    expect(resourceStub.getCall(1).calledWith(sinon.match.has('accessToken', 'accessToken3')));
  });
});
