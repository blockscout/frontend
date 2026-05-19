import type { PublicTagType } from './addressMetadata';

export type PublicTagApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PublicTagApplicationRow {
  id: number;
  address_hash: string;
  tag_name: string;
  tag_type: PublicTagType['type'];
  company_name: string | null;
  description: string | null;
  status: PublicTagApplicationStatus;
  inserted_at: string; // ISO 8601
  reject_reason: string | null;
}

export interface PublicTagApplicationsResponse {
  items: Array<PublicTagApplicationRow>;
  next_page_params: { items_count: number; page_number: number } | null;
}

export type AdminApiPaginationFilters = {
  status?: PublicTagApplicationStatus;
};
