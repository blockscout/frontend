// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { API_DOCS_TABS } from 'src/features/api-docs/types/config';

import { envJson } from '../../utils';

export const apiDocsSchema = v.object({
  NEXT_PUBLIC_API_DOCS_TABS: v.optional(envJson(v.array(v.picklist(API_DOCS_TABS)))),
});
