import { expect } from 'chai';
import {
  DuplicateErrorRegistryEntryError, ErrorRegistry, ErrorRegistryError, UnknownErrorCodeError,
} from '../../lib/errors';

describe('ErrorRegistry', () => {
  it('tolerates registering the same error twice', () => {
    class Error extends ErrorRegistryError {}
    expect(ErrorRegistry.registerError('test.same_error_twice.error', Error)).to.be.undefined;
    expect(ErrorRegistry.registerError('test.same_error_twice.error', Error)).to.be.undefined;
  });

  it('throws when registering different errors under the same code', () => {
    class Error1 extends ErrorRegistryError {}
    class Error2 extends ErrorRegistryError {}
    expect(ErrorRegistry.registerError('test.throws_same_code.error1', Error1)).to.be.undefined;
    expect(() => ErrorRegistry.registerError('test.throws_same_code.error1', Error2)).to.throw(DuplicateErrorRegistryEntryError);
  });

  it('can create registered errors', () => {
    class Error extends ErrorRegistryError {}
    ErrorRegistry.registerError('test.create_registered.error', Error);
    expect(ErrorRegistry.createError('test.create_registered.error')).to.be.instanceOf(Error);
  });

  it('throws when trying to create unregistered errors', () => {
    expect(() => ErrorRegistry.createError('test.create_unregistered.error')).to.throw(UnknownErrorCodeError);
  });
});
