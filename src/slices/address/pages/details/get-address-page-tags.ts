// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { MetadataTag } from 'src/features/address-metadata/components/tag/types';
import type { AddressMetadataTagFormatted } from 'src/features/address-metadata/types/client';

import formatAccountTags from 'src/features/address-metadata/components/tag/format-account-tags';
import sortMetadataTags from 'src/features/address-metadata/components/tag/sort';

import config from 'src/config';

const PREDEFINED_TAG_PRIORITY = 100;
const FHE_TOOLTIP_DESCRIPTION = 'This contract uses Fully Homomorphic Encryption (FHE) to encrypt on-chain data. ' +
    'Inputs and most outputs are intentionally hidden, while computations are verified on-chain.';

const addressProfileAPIFeature = config.features.addressProfileAPI;
const xScoreFeature = config.features.xStarScore;

export interface AddressPageTagsParams {
  addressData: schemas['AddressResponse'] | undefined;
  isSafeAddress: boolean;
  hasUserOpsAccount: boolean;
  usernameApiTag: string | null | undefined;
  metadataTags: Array<AddressMetadataTagFormatted> | undefined;
  xStarLevel: string | null | undefined;
}

const predefinedTag = (slug: string, name: string): MetadataTag => ({ slug, name, tagType: 'custom', ordinal: PREDEFINED_TAG_PRIORITY });

const isFheTag = (tag: schemas['Tag']): boolean => {
  return tag.label.toLowerCase() === 'fhe' || tag.display_name.toLowerCase() === 'fhe';
};

const getPublicTags = (addressData: schemas['AddressResponse'] | undefined): Array<MetadataTag> => {
  return (addressData?.public_tags ?? []).map((tag) => ({
    slug: tag.label,
    name: tag.display_name,
    tagType: 'custom',
    ordinal: -1,
    meta: isFheTag(tag) ? { tooltipDescription: FHE_TOOLTIP_DESCRIPTION } : undefined,
  }));
};

const getAddressKindTags = (addressData: schemas['AddressResponse'] | undefined): Array<MetadataTag | undefined> => {
  const hasImplementations = Boolean(addressData?.implementations?.length);
  const isEip7702 = addressData?.proxy_type === 'eip7702';

  return [
    addressData?.celo?.account ? {
      ...predefinedTag('celo-account', 'Celo account'),
      meta: { bgColor: 'yellow.200', textColor: 'black' },
    } : undefined,
    !addressData?.is_contract ? predefinedTag('eoa', 'EOA') : undefined,
    config.features.validators.isEnabled && addressData?.has_validated_blocks ? predefinedTag('validator', 'Validator') : undefined,
    hasImplementations && !isEip7702 ? predefinedTag('proxy', 'Proxy') : undefined,
    hasImplementations && isEip7702 ? predefinedTag('eip7702', 'EOA+code') : undefined,
    addressData?.token ? predefinedTag('token', 'Token') : undefined,
  ];
};

const getUsernameApiTag = (usernameApiTag: string | null | undefined): MetadataTag | undefined => {
  if (!addressProfileAPIFeature.isEnabled || !usernameApiTag) {
    return undefined;
  }

  return {
    slug: 'username_api',
    name: usernameApiTag,
    tagType: 'custom',
    ordinal: 11,
    meta: {
      tagIcon: addressProfileAPIFeature.tagIcon,
      bgColor: addressProfileAPIFeature.tagBgColor,
      textColor: addressProfileAPIFeature.tagTextColor,
      tagUrl: addressProfileAPIFeature.tagLinkTemplate ? addressProfileAPIFeature.tagLinkTemplate.replace('{username}', usernameApiTag) : undefined,
    },
  };
};

const getXStarTag = (addressData: schemas['AddressResponse'] | undefined, xStarLevel: string | null | undefined): MetadataTag | undefined => {
  if (addressData?.is_contract || !xScoreFeature.isEnabled || !xStarLevel) {
    return undefined;
  }

  return {
    slug: 'xstar',
    name: `XHS ${ xStarLevel } level`,
    tagType: 'custom',
    ordinal: 12,
    meta: {
      tooltipTitle: 'XStar humanity levels',
      tooltipDescription:
        'XStar looks for off-chain information about an address and interpret it as a XHS score. Different score means different humanity levels.',
      tooltipUrl: xScoreFeature.url,
    },
  };
};

export function getAddressPageTags(params: AddressPageTagsParams): Array<MetadataTag> {
  const { addressData, isSafeAddress, hasUserOpsAccount, usernameApiTag, metadataTags, xStarLevel } = params;

  return [
    ...getPublicTags(addressData),
    ...getAddressKindTags(addressData),
    isSafeAddress ? { slug: 'safe', name: 'Multisig: Safe', tagType: 'custom' as const, ordinal: -10 } : undefined,
    getUsernameApiTag(usernameApiTag),
    config.features.userOps.isEnabled && hasUserOpsAccount ? predefinedTag('user_ops_acc', 'Smart contract wallet') : undefined,
    ...formatAccountTags(addressData),
    ...(metadataTags?.filter((tag) => tag.tagType !== 'note') ?? []),
    getXStarTag(addressData, xStarLevel),
  ].filter(Boolean).sort(sortMetadataTags);
}
