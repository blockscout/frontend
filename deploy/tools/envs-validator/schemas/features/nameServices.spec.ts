// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { nameServicesSchema } from './nameServices';

describe('nameServicesSchema', () => {
  it('accepts the name service and clusters settings', () => {
    expect(getValidationErrors(nameServicesSchema, {
      NEXT_PUBLIC_NAME_SERVICE_API_HOST: 'https://example.com',
      NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS: toEnvValue([ 'duck', 'goose' ]),
      NEXT_PUBLIC_CLUSTERS_API_HOST: 'https://example.com',
      NEXT_PUBLIC_CLUSTERS_CDN_URL: 'https://example.com',
    })).toEqual([]);
  });

  it.each([
    'NEXT_PUBLIC_NAME_SERVICE_API_HOST',
    'NEXT_PUBLIC_CLUSTERS_API_HOST',
  ])('rejects a malformed %s', (name) => {
    expect(getValidationErrors(nameServicesSchema, { [name]: 'not a url' })).toEqual([ `${ name } is not a valid URL` ]);
  });

  describe('NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS', () => {
    it('is rejected without the API host', () => {
      expect(getValidationErrors(nameServicesSchema, { NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS: toEnvValue([ 'duck' ]) })).toEqual([
        'NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS cannot not be used if NEXT_PUBLIC_NAME_SERVICE_API_HOST is not set',
      ]);
    });

    it('is rejected when empty', () => {
      expect(getValidationErrors(nameServicesSchema, {
        NEXT_PUBLIC_NAME_SERVICE_API_HOST: 'https://example.com',
        NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS: toEnvValue([]),
      })).toEqual([ 'NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS field must have at least 1 items' ]);
    });
  });

  describe('NEXT_PUBLIC_CLUSTERS_CDN_URL', () => {
    it('is rejected without the API host', () => {
      expect(getValidationErrors(nameServicesSchema, { NEXT_PUBLIC_CLUSTERS_CDN_URL: 'https://example.com' })).toEqual([
        'NEXT_PUBLIC_CLUSTERS_CDN_URL cannot not be used if NEXT_PUBLIC_CLUSTERS_API_HOST is not set',
      ]);
    });

    it('is rejected when malformed', () => {
      expect(getValidationErrors(nameServicesSchema, {
        NEXT_PUBLIC_CLUSTERS_API_HOST: 'https://example.com',
        NEXT_PUBLIC_CLUSTERS_CDN_URL: 'not a url',
      })).toEqual([ 'NEXT_PUBLIC_CLUSTERS_CDN_URL is not a valid URL' ]);
    });
  });
});
