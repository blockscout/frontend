// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressesItem } from 'client/slices/address/types/api';

export interface AddressMetadataInfo {
  addresses: Record<string, {
    tags: Array<AddressMetadataTag>;
    reputation: number | null;
  }>;
}

export type AddressMetadataTagType = 'name' | 'generic' | 'classifier' | 'information' | 'note' | 'protocol';

// Response model from Metadata microservice API
export interface AddressMetadataTag {
  slug: string;
  name: string;
  tagType: AddressMetadataTagType;
  ordinal: number;
  meta: string | null;
}

// Response model from Blockscout API with parsed meta field
export interface AddressMetadataTagApi extends Omit<AddressMetadataTag, 'meta'> {
  meta: {
    textColor?: string;
    bgColor?: string;
    tagIcon?: string;
    tagUrl?: string;
    tooltipIcon?: string;
    tooltipTitle?: string;
    tooltipDescription?: string;
    tooltipUrl?: string;
    tooltipAttribution?: string;
    tooltipAttributionIcon?: string;
    appID?: string;
    appMarketplaceURL?: string;
    appLogoURL?: string;
    appActionButtonText?: string;
    warpcastHandle?: string;
    data?: string;
    alertBgColor?: string;
    alertTextColor?: string;
    alertStatus?: string;
    cexDeposit?: string;
  } | null;
}

// TAG SUBMISSION

export interface PublicTagType {
  id: string;
  type: AddressMetadataTagType;
  description: string;
}

export interface PublicTagTypesResponse {
  tagTypes: Array<PublicTagType>;
}

export interface AddressesMetadataSearchResult {
  items: Array<AddressesItem>;
  next_page_params: null;
}

export interface AddressesMetadataSearchFilters {
  slug: string;
  tag_type: string;
}

export interface SearchResultMetadataTag {
  type: 'metadata_tag';
  name: string | null;
  address_hash: string;
  is_smart_contract_verified: boolean;
  is_smart_contract_address: boolean;
  certified?: true;
  filecoin_robust_address?: string | null;
  url?: string;
  ens_info?: {
    address_hash: string;
    expiry_date?: string;
    name: string;
    names_count: number;
  } | null;
  metadata: AddressMetadataTagApi;
}
