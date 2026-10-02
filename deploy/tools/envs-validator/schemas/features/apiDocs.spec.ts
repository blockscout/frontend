// SPDX-License-Identifier: LicenseRef-Blockscout

import { API_DOCS_TABS } from 'src/features/api-docs/types/config';

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { apiDocsSchema } from './apiDocs';

describe('apiDocsSchema', () => {
  it('accepts an empty tab list', () => {
    expect(getValidationErrors(apiDocsSchema, { NEXT_PUBLIC_API_DOCS_TABS: toEnvValue([]) })).toEqual([]);
  });

  it('accepts every known tab id', () => {
    expect(getValidationErrors(apiDocsSchema, { NEXT_PUBLIC_API_DOCS_TABS: toEnvValue(API_DOCS_TABS) })).toEqual([]);
  });

  it('rejects an unknown tab id', () => {
    expect(getValidationErrors(apiDocsSchema, { NEXT_PUBLIC_API_DOCS_TABS: toEnvValue([ 'rest_api', 'soap_api' ]) })).toEqual([
      'NEXT_PUBLIC_API_DOCS_TABS.1: Invalid type: Expected ("rest_api" | "eth_rpc_api" | "rpc_api" | "graphql_api") but received "soap_api"',
    ]);
  });

  it('rejects a value that is not a JSON array', () => {
    expect(getValidationErrors(apiDocsSchema, { NEXT_PUBLIC_API_DOCS_TABS: 'rest_api' })).toEqual([
      'NEXT_PUBLIC_API_DOCS_TABS: Invalid JSON: Received "rest_api"',
    ]);
  });
});
