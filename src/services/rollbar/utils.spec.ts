import type { Dictionary } from 'rollbar';

import { describe, expect, it } from 'vitest';

import { isMonacoCdnError, isInjectedScriptError } from './utils';

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

describe('isInjectedScriptError', () => {
  it('matches any error whose origin frame is a userscript, regardless of class or message', () => {
    const item = {
      body: {
        trace: {
          exception: { 'class': 'TypeError', message: 'whatever' },
          frames: [ { filename: 'user-script:97', method: '[anonymous]' } ],
        },
      },
    } as unknown as Dictionary;

    expect(isInjectedScriptError(item)).toBe(true);
  });

  it('matches a ReferenceError from an inline script in the page document (in-app browser global)', () => {
    const documentUrl = 'https://host.blockscout.com/token/0xabc';
    const item = {
      request: { url: `${ documentUrl }?tab=holders&utm_source=app` },
      body: {
        trace: {
          exception: { 'class': 'ReferenceError', message: 'Can\'t find variable: inAppBrowserGlobal' },
          frames: [ { filename: documentUrl, method: 'global code' } ],
        },
      },
    } as unknown as Dictionary;

    expect(isInjectedScriptError(item)).toBe(true);
  });

  it('does not match a ReferenceError originating from our own app bundle', () => {
    const item = {
      request: { url: 'https://host.blockscout.com/token/0xabc' },
      body: {
        trace: {
          exception: { 'class': 'ReferenceError', message: 'foo is not defined' },
          frames: [ { filename: 'https://host.blockscout.com/_next/static/chunks/123.js', method: 't' } ],
        },
      },
    } as unknown as Dictionary;

    expect(isInjectedScriptError(item)).toBe(false);
  });

  it('does not match a non-ReferenceError thrown by an inline document script', () => {
    const documentUrl = 'https://host.blockscout.com/token/0xabc';
    const item = {
      request: { url: documentUrl },
      body: {
        trace: {
          exception: { 'class': 'TypeError', message: 'Cannot read properties of null' },
          frames: [ { filename: documentUrl, method: 'global code' } ],
        },
      },
    } as unknown as Dictionary;

    expect(isInjectedScriptError(item)).toBe(false);
  });
});
