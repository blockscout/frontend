import { describe, expect, it } from 'vitest';

import { isMonacoCdnError, isIgnoredExceptionClass } from './utils';

describe('isIgnoredExceptionClass', () => {
  it('matches an AbortError so both Rollbar instances drop it', () => {
    const item = {
      body: { trace: { exception: { 'class': 'AbortError', message: 'signal is aborted without reason' } } },
    };

    expect(isIgnoredExceptionClass(item)).toBe(true);
  });

  it('matches a NotFoundError provoked by a DOM-mutating extension', () => {
    const item = {
      body: { trace: { exception: { 'class': 'NotFoundError', message: 'Failed to execute \'removeChild\' on \'Node\'' } } },
    };

    expect(isIgnoredExceptionClass(item)).toBe(true);
  });

  it('does not match a genuine application error class', () => {
    const item = {
      body: { trace: { exception: { 'class': 'TypeError', message: 'Cannot read properties of undefined' } } },
    };

    expect(isIgnoredExceptionClass(item)).toBe(false);
  });

  it('does not match a message-only item with no exception class', () => {
    const item = { body: { message: { body: 'Something went wrong' } } };

    expect(isIgnoredExceptionClass(item)).toBe(false);
  });
});

describe('isMonacoCdnError', () => {
  it('matches a worker importScripts failure reported as a message with no stack', () => {
    const item = {
      body: {
        message: {
          body: 'Uncaught NetworkError: Failed to execute \'importScripts\' on \'WorkerGlobalScope\': ' +
            'The script at \'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/base/worker/workerMain.js\' failed to load.',
        },
      },
    };

    expect(isMonacoCdnError(item)).toBe(true);
  });

  it('matches a trace that enters through app code but reaches the Monaco CDN bundle deeper in the stack', () => {
    const item = {
      body: {
        trace: {
          exception: { 'class': 'Error', message: 'Can only have one anonymous define call per script file' },
          frames: [
            { filename: 'https://host.blockscout.com/_next/static/chunks/64926.js', method: 'getProvider' },
            { filename: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/editor/editor.main.js', method: 'define' },
          ],
        },
      },
    };

    expect(isMonacoCdnError(item)).toBe(true);
  });

  it('does not match an unrelated app error', () => {
    const item = {
      body: {
        trace: {
          exception: { 'class': 'TypeError', message: 'Cannot read properties of undefined' },
          frames: [
            { filename: 'https://host.blockscout.com/_next/static/chunks/12345.js', method: 'render' },
          ],
        },
      },
    };

    expect(isMonacoCdnError(item)).toBe(false);
  });

  it('does not throw on a malformed item with neither message nor frames', () => {
    expect(isMonacoCdnError({ body: {} })).toBe(false);
  });
});
