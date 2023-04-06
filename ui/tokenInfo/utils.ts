import type { Fields } from './types';
import type { TokenInfoApplication } from 'types/api/account';

export function prepareRequestBody(data: Fields): Omit<TokenInfoApplication, 'id' | 'status'> {
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
  };
}
