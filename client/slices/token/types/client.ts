// SPDX-License-Identifier: LicenseRef-Blockscout

export interface Metadata {
  name?: string;
  description?: string;
  attributes?: Array<MetadataAttributes>;
}

export interface MetadataAttributes {
  value: string;
  trait_type: string;
  value_type?: 'URL';
}

export interface AdditionalTokenType {
  id: string;
  name: string;
}
