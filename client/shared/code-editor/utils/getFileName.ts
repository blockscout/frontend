// SPDX-License-Identifier: LicenseRef-Blockscout

export default function getFileName(path: string) {
  const chunks = path.split('/');

  return chunks[chunks.length - 1];
}
