import type { ApiResource } from '../types';
import type { AddressMetadataInfo, PublicTagTypesResponse } from 'types/api/addressMetadata';

// TODO @tom2drum remove prefix from resource names
export const METADATA_API_RESOURCES = {
  address_metadata_info: {
    path: '/api/v1/metadata',
  },
  address_metadata_tag_search: {
    path: '/api/v1/tags:search',
  },
  address_metadata_tag_types: {
    path: '/api/v1/public-tag-types',
  },
} satisfies Record<string, ApiResource>;

export type MetadataApiResourceName = `metadata:${ keyof typeof METADATA_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type MetadataApiResourcePayload<R extends MetadataApiResourceName> =
R extends 'metadata:address_metadata_info' ? AddressMetadataInfo :
R extends 'metadata:address_metadata_tag_types' ? PublicTagTypesResponse :
never;
/* eslint-enable @stylistic/indent */
