/* eslint-disable camelcase */

import { TokenCredentials } from '../../credentials';
import { UnsupportedTokenTypeError } from '../../errors';

/**
 * Bearer token usage extension for the TokenCredentials class.
 * @see {@link https://tools.ietf.org/html/rfc6750}
 */
declare module '../../credentials' {
  interface TokenCredentials {
    /**
     * For Bearer tokens, creates HTTP headers that can be used to authorize a request using these credentials.
     * @returns An object containing the HTTP header fields.
     * @throws {UnsupportedTokenTypeError} if the token is not of type `Bearer`.
     * @see {@link https://tools.ietf.org/html/rfc6750#section-2.1}
     */
    getRequestHeaders(): { Authorization: string };

    /**
     * For Bearer tokens, creates HTTP body parameters for use in an `application/x-www-form-urlencoded` request.
     * @returns An object containing the HTTP body parameters.
     * @throws {UnsupportedTokenTypeError} if the token is not of type `Bearer`.
     * @see {@link https://tools.ietf.org/html/rfc6750#section-2.2}
     */
    getBodyParameters(): { access_token: string };

    /**
     * For Bearer tokens, creates HTTP query parameters to authorize a request.
     * @returns An object containing the HTTP query parameters.
     * @throws {UnsupportedTokenTypeError} if the token is not of type `Bearer`.
     * @see {@link https://tools.ietf.org/html/rfc6750#section-2.3}
     */
    getQueryParameters(): { access_token: string };
  }

  // Namespace is required to create static extension method.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TokenCredentials {
    /**
     * Constructs a TokenCredentials object off of an HTTP Authorization header.
     * @param headerValue The value part of the authorization header.
     * @returns Reconstructed TokenCredentials.
     * @throws {UnsupportedTokenTypeError} if the token type is currently not supported.
     */
    function fromAuthorizationHeader(headerValue: string): TokenCredentials;
  }
}

TokenCredentials.prototype.getRequestHeaders = function getRequestHeaders(): { Authorization: string } {
  if (this.tokenType.toLowerCase() !== 'bearer') {
    throw new UnsupportedTokenTypeError('Can only create request headers for bearer tokens.', this.tokenType);
  }
  return { Authorization: `Bearer ${this.accessToken}` };
};

TokenCredentials.prototype.getBodyParameters = function getBodyParameters(): { access_token: string } {
  if (this.tokenType.toLowerCase() !== 'bearer') {
    throw new UnsupportedTokenTypeError('Can only create body parameters for bearer tokens.', this.tokenType);
  }
  return { access_token: this.accessToken };
};

TokenCredentials.prototype.getQueryParameters = function getQueryParameters(): { access_token: string } {
  if (this.tokenType.toLowerCase() !== 'bearer') {
    throw new UnsupportedTokenTypeError('Can only create query parameters for bearer tokens.', this.tokenType);
  }
  return { access_token: this.accessToken };
};

TokenCredentials.fromAuthorizationHeader = (headerValue: string): TokenCredentials => {
  if (!/^Bearer /i.test(headerValue)) throw new UnsupportedTokenTypeError('Can only create credentials for bearer tokens.');
  return new TokenCredentials(headerValue.substring(headerValue.indexOf(' ') + 1), 'Bearer');
};
