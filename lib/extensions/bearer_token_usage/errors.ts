import { ErrorRegistry, ErrorRegistryError } from '../../errors';

/**
 * The access token provided is expired, revoked, malformed, or
 * invalid for other reasons. The resource SHOULD respond with
 * the HTTP 401 (Unauthorized) status code. The client MAY
 * request a new access token and retry the protected resource
 * request.
 */
export class InvalidTokenError extends ErrorRegistryError {}
ErrorRegistry.registerError('invalid_token', InvalidTokenError);

/**
 * The request requires higher privileges than provided by the
 * access token. The resource server SHOULD respond with the HTTP
 * 403 (Forbidden) status code and MAY include the "scope"
 * attribute with the scope necessary to access the protected
 * resource.
 */
export class InsufficientScopeError extends ErrorRegistryError {}
ErrorRegistry.registerError('insufficient_scope', InsufficientScopeError);
