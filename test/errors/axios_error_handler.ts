import { expect } from 'chai';
import {
  createAxiosErrorHandler, InvalidClientError, InvalidResponseError, NetworkingError,
} from '../../lib/errors';

describe('createAxiosErrorHandler', () => {
  it('throws when given non-axios errors', () => {
    expect(() => createAxiosErrorHandler([])({})).to.throw();
  });

  it('throws when detecting networking errors', () => {
    expect(() => createAxiosErrorHandler([])({ isAxiosError: true })).to.throw(NetworkingError);
  });

  it('throws when detecting invalid error responses', () => {
    expect(() => createAxiosErrorHandler([])({ isAxiosError: true, response: { data: 'hi' } })).to.throw(InvalidResponseError);
  });

  it('throws when catching unexpected error codes', () => {
    expect(() => createAxiosErrorHandler([])({ isAxiosError: true, response: { data: { error: 'not_included' } } })).to.throw(InvalidResponseError);
  });

  it('throws registry errors', () => {
    expect(() => createAxiosErrorHandler([InvalidClientError])({ isAxiosError: true, response: { data: { error: 'invalid_client' } } })).to.throw(InvalidClientError);
  });
});
