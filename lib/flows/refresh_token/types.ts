/* eslint-disable camelcase */

/**
 * Type representing a request to refresh an access token using a refresh token.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-6}
 * @see {isAccessTokenRequest} ts-auto-guard:type-guard
 */
export interface AccessTokenRequest {
  grant_type: 'refresh_token';
  refresh_token: string;
  scope?: string;
}
export { isAccessTokenRequest } from './types.guard';

export * from '../common/access_token_response';
