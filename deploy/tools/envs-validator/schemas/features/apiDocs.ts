import * as yup from 'yup';
import { replaceQuotes } from 'client/config/utils/envs';
import type { ApiDocsTabId } from 'client/features/api-docs/types/config';
import { API_DOCS_TABS } from 'client/features/api-docs/types/config';

export const apiDocsSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_API_DOCS_TABS: yup.array()
      .transform(replaceQuotes)
      .json()
      .of(yup.string<ApiDocsTabId>().oneOf(API_DOCS_TABS)),
  });