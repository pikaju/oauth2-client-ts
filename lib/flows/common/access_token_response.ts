/* eslint-disable camelcase */

/**
 * Unified access token response for several flows as described by the specification.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-5.1}
 * @see {isAccessTokenResponse} ts-auto-guard:type-guard
 */
export interface AccessTokenResponse {
  /** The access token issued by the authorization server. */
  access_token: string;

  /** The type of the token issued as described in Section 7.1. Value is case insensitive. */
  token_type: string;

  /**
   * The lifetime in seconds of the access token.  For
   * example, the value "3600" denotes that the access token will
   * expire in one hour from the time the response was generated.
   * If omitted, the authorization server SHOULD provide the
   * expiration time via other means or document the default value.
   */
  expires_in: number;

  /**
   * The refresh token, which can be used to obtain new access tokens
   * using the same authorization grant as described in Section 6.
   */
  refresh_token?: string;

  /** The scope of the access token as described by Section 3.3. */
  scope?: string;
}
export { isAccessTokenResponse } from './access_token_response.guard';
