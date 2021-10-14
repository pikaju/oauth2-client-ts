import { isAxiosError } from 'axios';
import { InvalidResponseError, NetworkingError } from './basic';
import { ErrorRegistry, ErrorRegistryError, UnknownErrorCodeError } from './error_registry';
import { isErrorResponse } from './response.guard';

declare module 'axios' {
  function isAxiosError(err: unknown): err is AxiosError;
}

/** Function type of axios error handlers. */
type AxiosErrorHandler = (err: unknown) => never;

/**
 * Creates an error handler for failed HTTP requests made using an axios client.
 * @param expectedErrors A list of error types that is considered valid for the particular request.
 */
export function createAxiosErrorHandler(expectedErrors: (typeof ErrorRegistryError)[]): AxiosErrorHandler {
  return (err: unknown): never => {
    if (!isAxiosError(err)) throw new Error('Called axios error handler with non-axios error.');
    const { response } = err;

    // Treat missing response data as networking errors.
    if (response === undefined) throw new NetworkingError('No response was retrieved from the server.');
    const data = response.data as unknown;

    // Handle invalid responses.
    if (!isErrorResponse(data)) throw new InvalidResponseError('Server\'s error response does not conform to a known format.', data);

    let error: ErrorRegistryError;
    try {
    // Create error registry's entry for the error code.
      error = ErrorRegistry.createError(data.error, data.error_description, data.error_uri);
    } catch (err) {
      if (err instanceof UnknownErrorCodeError) throw new InvalidResponseError(`Unknown error code "${data.error}"`, data);
      throw err;
    }

    // Treat unexpected error types as invalid responses.
    if (expectedErrors.indexOf(error.constructor as typeof ErrorRegistryError) === -1) throw new InvalidResponseError(`Unexpected error code "${data.error}".`, data);

    // If the error is legal, throw it.
    throw error;
  };
}
