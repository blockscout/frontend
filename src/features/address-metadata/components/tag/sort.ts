// SPDX-License-Identifier: LicenseRef-Blockscout

export default function sortTags(tagA: { ordinal: number }, tagB: { ordinal: number }): number {
  if (tagA.ordinal < tagB.ordinal) {
    return 1;
  }

  if (tagA.ordinal > tagB.ordinal) {
    return -1;
  }

  return 0;
}
