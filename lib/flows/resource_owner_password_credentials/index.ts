import qs from 'qs';

import { TokenCredentials } from '../../credentials';
import { ResourceOwnerPasswordCredentialsGrant } from '../../grant';
import { handleAccessTokenRequestErrors, handleAccessTokenResponse } from '../common/access_token_response_handlers';
import Flow from '../flow';
import { AccessTokenRequest } from './types';

/**
 * Helper class implementing the Resource Owner Password Credentials Grant flow.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-4.3}
 */
export class ResourceOwnerPasswordCredentialsFlow extends Flow {
  /**
   * Tries to fetch a token from the server by providing a Resource Owner Password Credentials Grant.
   *
   * @param grant Grant providing the username and password of the user to acquire a token with.
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
   * @see {@link https://tools.ietf.org/html/rfc6749#section-4.3}
   */
  async getToken(grant: ResourceOwnerPasswordCredentialsGrant, scope?: string): Promise<TokenCredentials> {
    // Get endpoint from client options.
    const endpoint = this.client.options.tokenEndpoint;

    // Perform the token HTTP request.
    const response = await this.client.httpClient.post(endpoint, qs.stringify({
      grant_type: 'password',
      username: grant.username,
      password: grant.password,
      scope,
    } as AccessTokenRequest), {
      headers: this.client.options.credentials.getRequestHeaders(),
    }).catch(handleAccessTokenRequestErrors);

    // Forward response to common response handler.
    return handleAccessTokenResponse(response.data);
  }
}
