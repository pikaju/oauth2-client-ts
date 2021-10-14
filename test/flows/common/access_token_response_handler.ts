import { expect } from 'chai';
import { InvalidResponseError } from '../../../lib/errors';
import { AccessTokenResponse } from '../../../lib/flows/common/access_token_response';

import { handleAccessTokenResponse } from '../../../lib/flows/common/access_token_response_handlers';

describe('handleAccessTokenResponse', () => {
  it('extracts the token info and includes it in a token credentials object', () => {
    const result = handleAccessTokenResponse({
      access_token: 'ey.access.token',
      token_type: 'Bearer',
      expires_in: 5,
      refresh_token: 'ey.refresh.token',
      scope: 'email.read',
    } as AccessTokenResponse);
    expect(result.accessToken).to.equal('ey.access.token');
    expect(result.tokenType).to.equal('Bearer');
    expect(result.expiresIn).to.equal(5);
    expect(result.refreshToken).to.equal('ey.refresh.token');
    expect(result.scope).to.equal('email.read');
  });

  it('throws when given invalid responses', () => {
    expect(() => handleAccessTokenResponse({ hi: 'how u doin' })).to.throw(InvalidResponseError);
  });
});
