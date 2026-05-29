// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenInstance } from 'src/slices/token/types/api';
import type { Metadata } from 'src/slices/token/types/client';

import attributesParser from 'src/slices/token/utils/metadata/attributes-parser';

export default function parseMetadata(raw: TokenInstance['metadata'] | undefined): Metadata | undefined {
  if (!raw) {
    return;
  }

  const parsed: Metadata = {};

  if ('name' in raw && typeof raw.name === 'string') {
    parsed.name = raw.name;
  }

  if ('description' in raw && typeof raw.description === 'string') {
    parsed.description = raw.description;
  }

  if ('attributes' in raw && Array.isArray(raw.attributes)) {
    parsed.attributes = attributesParser(raw.attributes);
  }

  if (Object.keys(parsed).length === 0) {
    return;
  }

  return parsed;
}
