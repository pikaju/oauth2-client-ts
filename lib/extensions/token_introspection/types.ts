/* eslint-disable camelcase */

/**
 * Enum type of tokens available for introspection.
 *
 * TODO: This should be part of the token revocation extension, included
 * in some form of token type registry, as is done in the standard.
 *
 * @see {isTokenType} ts-auto-guard:type-guard
 */
export type TokenType = 'access_token' | 'refresh_token';
export { isTokenType } from './types.guard';

/**
 * JSON request of the OAuth 2.0 Token Introspection protocol.
 * @see {@link https://tools.ietf.org/html/rfc7662#section-2.1}
 * @see {isIntrospectionRequest} ts-auto-guard:type-guard
 */
export interface IntrospectionRequest {
  /**
   * The string value of the token. For access tokens, this
   * is the "access_token" value returned from the token endpoint
   * defined in OAuth 2.0 [RFC6749], Section 5.1. For refresh tokens,
   * this is the "refresh_token" value returned from the token endpoint
   * as defined in OAuth 2.0 [RFC6749], Section 5.1. Other token types
   * are outside the scope of this specification.
   */
  token: string;

  /**
   * A hint about the type of the token submitted for
   * introspection.  The protected resource MAY pass this parameter to
   * help the authorization server optimize the token lookup. If the
   * server is unable to locate the token using the given hint, it MUST
   * extend its search across all of its supported token types.  An
   * authorization server MAY ignore this parameter, particularly if it
   * is able to detect the token type automatically. Values for this
   * field are defined in the "OAuth Token Type Hints" registry defined
   * in OAuth Token Revocation [RFC7009].
   */
  token_type_hint?: TokenType;
}
export { isIntrospectionRequest } from './types.guard';

/**
 * JSON response of the OAuth 2.0 Token Introspection protocol.
 * @see {@link https://tools.ietf.org/html/rfc7662#section-2.2}
 * @see {isIntrospectionResponse} ts-auto-guard:type-guard
 */
export interface IntrospectionResponse {
  /**
   * Boolean indicator of whether or not the presented token
   * is currently active. The specifics of a token's "active" state
   * will vary depending on the implementation of the authorization
   * server and the information it keeps about its tokens, but a "true"
   * value return for the "active" property will generally indicate
   * that a given token has been issued by this authorization server,
   * has not been revoked by the resource owner, and is within its
   * given time window of validity (e.g., after its issuance time and
   * before its expiration time).
   */
  active: boolean;

  /**
   * A JSON string containing a space-separated list of
   * scopes associated with this token, in the format described in
   * Section 3.3 of OAuth 2.0 [RFC6749].
   */
  scope?: string;

  /** Client identifier for the OAuth 2.0 client that requested this token. */
  client_id?: string;

  /** Human-readable identifier for the resource owner who authorized this token. */
  username?: string;

  /** Type of the token as defined in Section 5.1 of OAuth 2.0 [RFC6749]. */
  token_type?: TokenType;

  /**
   * Integer timestamp, measured in the number of seconds since January 1 1970 UTC,
   * indicating when this token will expire, as defined in JWT [RFC7519].
   */
  exp?: number;

  /**
   * Integer timestamp, measured in the number of seconds since January 1 1970 UTC,
   * indicating when this token was originally issued, as defined in JWT [RFC7519].
   */
  iat?: number;

  /**
   * Integer timestamp, measured in the number of seconds since January 1 1970 UTC,
   * indicating when this token is not to be used before, as defined in JWT [RFC7519].
   */
  nbf?: number;

  /**
   * Subject of the token, as defined in JWT [RFC7519]. Usually a machine-readable
   * identifier of the resource owner who authorized this token.
   */
  sub?: string;

  /**
   * Service-specific string identifier or list of string identifiers representing
   * the intended audience for this token, as defined in JWT [RFC7519].
   */
  aud?: string;

  /** String representing the issuer of this token, as defined in JWT [RFC7519]. */
  iss?: string;

  /** String identifier for the token, as defined in JWT [RFC7519]. */
  jti?: string;
}
export { isIntrospectionResponse } from './types.guard';

/**
 * Information for a token provided by an introspection endpoint.
 * @see {@link https://tools.ietf.org/html/rfc7662#section-2.2}
 */
export type TokenInfo = IntrospectionResponse;
