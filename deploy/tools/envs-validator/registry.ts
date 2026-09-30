// SPDX-License-Identifier: LicenseRef-Blockscout

const ENV_NAME_REGEXP = /NEXT_PUBLIC_\w+/g;
const TABLE_ROW_ENV_NAME_REGEXP = /^\| *(NEXT_PUBLIC_\w+)/gm;

export function parseEnvNames(envFileContent: string): Array<string> {
  return envFileContent
    .split('\n')
    .map((line) => line.split('=')[0].trim())
    .filter(Boolean);
}

export function extractEnvNames(markdown: string): Array<string> {
  const names = new Set(markdown.match(ENV_NAME_REGEXP) ?? []);
  return Array.from(names).sort();
}

export function extractDocumentedEnvNames(markdown: string): Array<string> {
  const names = new Set(Array.from(markdown.matchAll(TABLE_ROW_ENV_NAME_REGEXP), (match) => match[1]));
  return Array.from(names).sort();
}
