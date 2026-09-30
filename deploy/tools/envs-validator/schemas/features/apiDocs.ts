// SPDX-License-Identifier: LicenseRef-Blockscout

import * as yup from 'yup';

import type { ApiDocsTabId } from 'src/features/api-docs/types/config';
import { API_DOCS_TABS } from 'src/features/api-docs/types/config';

import { replaceQuotes } from 'src/config/utils/envs';

export const apiDocsSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_API_DOCS_TABS: yup.array()
      .transform(replaceQuotes)
      .json()
      .of(yup.string<ApiDocsTabId>().oneOf(API_DOCS_TABS)),
  });
