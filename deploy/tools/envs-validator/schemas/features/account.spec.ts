// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { accountSchema } from './account';

const SUPPORTED = { NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'true' };

describe('accountSchema', () => {
  it('accepts the auth0 provider without an environment id', () => {
    expect(getValidationErrors(accountSchema, { ...SUPPORTED, NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'auth0' })).toEqual([]);
  });

  it('accepts the dynamic provider with an environment id', () => {
    expect(getValidationErrors(accountSchema, {
      ...SUPPORTED,
      NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'dynamic',
      NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID: 'xxx',
    })).toEqual([]);
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
      'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED must be a `boolean` type, but the final value was: `"yes"`.',
    ]);
  });

  it('rejects an unsupported auth provider', () => {
    expect(getValidationErrors(accountSchema, { ...SUPPORTED, NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'okta' })).toEqual([
      'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER must be one of the following values: auth0, dynamic',
    ]);
  });

  it('rejects the auth provider when the account is not supported', () => {
    expect(getValidationErrors(accountSchema, { NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'auth0' })).toEqual([
      'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
    ]);
  });

  it('rejects the dynamic provider without an environment id', () => {
    expect(getValidationErrors(accountSchema, { ...SUPPORTED, NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'dynamic' })).toEqual([
      'NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID is a required field',
    ]);
  });

  it('rejects the environment id with a provider other than dynamic', () => {
    expect(getValidationErrors(accountSchema, {
      ...SUPPORTED,
      NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: 'auth0',
      NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID: 'xxx',
    })).toEqual([
      'NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID can only be used if NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER is set to \'dynamic\' ',
    ]);
  });

  it('rejects the expedited review HTML when the account is not supported', () => {
    expect(getValidationErrors(accountSchema, { NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: '<p>Contact us</p>' })).toEqual([
      'NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
    ]);
  });
});
