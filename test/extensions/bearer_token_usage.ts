import { expect } from 'chai';

import { TokenCredentials } from '../../lib/credentials';
import { UnsupportedTokenTypeError } from '../../lib/errors';
import '../../lib/extensions/bearer_token_usage';

describe('TokenCredentials', () => {
  it('may be converted to an HTTP Authorization request header field', () => {
    expect(new TokenCredentials('token', 'Bearer', 5, 'refresh', 'scope').getRequestHeaders()).to.eql({ Authorization: 'Bearer token' });
    expect(() => new TokenCredentials('token', 'NotBearer').getRequestHeaders()).to.throw(UnsupportedTokenTypeError);
  });
  it('may be converted to an HTTP body parameters', () => {
    expect(new TokenCredentials('token', 'Bearer', 5, 'refresh', 'scope').getBodyParameters()).to.eql({ access_token: 'token' });
    expect(() => new TokenCredentials('token', 'NotBearer').getBodyParameters()).to.throw(UnsupportedTokenTypeError);
  });
  it('may be converted to an HTTP query parameters', () => {
    expect(new TokenCredentials('token', 'Bearer', 5, 'refresh', 'scope').getQueryParameters()).to.eql({ access_token: 'token' });
    expect(() => new TokenCredentials('token', 'NotBearer').getQueryParameters()).to.throw(UnsupportedTokenTypeError);
  });
  it('can be reconstructed from an HTTP Authorization header', () => {
    expect(TokenCredentials.fromAuthorizationHeader('Bearer token').tokenType).to.equal('Bearer');
    expect(TokenCredentials.fromAuthorizationHeader('Bearer token').accessToken).to.equal('token');
    expect(() => TokenCredentials.fromAuthorizationHeader('Unknown token type')).to.throw(UnsupportedTokenTypeError);
  });
});
