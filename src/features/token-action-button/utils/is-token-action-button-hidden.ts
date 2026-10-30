// SPDX-License-Identifier: LicenseRef-Blockscout

import { SERVICE_TAG_TYPE } from 'src/features/address-metadata/utils/is-hidden-tag';

export const TOKEN_ACTION_BUTTON_HIDDEN_TAG_SLUG = 'token_action_button_hidden';

interface TagCandidate {
  readonly slug: string;
  readonly tagType: string;
}

export function isTokenActionButtonHidden(tags: ReadonlyArray<TagCandidate> | undefined): boolean {
  return tags?.some((tag) => tag.tagType === SERVICE_TAG_TYPE && tag.slug === TOKEN_ACTION_BUTTON_HIDDEN_TAG_SLUG) ?? false;
}
