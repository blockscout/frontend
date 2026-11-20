// SPDX-License-Identifier: LicenseRef-Blockscout

import type { File } from 'src/shared/code-editor/types';
import type { SmartContract } from 'src/slices/contract/types/api';

import formatFilePath from 'src/shared/code-editor/utils/formatFilePath';

function getMainFileExtension(language: SmartContract['language']): string {
  switch (language) {
    case 'vyper':
      return 'vy';
    case 'yul':
      return 'yul';
    case 'scilla':
      return 'scilla';
    case 'stylus_rust':
      return 'rs';
    case 'geas':
      return 'eas';
    default:
      return 'sol';
  }
}

interface Source {
  readonly rawPath: string;
  readonly sourceCode: string;
}

export interface EditorData {
  readonly files: Array<File>;
  readonly isTreePossible: boolean;
}

// The API may list one source several times under paths that differ only by prefix (`a.sol`, `/a.sol`, `./a.sol`).
// Solidity treats these as distinct source units, so they may legitimately carry different code,
// while a folder tree can hold only one file per normalized path.
// The Solidity path-resolution rules - https://docs.soliditylang.org/en/latest/path-resolution.html
function hasConflict(sources: Array<Source>): boolean {
  const contentByNormalizedPath = new Map<string, string>();

  for (const source of sources) {
    const normalizedPath = formatFilePath(source.rawPath);
    const seenContent = contentByNormalizedPath.get(normalizedPath);

    if (seenContent !== undefined && seenContent !== source.sourceCode) {
      return true;
    }

    contentByNormalizedPath.set(normalizedPath, source.sourceCode);
  }

  return false;
}

function isRepeat(file: File, index: number, files: Array<File>): boolean {
  return files.findIndex((item) => (
    item.key === file.key &&
    // Stryker disable next-line ConditionalExpression: reached only when hasConflict() is false, where equal keys already mean equal content
    item.source_code === file.source_code
  )) !== index;
}

function toNormalizedFile({ rawPath, sourceCode }: Source): File {
  const normalizedPath = formatFilePath(rawPath);

  return { key: normalizedPath, display_path: normalizedPath, source_code: sourceCode };
}

// The raw path cannot be the key: the editor reads a key back from the Monaco model URI,
// which merges `a.sol` with `/a.sol` and cuts a path at `#` or `?`.
function toRawFile({ rawPath, sourceCode }: Source, index: number): File {
  return { key: `/${ index }`, display_path: rawPath, source_code: sourceCode };
}

export function getEditorData(contractInfo: SmartContract | undefined): EditorData | undefined {
  if (!contractInfo || !contractInfo.source_code) {
    return undefined;
  }

  const mainSource: Source = {
    rawPath: contractInfo.file_path || `index.${ getMainFileExtension(contractInfo.language) }`,
    sourceCode: contractInfo.source_code,
  };

  const additionalSources: Array<Source> = (contractInfo.additional_sources || [])
    .flatMap((source) => source.file_path && source.source_code ? { rawPath: source.file_path, sourceCode: source.source_code } : []);

  const sources = [ mainSource, ...additionalSources ];

  if (hasConflict(sources)) {
    return { files: sources.map(toRawFile), isTreePossible: false };
  }

  return {
    files: sources.map(toNormalizedFile).filter((file, index, files) => !isRepeat(file, index, files)),
    isTreePossible: true,
  };
}
