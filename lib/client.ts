import axios, { AxiosInstance } from 'axios';
import { ClientCredentials, TokenCredentials } from './credentials';
import { AutoRefreshTokenExpiredError } from './errors';
import {
  ResourceOwnerPasswordCredentialsFlow,
  ClientCredentialsFlow,
  RefreshTokenFlow,
} from './flows';
import { RefreshTokenGrant } from './grant';

/**
 * Interface defining options to be supplied to the client.
 */
export interface ClientOptions {
  /** Client credentials used to retrieve user grants. */
  credentials: ClientCredentials;

  /** URL pointing to the OAuth 2.0 server's token endpoint. */
  tokenEndpoint: string;

  /** URL pointing to the OAuth 2.0 server's authorization endpoint. */
  authorizationEndpoint?: string;
}

/**
 * Class acting as the client while following the OAuth 2.0 Authorization Framework.
 * @see {@link https://tools.ietf.org/html/rfc6749}
 */
export class Client {
  /** HTTP client used for requests. */
  public httpClient: AxiosInstance;

  /**
   * Creates a new OAuth 2.0 client instance.
   * @param options Default client options used for all requests.
   */
  constructor(public readonly options: ClientOptions) {
    this.httpClient = axios.create({
      headers: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * Starts the Resource Owner Password Credentials Grant flow for authentication.
   * @returns The handle for the newly started flow.
   * @see {@link https://tools.ietf.org/html/rfc6749#section-4.3}
   */
  startResourceOwnerPasswordCredentialsFlow(): ResourceOwnerPasswordCredentialsFlow {
    return new ResourceOwnerPasswordCredentialsFlow(this);
  }

  /**
   * Starts the Client Credentials Grant flow for authentication.
   * @returns The handle for the newly started flow.
   * @see {@link https://tools.ietf.org/html/rfc6749#section-4.4}
   */
  startClientCredentialsFlow(): ClientCredentialsFlow {
    return new ClientCredentialsFlow(this);
  }

  /**
   * Starts a flow for refreshing access tokens using refresh tokens.
   * @returns The handle for the newly started flow.
   * @see {@link https://tools.ietf.org/html/rfc6749#section-6}
   */
  startRefreshTokenFlow(): RefreshTokenFlow {
    return new RefreshTokenFlow(this);
  }

  /**
   * Fetches a new set of token credentials from the server by providing a refresh token.
   *
   * @param credentials Token credentials to be updated. The token credentials must include a refresh token.
   * @param scope Optionally narrowed scopes of the original token.
   *
   * @throws {NetworkingError} if the request failed due to networking issues.
   * @throws {InvalidResponseError} if the server's response was invalid.
   * @throws {InvalidRequestError} if the server returned an `invalid_request` error code.
   * @throws {InvalidClientError} if the server returned an `invalid_client` error code.
   * @throws {InvalidGrantError} if the server returned an `invalid_grant` error code.
   * @throws {UnauthorizedClientError} if the server returned an `unauthorized_client` error code.
   * @throws {UnsupportedGrantTypeError} if the server returned an `unsupported_grant_type` error code.
   * @throws {InvalidScopeError} if the server returned an `invalid_scope` error code.
   *
   * @see {@link https://tools.ietf.org/html/rfc6749#section-6}
   */
  async refreshAccessToken(credentials: TokenCredentials, scope?: string): Promise<void> {
    if (!credentials.refreshToken) throw new Error('Provided credentials do not include a refresh token.');
    const refreshedCredentials = await this.startRefreshTokenFlow().getToken(new RefreshTokenGrant(credentials.refreshToken));
    credentials.refreshWith(refreshedCredentials);
  }

  /**
   * Performs a request to a protected resource and automatically refreshes
   * the token credentials whenever necessary.
   *
   * More specifically, the token is refreshed whenever its expiry confirms that it
   * is definitely expired. Once the token is potentially active, the callback is run.
   * If successful, the callback's result is returned. If the callback's result rejects with an
   * `AutoRefreshTokenExpiredError`, the token is once again refreshed and the entire
   * process is repeated. Other errors, meaning those produced by the callback as well as
   * those produced by the token refresh, are forwarded.
   *
   * @param credentials Token credentials that are passed to the callback and potentially refreshed.
   * @param callback Callback that uses token credentials to perform requests to a protected resource.
   *
   * @returns A promise that resolves with the result of the callback.
   *
   * @throws {NetworkingError} if the refresh failed due to networking issues.
   * @throws {InvalidResponseError} if the server's response was invalid during token refresh.
   * @throws {InvalidRequestError} if the server returned an `invalid_request` error code during token refresh.
   * @throws {InvalidClientError} if the server returned an `invalid_client` error code during token refresh.
   * @throws {InvalidGrantError} if the server returned an `invalid_grant` error code during token refresh.
   * @throws {UnauthorizedClientError} if the server returned an `unauthorized_client` error code during token refresh.
   * @throws {UnsupportedGrantTypeError} if the server returned an `unsupported_grant_type` error code during token refresh.
   * @throws {InvalidScopeError} if the server returned an `invalid_scope` error code during token refresh.
   */
  async autoRefreshToken<T>(credentials: TokenCredentials, callback: (credentials: TokenCredentials) => Promise<T>): Promise<T> {
    // Retry indefinitely, until we succeed or an intolerable error occurs.
    while (true) {
      if (credentials.expired) {
        // If the token is definitely expired, refresh immediately, that is,
        // without performing the resource request first.
        await this.refreshAccessToken(credentials);
      } else {
        // Otherwise, we request the resource, while still being prepared
        // that the request may fail due to an expired token.
        try {
          // If the callback succeeds, return the result.
          return await callback(credentials);
        } catch (err) {
          // Refresh if the callback reports that the token is expired.
          if (err instanceof AutoRefreshTokenExpiredError) await this.refreshAccessToken(credentials);
          else throw err;
        }
      }
    }
  }
}
