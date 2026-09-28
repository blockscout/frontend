// SPDX-License-Identifier: LicenseRef-Blockscout

import { isHiddenTag } from './is-hidden-tag';

interface ProtocolTagCandidate {
  readonly tagType: string;
  readonly meta?: { readonly hidden?: unknown } | null;
}

export function getVisibleProtocolTags<T extends ProtocolTagCandidate>(tags: ReadonlyArray<T> | undefined): Array<T> {
  return tags?.filter((tag) => tag.tagType === 'protocol' && !isHiddenTag(tag)) ?? [];
}
