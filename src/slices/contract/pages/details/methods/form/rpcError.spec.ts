import { BaseError, ContractFunctionExecutionError, HttpRequestError, InternalRpcError, LimitExceededRpcError, TimeoutError } from 'viem';

import { describe, expect, it } from 'vitest';

import { classifyRpcError, getRpcNotRespondingCopy } from './rpcError';

const URL = 'https://rpc.example.com';

function httpError(): HttpRequestError {
  return new HttpRequestError({ url: URL, status: 503 });
}

describe('classifyRpcError', () => {
  it.each([
    [ 'HttpRequestError', httpError() ],
    [ 'TimeoutError', new TimeoutError({ body: {}, url: URL }) ],
    [ 'LimitExceededRpcError', new LimitExceededRpcError(new Error('rate limited')) ],
    [ 'InternalRpcError', new InternalRpcError(new Error('internal')) ],
  ])('returns "not-responding" for a top-level %s', (_, error) => {
    expect(classifyRpcError(error)).toBe('not-responding');
  });

  it('finds the node failure deep in the cause chain', () => {
    const inner = httpError();
    const middle = new BaseError('wrapped', { cause: inner });
    const outer = new Error('outer', { cause: middle });

    expect(classifyRpcError(outer)).toBe('not-responding');
  });

  it('falls through for a contract revert', () => {
    const revert = new ContractFunctionExecutionError(new BaseError('execution reverted'), {
      abi: [],
      functionName: 'foo',
    });

    expect(classifyRpcError(revert)).toBe('other');
  });

  it('falls through for a plain error and for non-errors', () => {
    expect(classifyRpcError(new Error('boom'))).toBe('other');
    expect(classifyRpcError('boom')).toBe('other');
    expect(classifyRpcError(undefined)).toBe('other');
  });

  it('terminates on a self-referencing cause chain', () => {
    const error = new Error('loop');
    error.cause = error;

    expect(classifyRpcError(error)).toBe('other');
  });
});

describe('getRpcNotRespondingCopy', () => {
  it('offers a custom node while the default node is in use', () => {
    expect(getRpcNotRespondingCopy(false)).toEqual({
      text: 'The RPC node is not responding.',
      linkText: 'Try your own RPC node.',
    });
  });

  it('asks to change the URL while a custom node is in use', () => {
    expect(getRpcNotRespondingCopy(true)).toEqual({
      text: 'Your RPC node is not responding.',
      linkText: 'Check the RPC node URL and try again.',
    });
  });
});
