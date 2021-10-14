import { TokenCredentials } from '../../credentials';
import {
  InvalidResponseError,
  createAxiosErrorHandler,
  InvalidRequestError,
  InvalidClientError,
  InvalidGrantError,
  UnauthorizedClientError,
  UnsupportedGrantTypeError,
  InvalidScopeError,
} from '../../errors';
import { AccessTokenResponse, isAccessTokenResponse } from './access_token_response';

/**
 * Handles axios errors that may occur during an access token request.
 */
export const handleAccessTokenRequestErrors = createAxiosErrorHandler([
  InvalidRequestError,
  InvalidClientError,
  InvalidGrantError,
  UnauthorizedClientError,
  UnsupportedGrantTypeError,
  InvalidScopeError,
]);

/**
 * Creates a TokenCredentials object based on the contents of a response.
 * @param response Response to extract token details from.
 * @param scope Scope parameter supplied in the request, which is used as a default.
 */
function createTokenFromAccessTokenResponse(response: AccessTokenResponse, scope?: string): TokenCredentials {
  return new TokenCredentials(
    response.access_token,
    response.token_type,
    response.expires_in,
    response.refresh_token,
    response.scope || scope,
    new Date(Date.now()),
  );
}

/**
 * Handles an access token response by either constructing a credentials object or
 * throwing the appropriate error.
 * @param response Access token response to be handled.
 * @returns A token credentials object containing the credentials provided by the server.
 * @throws {InvalidResponseError} if the server's response was invalid.
 */
export function handleAccessTokenResponse(response: unknown): TokenCredentials {
  // Validate the response object.
  if (!isAccessTokenResponse(response)) {
    throw new InvalidResponseError('Invalid access token response.', response);
  }
  return createTokenFromAccessTokenResponse(response);
}
