export interface EnsDomain {
  id: string;
  name: string;
  resolved_address: {
    hash: string;
  } | null;
  owner: {
    hash: string;
  } | null;
  wrapped_owner: {
    hash: string;
  } | null;
  registration_date?: string;
  expiry_date: string | null;
}

export interface EnsDomainDetailed extends EnsDomain {
  tokens: Array<{ id: string; contract_hash: string; type: 'NATIVE_DOMAIN_TOKEN' | 'WRAPPED_DOMAIN_TOKEN' }>;
  registrant: {
    hash: string;
  } | null;
  other_addresses: Record<string, string>;
}

export interface EnsDomainEvent {
  transaction_hash: string;
  timestamp: string;
  from_address: {
    hash: string;
  } | null;
  action?: string;
}

export interface EnsAddressLookupResponse {
  items: Array<EnsDomain>;
  next_page_params: {
    page_token: string;
    page_size: number;
  } | null;
}

export interface EnsDomainEventsResponse {
  items: Array<EnsDomainEvent>;
}

export interface EnsDomainLookupResponse {
  items: Array<EnsDomain>;
  next_page_params: {
    page_token: string;
    page_size: number;
  } | null;
}

export interface EnsAddressLookupFilters {
  address: string | null;
  resolved_to: boolean;
  owned_by: boolean;
  only_active: boolean;
}

export interface EnsDomainLookupFilters {
  name: string | null;
  only_active: boolean;
}

export interface EnsLookupSorting {
  sort: 'registration_date';
  order: 'ASC' | 'DESC';
}

export type EnsDomainLookupFiltersOptions = Array<'resolved_to' | 'owned_by' | 'with_inactive'>;
