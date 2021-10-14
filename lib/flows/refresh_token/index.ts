import qs from 'qs';

import { TokenCredentials } from '../../credentials';
import { handleAccessTokenRequestErrors, handleAccessTokenResponse } from '../common/access_token_response_handlers';
import Flow from '../flow';
import { RefreshTokenGrant } from '../../grant';
import { AccessTokenRequest } from './types';

/**
 * Helper class implementing the refreshing of access tokens using a refresh token.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-6}
 */
export class RefreshTokenFlow extends Flow {
  /**
   * Fetches set of token credentials from the server by providing a refresh token as a grant.
   *
   * @param grant Grant containing the refresh token.
   * @param scope Optionally narrowed scopes of the original token.
   *
   * @returns A new set of credentials with a refreshed access token.
   *
   * @throws {NetworkingError} if the request failed due to networking issues.
   * @throws {InvalidResponseError} if the server's response was invalid.
   * @throws {InvalidRequestError} if the server returned an `invalid_request` error code.
   * @throws {InvalidClientError} if the server returned an `invalid_client` error code.
   * @throws {InvalidGrantError} if the server returned an `invalid_grant` error code.
   * @throws {UnauthorizedClientError} if the server returned an `unauthorized_client` error code.
   * @throws {UnsupportedGrantTypeError} if the server returned an `unsupported_grant_type` error code.
   * @throws {InvalidScopeError} if the server returned an `invalid_scope` error code.
   *
   * @see {@link https://tools.ietf.org/html/rfc6749#section-6}
   */
  async getToken(grant: RefreshTokenGrant, scope?: string): Promise<TokenCredentials> {
    // Get endpoint from client options.
    const endpoint = this.client.options.tokenEndpoint;

    // Perform the token HTTP request.
    const response = await this.client.httpClient.post(endpoint, qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: grant.refreshToken,
      scope,
    } as AccessTokenRequest), {
      headers: this.client.options.credentials.getRequestHeaders(),
    }).catch(handleAccessTokenRequestErrors);

    // Forward response to common response handler.
    return handleAccessTokenResponse(response.data);
  }
}
