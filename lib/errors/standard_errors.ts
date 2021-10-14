import { ErrorRegistry, ErrorRegistryError } from './error_registry';

/**
 * The request is missing a required parameter, includes an
 * unsupported parameter value (other than grant type),
 * repeats a parameter, includes multiple credentials,
 * utilizes more than one mechanism for authenticating the
 * client, or is otherwise malformed.
 */
export class InvalidRequestError extends ErrorRegistryError {}
ErrorRegistry.registerError('invalid_request', InvalidRequestError);

/**
 * Client authentication failed (e.g., unknown client, no
 * client authentication included, or unsupported
 * authentication method). The authorization server MAY
 * return an HTTP 401 (Unauthorized) status code to indicate
 * which HTTP authentication schemes are supported. If the
 * client attempted to authenticate via the "Authorization"
 * request header field, the authorization server MUST
 * respond with an HTTP 401 (Unauthorized) status code and
 * include the "WWW-Authenticate" response header field
 * matching the authentication scheme used by the client.
 */
export class InvalidClientError extends ErrorRegistryError {}
ErrorRegistry.registerError('invalid_client', InvalidClientError);

/**
 * The provided authorization grant (e.g., authorization
 * code, resource owner credentials) or refresh token is
 * invalid, expired, revoked, does not match the redirection
 * URI used in the authorization request, or was issued to
 * another client.
 */
export class InvalidGrantError extends ErrorRegistryError {}
ErrorRegistry.registerError('invalid_grant', InvalidGrantError);

/**
 * The authenticated client is not authorized to use this
 * authorization grant type.
 */
export class UnauthorizedClientError extends ErrorRegistryError {}
ErrorRegistry.registerError('unauthorized_client', UnauthorizedClientError);

/**
 * The authorization grant type is not supported by the
 * authorization server.
 */
export class UnsupportedGrantTypeError extends ErrorRegistryError {}
ErrorRegistry.registerError('unsupported_grant_type', UnsupportedGrantTypeError);

/**
 * The requested scope is invalid, unknown, malformed, or
 * exceeds the scope granted by the resource owner.
 */
export class InvalidScopeError extends ErrorRegistryError {}
ErrorRegistry.registerError('invalid_scope', InvalidScopeError);
