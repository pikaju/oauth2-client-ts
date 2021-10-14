import { expect } from 'chai';
import { ClientCredentials, TokenCredentials } from '../lib/credentials';

describe('ClientCredentials', () => {
  it('produces the correct HTTP headers', () => {
    expect(new ClientCredentials('clientId').getRequestHeaders()).to.eql({ Authorization: 'Basic Y2xpZW50SWQ6' });
    expect(new ClientCredentials('clientId', 'clientSecret').getRequestHeaders()).to.eql({ Authorization: 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0' });
  });
  it('does not allow colons in client IDs', () => {
    expect(() => new ClientCredentials('client:Id').getRequestHeaders()).to.throw();
  });
});

describe('TokenCredentials', () => {
  it('correctly detects expired or non-expired tokens', () => {
    expect(new TokenCredentials('token', 'Bearer', 5000, 'refresh', 'email.read', new Date(Date.now())).expired).to.be.false;
    expect(new TokenCredentials('token', 'Bearer', -5, 'refresh', 'email.read', new Date(Date.now())).expired).to.be.true;
    expect(new TokenCredentials('token', 'Bearer', 5, 'refresh', 'email.read', new Date(Date.now() - 5000)).expired).to.be.true;
    expect(new TokenCredentials('token', 'Bearer', 5).expired).to.be.undefined;
    expect(new TokenCredentials('token', 'Bearer').expired).to.be.undefined;
  });

  it('correctly merges with refreshed information', () => {
    const credentials = new TokenCredentials(
      'oldToken',
      'OldBearer',
      3600,
      'oldRefreshToken',
      'old.scope',
      new Date(5),
    );

    const refreshedCredentials = new TokenCredentials(
      'newToken',
      'NewBearer',
      undefined,
      undefined,
      undefined,
      new Date(6),
    );

    credentials.refreshWith(refreshedCredentials);

    expect(credentials.accessToken).to.equal('newToken');
    expect(credentials.tokenType).to.equal('NewBearer');
    expect(credentials.expiresIn).to.equal(undefined);
    expect(credentials.refreshToken).to.equal('oldRefreshToken');
    expect(credentials.scope).to.equal('old.scope');
    expect(credentials.issuedAt).to.eql(new Date(6));
  });
});
