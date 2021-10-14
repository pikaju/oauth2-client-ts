import { Client } from '../client';

/**
 * Base class for all authorization flow implementations.
 * @see {@link https://tools.ietf.org/html/rfc6749#section-4}
 */
export default abstract class Flow {
  constructor(protected client: Client) {}
}
