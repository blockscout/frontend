// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { accountSchema } from './account';

const SUPPORTED = { NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'true' };

describe('accountSchema', () => {
  it('accepts the auth0 provider', () => {
    expect(getValidationErrors(accountSchema, { ...SUPPORTED, NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'auth0' })).toEqual([]);
  });

  it('accepts the expedited review HTML when the account is supported', () => {
    expect(getValidationErrors(accountSchema, {
      ...SUPPORTED,
      NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: '<p>Contact us</p>',
    })).toEqual([]);
  });

  it('accepts a disabled account alone', () => {
    expect(getValidationErrors(accountSchema, { NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'false' })).toEqual([]);
  });

  it('rejects a malformed account flag', () => {
    expect(getValidationErrors(accountSchema, { NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'yes' })).toEqual([
      'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: Expected "true" or "false" but received "yes"',
    ]);
  });

  it('rejects an unsupported auth provider, the removed dynamic one included', () => {
    expect(getValidationErrors(accountSchema, { ...SUPPORTED, NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'dynamic' })).toEqual([
      'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: Invalid type: Expected "auth0" but received "dynamic"',
    ]);
  });

  it('rejects the auth provider when the account is not supported', () => {
    expect(getValidationErrors(accountSchema, { NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'auth0' })).toEqual([
      'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
    ]);
  });

  it('rejects the expedited review HTML with a frame or an inline style', () => {
    expect(getValidationErrors(accountSchema, {
      ...SUPPORTED,
      NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: '<div style="position:fixed">Pay <iframe srcdoc="<script></script>"></iframe></div>',
    })).toEqual([
      'NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: HTML contains elements that are not allowed: style attribute on <div>, <iframe>',
    ]);
  });

  it('rejects the expedited review HTML when the account is not supported', () => {
    expect(getValidationErrors(accountSchema, { NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: '<p>Contact us</p>' })).toEqual([
      'NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
    ]);
  });
});
