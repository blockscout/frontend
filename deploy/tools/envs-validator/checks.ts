// SPDX-License-Identifier: LicenseRef-Blockscout

import { DEPRECATED_ENVS } from './deprecations';
import schema from './schema';
import schemaMultichain from './schema_multichain';
import { getValidationErrors } from './utils';

export const ENVS_WITH_JSON_CONFIG: ReadonlyArray<string> = [
  'NEXT_PUBLIC_FEATURED_NETWORKS',
  'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL',
  'NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL',
  'NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL',
  'NEXT_PUBLIC_FOOTER_LINKS',
  'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL',
  'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL',
  'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG',
];

export type EnvMap = Readonly<Record<string, string>>;

export interface CheckInput {
  readonly envs: EnvMap;
  readonly registryNames: ReadonlyArray<string>;
  readonly buildTimeNames: ReadonlyArray<string>;
  readonly jsonConfigs: EnvMap;
}

export interface CheckReport {
  readonly ok: boolean;
  readonly deprecationWarnings: ReadonlyArray<string>;
  readonly placeholderErrors: ReadonlyArray<string>;
  readonly validationErrors: ReadonlyArray<string>;
}

export function pickAppEnvs(env: Readonly<Record<string, string | undefined>>): Record<string, string> {
  return Object.entries(env)
    .filter(([ key ]) => key.startsWith('NEXT_PUBLIC_'))
    .reduce((result, [ key, value ]) => {
      result[key] = value || '';
      return result;
    }, {} as Record<string, string>);
}

export function findDeprecationWarnings(envs: EnvMap): Array<string> {
  return DEPRECATED_ENVS
    .filter(({ name }) => envs[name] !== undefined)
    .map(({ message }) => message);
}

export function findEnvsWithoutPlaceholder(
  envs: EnvMap,
  registryNames: ReadonlyArray<string>,
  buildTimeNames: ReadonlyArray<string>,
): Array<string> {
  return Object.keys(envs)
    .filter((name) => !buildTimeNames.includes(name))
    .filter((name) => !registryNames.includes(name));
}

export function substituteJsonConfigs(envs: EnvMap, jsonConfigs: EnvMap): Record<string, string> {
  const result = { ...envs };
  for (const name of ENVS_WITH_JSON_CONFIG) {
    if (result[name]) {
      result[name] = jsonConfigs[name] || '[]';
    }
  }
  return result;
}

export function validateEnvs(envs: EnvMap, jsonConfigs: EnvMap): Array<string> {
  const value = substituteJsonConfigs(envs, jsonConfigs);
  const activeSchema = value.NEXT_PUBLIC_MULTICHAIN_ENABLED === 'true' ? schemaMultichain : schema;
  return getValidationErrors(activeSchema, value);
}

export function runChecks(input: CheckInput): CheckReport {
  const deprecationWarnings = findDeprecationWarnings(input.envs);
  const placeholderErrors = findEnvsWithoutPlaceholder(input.envs, input.registryNames, input.buildTimeNames);

  if (placeholderErrors.length > 0) {
    return { ok: false, deprecationWarnings, placeholderErrors, validationErrors: [] };
  }

  const validationErrors = validateEnvs(input.envs, input.jsonConfigs);

  return { ok: validationErrors.length === 0, deprecationWarnings, placeholderErrors, validationErrors };
}
