/**
 * Base type for all client errors produced by this library.
 */
export abstract class BaseError extends Error {}

/**
 * Error indicating the options supplied for the client were either
 * invalid or insufficient for the attempted action.
 */
export class InvalidOptionsError extends BaseError {}

/**
 * Error that is thrown whenever a networking error occurred.
 */
export class NetworkingError extends BaseError {}

/**
 * Error indicating that the response received from the server was invalid.
 */
export class InvalidResponseError extends BaseError {
  constructor(message?: string, public readonly response?: unknown) {
    super(message);
  }
}

/**
 * Error indicating that the response received from the server was invalid.
 */
export class UnsupportedTokenTypeError extends BaseError {
  constructor(message?: string, public readonly tokenType?: unknown) {
    super(message);
  }
}

/**
 * Error to be thrown by auto refresh callback functions
 * to indicate that a token is definitely expired.
 */
export class AutoRefreshTokenExpiredError extends BaseError {
  constructor() {
    super('Access token is expired.');
  }
}
