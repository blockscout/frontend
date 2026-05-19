import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import { ADDRESS_HASH } from './addressParams';

export const PUBLIC_TAG_APPLICATION_ROW: PublicTagApplicationRow = {
  id: 1,
  address_hash: ADDRESS_HASH,
  tag_name: 'Example Tag',
  tag_type: 'name',
  company_name: 'Example Corp',
  description: 'A test tag for display purposes',
  status: 'pending',
  inserted_at: '2026-05-20T10:00:00.000000Z',
  reject_reason: null,
};
