import qs from 'qs';

// The Token Introspection standard builds on the Bearer Token Usage standard.
import { InvalidTokenError } from '../bearer_token_usage';

import { Client } from '../../client';
import { ClientCredentials, TokenCredentials } from '../../credentials';
import {
  createAxiosErrorHandler, InvalidClientError, InvalidOptionsError, InvalidResponseError,
} from '../../errors';
import {
  TokenType,
  IntrospectionRequest,
  isIntrospectionResponse,
  TokenInfo,
} from './types';

/**
 * Token introspection extensions for the base OAuth 2.0 client.
 * @see {@link https://tools.ietf.org/html/rfc7662}
 */
declare module '../../client' {
  interface ClientOptions {
    /**
     * URL pointing to the OAuth 2.0 server's token introspection endpoint.
     * @see {@link https://tools.ietf.org/html/rfc7662#section-2}
     */
    introspectionEndpoint?: string;
  }

  interface Client {
    /**
     * Performs an OAuth 2.0 Token Introspection request.
     *
     * @param credentials Credentials used to authenticate the introspection request.
     * @param token Token to be introspected.
     * @param tokenTypeHint Optional hint for the authorization server regarding the token type.
     *
     * @returns Token info returned by the server.
     *
     * @throws {InvalidOptionsError} if no token introspection endpoint was specified in the client options.
     * @throws {NetworkingError} if the request failed due to networking issues.
     * @throws {InvalidResponseError} if the server's response was invalid.
     * @throws {InvalidClientError} if the server returned an `invalid_client` error code.
     * @throws {InvalidTokenError} if the server returned an `invalid_token` error code.
     *
     * @see {@link https://tools.ietf.org/html/rfc7662}
     */
    introspect(credentials: ClientCredentials | TokenCredentials, token: string, tokenTypeHint?: TokenType): Promise<TokenInfo>;
  }
}

Client.prototype.introspect = async function (credentials: ClientCredentials | TokenCredentials, token: string, tokenTypeHint?: TokenType): Promise<TokenInfo> {
  // Retrieve endpoint URL from client options.
  const endpoint = this.options.introspectionEndpoint;
  if (typeof endpoint !== 'string') throw new InvalidOptionsError('Missing token introspection endpoint in options.');

  // Perform HTTP introspection request.
  const response = await this.httpClient.post(endpoint, qs.stringify({
    token,
    token_type_hint: tokenTypeHint,
  } as IntrospectionRequest), {
    headers: credentials.getRequestHeaders(),
  }).catch(createAxiosErrorHandler([
    InvalidClientError,
    InvalidTokenError,
  ]));

  // Validate response object.
  const data = response.data as unknown;
  if (!isIntrospectionResponse(data)) throw new InvalidResponseError('Invalid token introspection response body.', data);

  return data;
};
