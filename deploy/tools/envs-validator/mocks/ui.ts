// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AlternativeExplorer } from 'src/features/alternative-explorers/types/client';
import type { CustomLinksGroup } from 'src/shell/footer/types';
import type { NavigationPromoBannerConfig } from 'src/shell/navigation/types';
import type { FeaturedNetwork } from 'src/shell/top-bar/chain-menu/types';
import type { ContractCodeIde } from 'src/slices/contract/types/config';
import type { HeroBannerConfig } from 'src/slices/home/types/config';
import type { NftMarketplaceItem } from 'src/slices/token/types/client';

import type { FontFamily } from 'src/config/misc';

export const heroBannerConfig: HeroBannerConfig = {
  background: [ 'lightpink' ],
  text_color: [ 'deepskyblue', 'white' ],
  border: [ '3px solid black' ],
  search: {
    background: [ 'white', 'rgb(26,32,44)' ],
    border_width: [ '2px', '2px' ],
    border_color: {
      _empty: [ 'rgb(203,213,224)', 'rgb(74,85,104)' ],
      _hover: [ 'rgb(66,153,225)', 'rgb(99,179,237)' ],
      _focus: [ 'rgb(49,130,206)', 'rgb(43,108,176)' ],
      _filled: [ 'rgb(160,174,192)', 'rgb(113,128,150)' ],
    },
  },
};

export const featuredNetworks: Array<FeaturedNetwork> = [
  {
    title: 'Ethereum',
    url: 'https://eth.blockscout.com/',
    group: 'Mainnets',
    icon: 'https://example.com/logo.svg',
  },
  {
    title: 'Goerli',
    url: 'https://eth-goerli.blockscout.com/',
    group: 'Testnets',
    isActive: true,
    icon: 'https://example.com/logo.svg',
    invertIconInDarkMode: true,
  },
];

export const promoBannerConfigFull: NavigationPromoBannerConfig = {
  img_url: 'https://example.com/promo.svg',
  text: 'Promo text',
  bg_color: { light: 'rgb(250, 245, 255)', dark: 'rgb(68, 51, 122)' },
  text_color: { light: 'rgb(107, 70, 193)', dark: 'rgb(233, 216, 253)' },
  link_url: 'https://example.com',
};

export const promoBannerConfigImageOnly: NavigationPromoBannerConfig = {
  img_url: { small: 'https://example.com/promo-sm.png', large: 'https://example.com/promo-lg.png' },
  link_url: 'https://example.com',
};

export const footerLinks: Array<CustomLinksGroup> = [
  {
    title: 'Foo',
    links: [ { text: 'Home', url: 'https://example.com' } ],
  },
  {
    title: 'Developers',
    links: [
      {
        text: 'Develop',
        url: 'https://example.com',
        iconUrl: [ 'https://example.com/mocks/image_s.jpg', 'https://example.com/mocks/image_svg.svg' ],
      },
    ],
  },
];

export const fontFamilyHeading: FontFamily = {
  name: 'Montserrat',
  url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
};

export const fontFamilyBody: FontFamily = {
  name: 'Raleway',
  url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap',
};

export const networkExplorers: Array<AlternativeExplorer> = [
  {
    title: 'Explorer',
    baseUrl: 'https://example.com/',
    paths: { tx: '/tx', address: '/address', token: '/token', block: '/block', blob: '/blob' },
  },
];

export const contractCodeIdes: Array<ContractCodeIde> = [
  {
    title: 'Remix IDE',
    url: 'https://remix.blockscout.com/?address={hash}&blockscout={domain}',
    icon_url: 'https://example.com/icon.svg',
  },
];

export const nftMarketplaces: Array<NftMarketplaceItem> = [
  {
    name: 'NFT Marketplace',
    collection_url: 'https://example.com/{hash}',
    instance_url: 'https://example.com/{hash}/{id}',
    logo_url: 'https://example.com/logo.png',
  },
];
