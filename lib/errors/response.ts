/* eslint-disable camelcase */

/**
 * Unified error response for several flows as described by the specification.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-5.2}
 * @see {isErrorResponse} ts-auto-guard:type-guard
 */
export interface ErrorResponse {
  /**
   * A single ASCII [USASCII] error code.
   */
  error: string;

  /**
   * Human-readable ASCII [USASCII] text providing additional information,
   * used to assist the client developer in understanding the error that occurred.
   */
  error_description?: string;

  /**
   * A URI identifying a human-readable web page with information about the error,
   * used to provide the client developer with additional information about the error.
   */
  error_uri?: string;
}
export { isErrorResponse } from './response.guard';
