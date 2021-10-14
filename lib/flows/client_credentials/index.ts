import qs from 'qs';

import { TokenCredentials } from '../../credentials';
import { handleAccessTokenRequestErrors, handleAccessTokenResponse } from '../common/access_token_response_handlers';
import Flow from '../flow';
import { AccessTokenRequest } from './types';

/**
 * Helper class implementing the Client Credentials Grant flow.
 *
 * @see {@link https://tools.ietf.org/html/rfc6749#section-4.4}
 */
export class ClientCredentialsFlow extends Flow {
  /**
   * Tries to fetch a token from the server by providing a Client Credentials Grant.
   *
   * @param scope Space-separated scopes to be requested from the authorization server.
   *
   * @returns Promise that resolves with the token credentials provided by the server.
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
   * @see {@link https://tools.ietf.org/html/rfc6749#section-4.4}
   */
  async getToken(scope?: string): Promise<TokenCredentials> {
    // Get endpoint from client options.
    const endpoint = this.client.options.tokenEndpoint;

    // Perform the token HTTP request.
    const response = await this.client.httpClient.post(endpoint, qs.stringify({
      grant_type: 'client_credentials',
      scope,
    } as AccessTokenRequest), {
      headers: this.client.options.credentials.getRequestHeaders(),
    }).catch(handleAccessTokenRequestErrors);

    // Forward response to common response handler.
    return handleAccessTokenResponse(response.data);
  }
}
