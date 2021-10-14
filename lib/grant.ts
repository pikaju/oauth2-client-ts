import { ClientCredentials, TokenCredentials } from './credentials';

/**
 * Base class for all OAuth 2.0 grant types.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-1.3}
 */
export abstract class AuthorizationGrant {
  abstract get grantType(): string;
}

/**
 * OAuth 2.0 authorization code grant.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-1.3.1}
 */
export class AuthorizationCodeGrant extends AuthorizationGrant {
  constructor(public readonly code: string) {
    super();
  }

  get grantType(): string { return 'authorization_code'; }
}

/**
 * OAuth 2.0 resource owner password credentials grant.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-1.3.3}
 */
export class ResourceOwnerPasswordCredentialsGrant extends AuthorizationGrant {
  constructor(public readonly username: string, public readonly password: string) {
    super();
  }

  get grantType(): string { return 'password'; }
}

/**
 * OAuth 2.0 client credentials grant.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-1.3.4}
 */
export class ClientCredentialsGrant extends AuthorizationGrant {
  constructor(public readonly clientCredentials: ClientCredentials) {
    super();
  }

  get grantType(): string { return 'client_credentials'; }
}

/**
 * Grant representing a refresh token.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-6}
 */
export class RefreshTokenGrant extends AuthorizationGrant {
  constructor(public readonly refreshToken: string) {
    super();
  }

  get grantType(): string { return 'refresh_token'; }
}
