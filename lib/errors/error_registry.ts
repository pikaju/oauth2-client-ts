import { BaseError } from './basic';

/**
 * Error thrown when two dfferent error types are registered
 * in the error registry with the same error code.
 */
export class DuplicateErrorRegistryEntryError extends BaseError {}

/**
 * Error thrown when attempting to find and throw an error
 * from the registry that is not registered.
 */
export class UnknownErrorCodeError extends BaseError {}

/**
 * Base type for all errors registered in the error registry.
 */
export abstract class ErrorRegistryError extends BaseError {
  constructor(
    /** A single ASCII [USASCII] error code. */
    public readonly error: string,
    /**
     * Human-readable ASCII [USASCII] text providing
     * additional information, used to assist the client developer in
     * understanding the error that occurred.
     */
    public readonly errorDescription?: string,
    /**
     * A URI identifying a human-readable web page with
     * information about the error, used to provide the client
     * developer with additional information about the error.
     */
    public readonly errorUri?: string,
  ) {
    super(`Error code "${error}"${errorDescription ? `: ${errorDescription}` : ''}`);
  }
}

/** Constructor of errors to be registered in the registry. */
type ErrorRegistryErrorConstructor = new (error: string, errorDescription?: string, errorUri?: string) => ErrorRegistryError;

/**
 * Class managing all OAuth 2.0 error codes together with their respective TypeScript types.
 * This is supposed to mimic the error registry introduced by the OAuth 2.0 specification.
 * @see https://tools.ietf.org/html/rfc6749#section-8.5
 */
export abstract class ErrorRegistry {
  private static registeredErrors = new Map<string, ErrorRegistryErrorConstructor>();

  /**
   * Registers an error in the registry. Registering the same error with the same code multiple times is legal.
   * @param errorCode Code to register the error under.
   * @param errorType Type of the error for use in code.
   * @throws {DuplicateErrorRegistryEntryError} if a different error type is already registered with the same error code.
   */
  static registerError(errorCode: string, errorType: ErrorRegistryErrorConstructor): void {
    const currentEntry = ErrorRegistry.registeredErrors.get(errorCode);
    if (currentEntry === undefined) {
      ErrorRegistry.registeredErrors.set(errorCode, errorType);
    } else if (currentEntry !== errorType) {
      throw new DuplicateErrorRegistryEntryError(`Tried to register ${errorType.toString()} with code "${errorCode}" even though ${currentEntry.toString()} is already registered.`);
    }
  }

  /**
   * Creates an instance of an error from the registry with the correct type based on an error code.
   * @param error Code of the error to be created.
   * @param errorDescription An optional description to be supplied to the error.
   * @param errorUri An optional error URI to be supplied to the error.
   * @returns An error instance, if the error code was found in the registry.
   * @throws {UnknownErrorCodeError} if the desired error code was not found.
   */
  static createError(error: string, errorDescription?: string, errorUri?: string): ErrorRegistryError {
    const ErrorConstructor = ErrorRegistry.registeredErrors.get(error);
    if (!ErrorConstructor) {
      throw new UnknownErrorCodeError(`Error code "${error}" was not found in the registry.`);
    }
    return new ErrorConstructor(error, errorDescription, errorUri);
  }
}
