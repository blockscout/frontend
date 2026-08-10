import type { Dictionary } from 'rollbar';

import { describe, expect, it } from 'vitest';

import { isMonacoCdnError } from './utils';

describe('isMonacoCdnError', () => {
  it('matches a worker importScripts failure reported as a message with no stack', () => {
    const item = {
      body: {
        message: {
          body: 'Uncaught NetworkError: Failed to execute \'importScripts\' on \'WorkerGlobalScope\': ' +
            'The script at \'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/base/worker/workerMain.js\' failed to load.',
        },
      },
    } as unknown as Dictionary;

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
    } as unknown as Dictionary;

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
    } as unknown as Dictionary;

    expect(isMonacoCdnError(item)).toBe(false);
  });

  it('does not throw on a malformed item with neither message nor frames', () => {
    expect(isMonacoCdnError({ body: {} } as unknown as Dictionary)).toBe(false);
  });
});
