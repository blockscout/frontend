export interface EnsDomain {
  id: string;
  name: string;
  resolvedAddress: {
    hash: string;
  };
  owner: {
    hash: string;
  };
  registrationDate?: string;
  expiryDate?: string;
}

export interface EnsDomainDetailed {
  id: string;
  name: string;
  tokenId: string;
  resolvedAddress: {
    hash: string;
  };
  owner: {
    hash: string;
  };
  registrant: {
    hash: string;
  };
  registrationDate?: string;
  expiryDate?: string;
  otherAddresses: Record<string, string>;
}

export interface EnsDomainEvent {
  transactionHash: string;
  timestamp: string;
  fromAddress: {
    hash: string;
  };
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
