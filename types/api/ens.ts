export interface EnsDomain {
  id: string;
  name: string;
  resolvedAddress: {
    hash: string;
  } | null;
  owner: {
    hash: string;
  } | null;
  registrationDate?: string;
  expiryDate: string | null;
}

export interface EnsDomainDetailed extends EnsDomain {
  tokenId: string;
  registrant: {
    hash: string;
  } | null;
  otherAddresses: Record<string, string>;
}

export interface EnsDomainEvent {
  transactionHash: string;
  timestamp: string;
  fromAddress: {
    hash: string;
  } | null;
  action?: string;
}

export interface EnsAddressLookupResponse {
  items: Array<EnsDomain>;
  totalRecords: number;
}

export interface EnsDomainEventsResponse {
  items: Array<EnsDomainEvent>;
  totalRecords: number;
}

export interface EnsDomainLookupResponse {
  items: Array<EnsDomain>;
  totalRecords: number;
}

export interface EnsDomainLookupFilters {
  name: string | null;
  resolvedTo: boolean;
  ownedBy: boolean;
  onlyActive: boolean;
}

export type EnsDomainLookupFiltersOptions = Array<'resolvedTo' | 'ownedBy' | 'withInactive'>;
