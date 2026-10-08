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

// The API may list the same source several times with paths that differ only by prefix
// (`a.sol`, `/a.sol`, `./a.sol`), sometimes repeating the main file in `additional_sources`.
// After normalization they map to one Monaco model URI, and creating it twice crashes the editor.
// Only byte-identical repeats are dropped; the same path with different content is a backend bug
// that should stay visible rather than be silently resolved here.
function isRepeat(file: File, index: number, files: Array<File>): boolean {
  return files.findIndex((item) => item.file_path === file.file_path && item.source_code === file.source_code) !== index;
}

export function getEditorData(contractInfo: SmartContract | undefined): Array<File> | undefined {
  if (!contractInfo || !contractInfo.source_code) {
    return undefined;
  }

  const mainFile: File = {
    file_path: formatFilePath(contractInfo.file_path || `index.${ getMainFileExtension(contractInfo.language) }`),
    source_code: contractInfo.source_code,
  };

  const additionalFiles: Array<File> = (contractInfo.additional_sources || [])
    .filter((source) => source.file_path && source.source_code)
    .map((source) => ({
      source_code: source.source_code || '',
      file_path: formatFilePath(source.file_path || ''),
    }));

  return [ mainFile, ...additionalFiles ].filter((file, index, files) => !isRepeat(file, index, files));
}
