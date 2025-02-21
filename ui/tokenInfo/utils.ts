import type { Fields } from './types';
import type { TokenInfoApplication } from 'types/api/account';
import type { EntityTag } from 'ui/shared/EntityTags/types';

export function getFormDefaultValues(address: string, tokenName: string, application: TokenInfoApplication | undefined): Partial<Fields> {
  if (!application) {
    return { address, token_name: tokenName };
  }

  return {
    address,
    token_name: tokenName,
    requester_name: application.requesterName,
    requester_email: application.requesterEmail,
    project_name: application.projectName,
    project_sector: application.projectSector ? { value: application.projectSector, label: application.projectSector } : null,
    project_email: application.projectEmail,
    project_website: application.projectWebsite,
    project_description: application.projectDescription || '',
    docs: application.docs || '',
    support: application.support || '',
    icon_url: application.iconUrl,
    ticker_coin_gecko: application.coinGeckoTicker || '',
    ticker_coin_market_cap: application.coinMarketCapTicker,
    ticker_defi_llama: application.defiLlamaTicker,
    github: application.github || '',
    telegram: application.telegram || '',
    linkedin: application.linkedin || '',
    discord: application.discord || '',
    slack: application.slack || '',
    twitter: application.twitter || '',
    opensea: application.openSea || '',
    facebook: application.facebook || '',
    medium: application.medium || '',
    reddit: application.reddit || '',
    comment: application.comment || '',
  };
}

export function prepareRequestBody(data: Fields): Omit<TokenInfoApplication, 'id' | 'status' | 'updatedAt'> {
  return {
    coinGeckoTicker: data.ticker_coin_gecko,
    coinMarketCapTicker: data.ticker_coin_market_cap,
    defiLlamaTicker: data.ticker_defi_llama,
    discord: data.discord,
    docs: data.docs,
    facebook: data.facebook,
    github: data.github,
    iconUrl: data.icon_url,
    linkedin: data.linkedin,
    medium: data.medium,
    openSea: data.opensea,
    projectDescription: data.project_description,
    projectEmail: data.project_email,
    projectName: data.project_name,
    projectSector: data.project_sector?.value,
    projectWebsite: data.project_website,
    reddit: data.reddit,
    requesterEmail: data.requester_email,
    requesterName: data.requester_name,
    slack: data.slack,
    support: data.support,
    telegram: data.telegram,
    tokenAddress: data.address,
    twitter: data.twitter,
    comment: data.comment,
  };
}

export function formatAgreementText(text: string): string {
  switch (text) {
    case 'ERC-20':
      return 'DRC-20';
    case 'ERC-721':
      return 'DRC-721';
    case 'ERC-1155':
      return 'DRC-1155';
    case 'ERC-404':
      return 'DRC-404';
    default:
      return text;
  }
}

// [
//   {
//       "slug": "ERC-20",
//       "name": "ERC-20",
//       "tagType": "custom",
//       "ordinal": -20
//   }
// ]

export function formatAgreementTag(tag: EntityTag): EntityTag {
  return {
    ...tag,
    name: formatAgreementText(tag.name),
    slug: formatAgreementText(tag.slug),
  };
}
