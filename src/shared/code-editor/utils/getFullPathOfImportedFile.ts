// SPDX-License-Identifier: LicenseRef-Blockscout

import { stripLeadingSlash, stripTrailingSlash } from 'src/toolkit/utils/url';

// FIXME support multiline imports - https://base-goerli.blockscout.com/address/0x3442844D5d4938CA70f8C227dB88F6069C0b82A9?tab=contract

export default function getFullPathOfImportedFile(baseFilePath: string, importedFilePath: string, compilerRemappings?: Array<string>) {
  if (importedFilePath[0] !== '.') {
    const result = applyCompilerRemappings(baseFilePath, importedFilePath, compilerRemappings);

    return result[0] === '/' ? result : '/' + result;
  }

  return resolveRelativeImportPath(baseFilePath, importedFilePath);
}

// how remappings work - https://docs.soliditylang.org/en/v0.8.13/path-resolution.html#import-remapping
function applyCompilerRemappings(baseFilePath: string, importedFilePath: string, compilerRemappings: Array<string> | undefined): string {
  if (!compilerRemappings || compilerRemappings.length === 0) {
    return importedFilePath;
  }

  const remapping = formatCompilerRemappings(compilerRemappings)
    .find((remapping) => isRemappingApplicable(remapping, baseFilePath, importedFilePath));

  if (!remapping?.prefix || !remapping.target) {
    return importedFilePath;
  }

  return importedFilePath.replace(remapping.prefix, remapping.target);
}

function isRemappingApplicable({ context, prefix }: Remapping, baseFilePath: string, importedFilePath: string): boolean {
  if (context) {
    const contextPart = '/' + stripLeadingSlash(stripTrailingSlash(context));
    return baseFilePath.startsWith(contextPart + '/') && importedFilePath.startsWith(prefix);
  }

  return importedFilePath.startsWith(prefix);
}

function resolveRelativeImportPath(baseFilePath: string, importedFilePath: string): string | undefined {
  const result: Array<string> = stripLeadingSlash(baseFilePath).split('/').slice(0, -1);

  for (const element of importedFilePath.split('/')) {
    if (element === '.') {
      continue;
    }

    if (element !== '..') {
      result.push(element);
      continue;
    }

    if (result.length === 0) {
      break;
    }

    result.pop();
  }

  if (result.length === 0) {
    return;
  }

  return '/' + result.join('/');
}

interface Remapping {
  context?: string;
  prefix: string;
  target: string;
}

function formatCompilerRemappings(remappings: Array<string>): Array<Remapping> {
  return remappings.map((item) => {
    const chunks = item.split(':');

    const [ prefix, target ] = chunks[chunks.length - 1].split('=');
    return {
      context: chunks.length > 1 ? chunks[0] : undefined,
      prefix,
      target,
    };
  });
}
