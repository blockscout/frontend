// SPDX-License-Identifier: LicenseRef-Blockscout

import formatFilePath from './formatFilePath';

const RAW_PREFIXES = [ './', '/' ];

export default function getFilePathParts(path: string, tabsPathChunks: Array<Array<string>>): [string, string | undefined] {
  const tabsPaths = tabsPathChunks.map((chunks) => chunks.join('/'));
  const chunks = formatFilePath(path).split('/');
  const fileName = chunks[chunks.length - 1];
  const folderName = hasTwinTab(path, tabsPathChunks) ?
    getTwinFolderName(path, chunks) :
    getFolderName(chunks, tabsPaths.map((tabPath) => formatFilePath(tabPath).split('/')));

  return [ fileName, folderName ];
}

export function hasTwinTab(path: string, tabsPathChunks: Array<Array<string>>): boolean {
  const normalizedPath = formatFilePath(path);

  return tabsPathChunks.some((tabChunks) => {
    const tabPath = tabChunks.join('/');
    return tabPath !== path && formatFilePath(tabPath) === normalizedPath;
  });
}

function getTwinFolderName(path: string, normalizedChunks: Array<string>): string | undefined {
  const rawPrefix = RAW_PREFIXES.find((prefix) => path.startsWith(prefix)) ?? '';
  const folders = normalizedChunks.slice(1, -1);

  if (folders.length === 0) {
    return rawPrefix || undefined;
  }

  return rawPrefix + (folders.length > 1 ? '…/' : '') + folders[folders.length - 1];
}

function getFolderName(chunks: Array<string>, tabsPathChunks: Array<Array<string>>): string | undefined {
  const fileName = chunks[chunks.length - 1];
  const otherTabsPathChunks = tabsPathChunks.filter((item) => item.join('/') !== chunks.join('/'));
  const tabsWithSameFileName = otherTabsPathChunks.filter((tabChunks) => tabChunks[tabChunks.length - 1] === fileName);

  if (tabsWithSameFileName.length === 0 || chunks.length <= 1) {
    return;
  }

  if (chunks.length === 2) {
    return './' + chunks[chunks.length - 2];
  }

  let result = '/' + chunks[chunks.length - 2];

  for (let index = 3; index <= chunks.length; index++) {
    const element = chunks[chunks.length - index];

    if (element === '') {
      result = '.' + result;
    }

    const subFolderNames = tabsWithSameFileName.map((tab) => tab[tab.length - index]);
    if (subFolderNames.includes(element)) {
      result = '/' + element + result;
    } else {
      break;
    }
  }

  return result;
}
