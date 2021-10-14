import { Base64 } from 'js-base64';

/**
 * Value object class for client credentials.
 * May be used in the context of OAuth 2.0.
 */
export class ClientCredentials {
  /**
   * Creates a new credentials value object.
   * @param clientId The ID of the client.
   * @param clientSecret The client secret. May be undefined.
   */
  constructor(public readonly clientId: string, public readonly clientSecret?: string) {}

  /**
   * Creates HTTP headers that can be used to authorize a request using these credentials.
   * @return An object containing the HTTP header fields.
   */
  getRequestHeaders(): Record<string, string> {
    if (this.clientId.indexOf(':') !== -1) {
      throw new Error('Cannot construct Basic HTTP Authorization header for client IDs that contain colons.');
    }
    const colonSeparated = `${this.clientId}:${this.clientSecret || ''}`;
    const base64 = Base64.encode(colonSeparated, true);
    return {
      Authorization: `Basic ${base64}`,
    };
  }
}

/**
 * Class representing an OAuth 2.0 access token as well as token
 * attributes and an optional refresh token.
 */
export class TokenCredentials {
  constructor(
    public accessToken: string,
    public tokenType: string,
    public expiresIn?: number,
    public refreshToken?: string,
    public scope?: string,
    /** Time at which the access token was issued. */
    public issuedAt?: Date,
  ) {}

  /** `Date` at which the access token will definitely be expired, or `undefined` if no expiry is known. */
  get expiresAt(): Date | undefined {
    if (!this.issuedAt || !this.expiresIn) return undefined;
    return new Date(this.issuedAt.getTime() + this.expiresIn * 1000);
  }

  /** True, if the access token is definitely expired, undefined if the expiry is unknown, false otherwise. */
  get expired(): boolean | undefined {
    return this.expiresAt ? this.expiresAt.getTime() <= Date.now() : undefined;
  }

  /**
   * Updates these credentials' information based on information acquired by a token refresh.
   *
   * More specifically, the old refresh token and scope is kept if the refreshed token credentials
   * do not include said information, whereas all other information is overwritten.
   * The new credentials are left untouched.
   *
   * @param credentials Credentials whose information should be merged into this one.
   */
  refreshWith(credentials: TokenCredentials): void {
    this.accessToken = credentials.accessToken;
    this.tokenType = credentials.tokenType;
    this.expiresIn = credentials.expiresIn;
    this.refreshToken ??= credentials.refreshToken;
    this.scope ??= credentials.scope;
    this.issuedAt = credentials.issuedAt;
  }

  /**
   * Creates a copy of this credentials object.
   * @returns The new instance.
   */
  clone(): TokenCredentials {
    return new TokenCredentials(
      this.accessToken,
      this.tokenType,
      this.expiresIn,
      this.refreshToken,
      this.scope,
      this.issuedAt,
    );
  }
}
