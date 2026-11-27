// SPDX-License-Identifier: LicenseRef-Blockscout

import { splitDisplayPath } from './compose-file-list';

export function getBreadcrumbChunks(displayPath: string, hasRawPaths: boolean): Array<string> {
  const [ first, ...rest ] = splitDisplayPath(displayPath, hasRawPaths).path.split('/');

  return [ first === '' ? '/' : first, ...rest ];
}
