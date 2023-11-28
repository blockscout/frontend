import { EVM_NAMES, EVMNetwork } from '@ylide/ethereum';
import React from 'react';

import { ArbitrumLogo } from './logos/network/ArbitrumLogo';
import { AuroraLogo } from './logos/network/AuroraLogo';
import { AvalancheLogo } from './logos/network/AvalancheLogo';
import { BaseLogo } from './logos/network/BaseLogo';
import { BNBChainLogo } from './logos/network/BNBChainLogo';
import { CeloLogo } from './logos/network/CeloLogo';
import { CronosLogo } from './logos/network/CronosLogo';
import { EthereumLogo } from './logos/network/EthereumLogo';
import { FantomLogo } from './logos/network/FantomLogo';
import { GnosisLogo } from './logos/network/GnosisLogo';
import { KlaytnLogo } from './logos/network/KlaytnLogo';
import { LineaLogo } from './logos/network/LineaLogo';
import { MetisLogo } from './logos/network/MetisLogo';
import { MoonbeamLogo } from './logos/network/MoonbeamLogo';
import { MoonriverLogo } from './logos/network/MoonriverLogo';
import { OptimismLogo } from './logos/network/OptimismLogo';
import { PolygonLogo } from './logos/network/PolygonLogo';
import { ZetaLogo } from './logos/network/ZetaLogo';
import { BinanceWalletLogo } from './logos/wallets/BinanceWalletLogo';
import { CoinbaseWalletLogo } from './logos/wallets/CoinbaseWalletLogo';
import { FrontierLogo } from './logos/wallets/FrontierLogo';
import { MetaMaskLogo } from './logos/wallets/MetaMaskLogo';
import { TrustWalletLogo } from './logos/wallets/TrustWalletLogo';
import { WalletConnectLogo } from './logos/wallets/WalletConnectLogo';

export const BlockchainName = {
  LOCAL_HARDHAT: EVM_NAMES[EVMNetwork.LOCAL_HARDHAT],
  CRONOS: EVM_NAMES[EVMNetwork.CRONOS],
  ETHEREUM: EVM_NAMES[EVMNetwork.ETHEREUM],
  BNBCHAIN: EVM_NAMES[EVMNetwork.BNBCHAIN],
  ARBITRUM: EVM_NAMES[EVMNetwork.ARBITRUM],
  AVALANCHE: EVM_NAMES[EVMNetwork.AVALANCHE],
  OPTIMISM: EVM_NAMES[EVMNetwork.OPTIMISM],
  POLYGON: EVM_NAMES[EVMNetwork.POLYGON],
  FANTOM: EVM_NAMES[EVMNetwork.FANTOM],
  KLAYTN: EVM_NAMES[EVMNetwork.KLAYTN],
  GNOSIS: EVM_NAMES[EVMNetwork.GNOSIS],
  AURORA: EVM_NAMES[EVMNetwork.AURORA],
  CELO: EVM_NAMES[EVMNetwork.CELO],
  MOONBEAM: EVM_NAMES[EVMNetwork.MOONBEAM],
  MOONRIVER: EVM_NAMES[EVMNetwork.MOONRIVER],
  METIS: EVM_NAMES[EVMNetwork.METIS],
  ASTAR: EVM_NAMES[EVMNetwork.ASTAR],
  BASE: EVM_NAMES[EVMNetwork.BASE],
  ZETA: EVM_NAMES[EVMNetwork.ZETA],
  LINEA: EVM_NAMES[EVMNetwork.LINEA],
};

export interface IEthereumNetworkDescriptor {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: Array<string>;
  blockExplorerUrls: Array<string>;
}

export const blockchainMeta: Record<
string,
{
  title: string;
  logo: (s?: number) => JSX.Element;
  ethNetwork: IEthereumNetworkDescriptor;
}
> = {
  [BlockchainName.LINEA]: {
    title: 'Linea',
    logo: (s = 16) => <LineaLogo size={ s }/>,
    ethNetwork: {
      chainId: '0xe708',
      chainName: 'Linea',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [ 'https://linea.blockpi.network/v1/rpc/public' ],
      blockExplorerUrls: [ 'https://lineascan.build' ],
    },
  },
  [BlockchainName.BASE]: {
    title: 'Base',
    logo: (s = 16) => <BaseLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x2105',
      chainName: 'Base',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [ 'https://base.blockpi.network/v1/rpc/public' ],
      blockExplorerUrls: [ 'https://basescan.org' ],
    },
  },
  [BlockchainName.ZETA]: {
    title: 'ZetaChain',
    logo: (s = 16) => <ZetaLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x1B59',
      chainName: 'Zeta Chain',
      nativeCurrency: {
        name: 'aZETA',
        symbol: 'aZETA',
        decimals: 18,
      },
      rpcUrls: [ 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public' ],
      blockExplorerUrls: [ 'https://zetachain-athens-3.blockscout.com' ],
    },
  },
  [BlockchainName.LOCAL_HARDHAT]: {
    title: 'LocalNet',
    logo: (s = 16) => <EthereumLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x7A69',
      chainName: 'Hardhat Local',
      nativeCurrency: {
        name: 'GoEther',
        symbol: 'GO',
        decimals: 18,
      },
      rpcUrls: [],
      blockExplorerUrls: [],
    },
  },
  [BlockchainName.CRONOS]: {
    title: 'Cronos',
    logo: (s = 16) => <CronosLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x19',
      chainName: 'Cronos Mainnet Beta',
      nativeCurrency: {
        name: 'Cronos',
        symbol: 'CRO',
        decimals: 18,
      },
      rpcUrls: [
        'https://evm.cronos.org',
        'https://cronos-rpc.heavenswail.one',
        'https://cronosrpc-1.xstaking.sg',
        'https://cronos-rpc.elk.finance',
      ],
      blockExplorerUrls: [ 'https://cronoscan.com' ],
    },
  },
  [BlockchainName.ETHEREUM]: {
    title: 'Ethereum',
    logo: (s = 16) => <EthereumLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://api.mycryptoapi.com/eth',
        'https://cloudflare-eth.com',
        'https://rpc.flashbots.net',
        'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
        'https://mainnet-nethermind.blockscout.com',
        'https://nodes.mewapi.io/rpc/eth',
        'https://main-rpc.linkpool.io',
        'https://mainnet.eth.cloud.ava.do',
        'https://ethereumnodelight.app.runonflux.io',
        'https://rpc.ankr.com/eth',
        'https://eth-rpc.gateway.pokt.network',
        'https://main-light.eth.linkpool.io',
        'https://eth-mainnet.public.blastapi.io',
        'http://18.211.207.34:8545',
        'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
        'https://api.bitstack.com/v1/wNFxbiJyQsSeLrX8RRCHi7NpRxrlErZk/DjShIqLishPCTB9HiMkPHXjUM9CNM9Na/ETH/mainnet',
        'https://eth-mainnet.unifra.io/v1/d157f0245608423091f5b4b9c8e2103e',
        'https://1rpc.io/eth',
        'https://eth-mainnet.rpcfast.com',
        'https://eth-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',
        'https://api.securerpc.com/v1',
      ],
      blockExplorerUrls: [ 'https://etherscan.io' ],
    },
  },
  [BlockchainName.BNBCHAIN]: {
    title: 'BNB Chain',
    logo: (s = 16) => <BNBChainLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain Mainnet',
      nativeCurrency: {
        name: 'Binance Chain Native Token',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org',
        'https://bsc-dataseed3.binance.org',
        'https://bsc-dataseed4.binance.org',
        'https://bsc-dataseed1.defibit.io',
        'https://bsc-dataseed2.defibit.io',
        'https://bsc-dataseed3.defibit.io',
        'https://bsc-dataseed4.defibit.io',
        'https://bsc-dataseed1.ninicoin.io',
        'https://bsc-dataseed2.ninicoin.io',
        'https://bsc-dataseed3.ninicoin.io',
        'https://bsc-dataseed4.ninicoin.io',
        'wss://bsc-ws-node.nariox.org',
        'https://bsc-dataseed.binance.org',
        'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
        'https://rpc.ankr.com/bsc',
        'https://bscrpc.com',
        'https://bsc.mytokenpocket.vip',
        'https://binance.nodereal.io',
        'https://rpc-bsc.bnb48.club',
        'https://bscapi.terminet.io/rpc',
        'https://1rpc.io/bnb',
        'https://bsc-mainnet.rpcfast.com',
        'https://bsc-mainnet.rpcfast.com?api_key=S3X5aFCCW9MobqVatVZX93fMtWCzff0MfRj9pvjGKSiX5Nas7hz33HwwlrT5tXRM',
      ],
      blockExplorerUrls: [ 'https://bscscan.com' ],
    },
  },
  [BlockchainName.ARBITRUM]: {
    title: 'Arbitrum',
    logo: (s = 16) => <ArbitrumLogo size={ s }/>,
    ethNetwork: {
      chainId: '0xa4b1',
      chainName: 'Arbitrum One',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [ 'https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum', 'https://1rpc.io/arb' ],
      blockExplorerUrls: [ 'https://arbiscan.io' ],
    },
  },
  [BlockchainName.AVALANCHE]: {
    title: 'Avalanche',
    logo: (s = 16) => <AvalancheLogo size={ s }/>,
    ethNetwork: {
      chainId: '0xa86a',
      chainName: 'Avalanche C-Chain',
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
      rpcUrls: [
        'https://api.avax.network/ext/bc/C/rpc',
        'https://rpc.ankr.com/avalanche',
        'https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc',
        'https://avalancheapi.terminet.io/ext/bc/C/rpc',
        'https://1rpc.io/avax/c',
      ],
      blockExplorerUrls: [ 'https://snowtrace.io' ],
    },
  },
  [BlockchainName.OPTIMISM]: {
    title: 'Optimism',
    logo: (s = 16) => <OptimismLogo size={ s }/>,
    ethNetwork: {
      chainId: '0xa',
      chainName: 'Optimism',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://mainnet.optimism.io',
        'https://optimism-mainnet.public.blastapi.io',
        'https://rpc.ankr.com/optimism',
        'https://1rpc.io/op',
      ],
      blockExplorerUrls: [ 'https://optimistic.etherscan.io' ],
    },
  },
  [BlockchainName.POLYGON]: {
    title: 'Polygon',
    logo: (s = 16) => <PolygonLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [
        'https://polygon-rpc.com',
        'https://rpc-mainnet.matic.network',
        'https://matic-mainnet.chainstacklabs.com',
        'https://rpc-mainnet.maticvigil.com',
        'https://rpc-mainnet.matic.quiknode.pro',
        'https://matic-mainnet-full-rpc.bwarelabs.com',
        'https://matic-mainnet-archive-rpc.bwarelabs.com',
        'https://poly-rpc.gateway.pokt.network',
        'https://rpc.ankr.com/polygon',
        'https://polygon-mainnet.public.blastapi.io',
        'https://polygonapi.terminet.io/rpc',
        'https://1rpc.io/matic',
        'https://polygon-mainnet.rpcfast.com',
        'https://polygon-mainnet.rpcfast.com?api_key=eQhI7SkwYXeQJyOLWrKNvpRnW9fTNoqkX0CErPfEsZjBBtYmn2e2uLKZtQkHkZdT',
        'https://polygon-bor.publicnode.com',
        'https://matic.slingshot.finance',
      ],
      blockExplorerUrls: [ 'https://polygonscan.com' ],
    },
  },
  [BlockchainName.FANTOM]: {
    title: 'Fantom',
    logo: (s = 16) => <FantomLogo size={ s }/>,
    ethNetwork: {
      chainId: '0xfa',
      chainName: 'Fantom Opera',
      nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.ftm.tools',
        'https://fantom-mainnet.gateway.pokt.network/v1/lb/62759259ea1b320039c9e7ac',
        'https://rpc.ankr.com/fantom',
        'https://rpc.fantom.network',
        'https://rpc2.fantom.network',
        'https://rpc3.fantom.network',
        'https://rpcapi.fantom.network',
        'https://fantom-mainnet.public.blastapi.io',
      ],
      blockExplorerUrls: [ 'https://ftmscan.com' ],
    },
  },
  [BlockchainName.KLAYTN]: {
    title: 'Klaytn',
    logo: (s = 16) => <KlaytnLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x2019',
      chainName: 'Klaytn Mainnet Cypress',
      nativeCurrency: {
        name: 'KLAY',
        symbol: 'KLAY',
        decimals: 18,
      },
      rpcUrls: [
        'https://public-node-api.klaytnapi.com/v1/cypress',
        'https://klaytn01.fandom.finance',
        'https://klaytn02.fandom.finance',
        'https://klaytn03.fandom.finance',
        'https://klaytn04.fandom.finance',
        'https://klaytn05.fandom.finance',
        'https://cypress.fandom.finance/archive',
      ],
      blockExplorerUrls: [ 'https://scope.klaytn.com' ],
    },
  },
  [BlockchainName.GNOSIS]: {
    title: 'Gnosis',
    logo: (s = 16) => <GnosisLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x64',
      chainName: 'Gnosis',
      nativeCurrency: {
        name: 'xDAI',
        symbol: 'xDAI',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.gnosischain.com',
        'https://rpc.ankr.com/gnosis',
        'https://gnosischain-rpc.gateway.pokt.network',
        'https://gnosis-mainnet.public.blastapi.io',
        'wss://rpc.gnosischain.com/wss',
        'https://xdai-rpc.gateway.pokt.network',
        'https://xdai-archive.blockscout.com',
        'https://rpc.ap-southeast-1.gateway.fm/v1/gnosis/non-archival/mainnet',
      ],
      blockExplorerUrls: [ 'https://gnosisscan.io' ],
    },
  },
  [BlockchainName.AURORA]: {
    title: 'Aurora',
    logo: (s = 16) => <AuroraLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x4e454152',
      chainName: 'Aurora Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [ 'https://mainnet.aurora.dev' ],
      blockExplorerUrls: [ 'https://aurorascan.dev' ],
    },
  },
  [BlockchainName.CELO]: {
    title: 'Celo',
    logo: (s = 16) => <CeloLogo size={ s }/>,
    ethNetwork: {
      chainId: '0xa4ec',
      chainName: 'Celo Mainnet',
      nativeCurrency: {
        name: 'CELO',
        symbol: 'CELO',
        decimals: 18,
      },
      rpcUrls: [ 'https://forno.celo.org', 'wss://forno.celo.org/ws', 'https://rpc.ankr.com/celo' ],
      blockExplorerUrls: [ 'https://celoscan.io' ],
    },
  },
  [BlockchainName.MOONBEAM]: {
    title: 'Moonbeam',
    logo: (s = 16) => <MoonbeamLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x504',
      chainName: 'Moonbeam',
      nativeCurrency: {
        name: 'Glimmer',
        symbol: 'GLMR',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.api.moonbeam.network',
        'wss://wss.api.moonbeam.network',
        'https://moonbeam.public.blastapi.io',
        'https://rpc.ankr.com/moonbeam',
        'https://1rpc.io/glmr',
      ],
      blockExplorerUrls: [ 'https://moonbeam.moonscan.io' ],
    },
  },
  [BlockchainName.MOONRIVER]: {
    title: 'Moonriver',
    logo: (s = 16) => <MoonriverLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x505',
      chainName: 'Moonriver',
      nativeCurrency: {
        name: 'Moonriver',
        symbol: 'MOVR',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.api.moonriver.moonbeam.network',
        'wss://wss.api.moonriver.moonbeam.network',
        'https://moonriver.api.onfinality.io/rpc?apikey=673e1fae-c9c9-4c7f-a3d5-2121e8274366',
        'https://moonriver.api.onfinality.io/public',
        'https://moonriver.public.blastapi.io',
      ],
      blockExplorerUrls: [ 'https://moonriver.moonscan.io' ],
    },
  },
  [BlockchainName.METIS]: {
    title: 'Metis',
    logo: (s = 16) => <MetisLogo size={ s }/>,
    ethNetwork: {
      chainId: '0x440',
      chainName: 'Metis Andromeda Mainnet',
      nativeCurrency: {
        name: 'Metis',
        symbol: 'METIS',
        decimals: 18,
      },
      rpcUrls: [ 'https://andromeda.metis.io/?owner=1088' ],
      blockExplorerUrls: [ 'https://andromeda-explorer.metis.io' ],
    },
  },
};

export interface WalletMeta {
  title: string;
  link: string;
  logo: (size?: number) => JSX.Element;
}

export const walletsMeta: Record<string, WalletMeta> = {
  // EVM
  metamask: {
    title: 'MetaMask',
    logo: (s = 30) => <MetaMaskLogo size={ s }/>,
    link: 'https://metamask.io/',
  },
  frontier: {
    title: 'Frontier',
    logo: (s = 30) => <FrontierLogo size={ s }/>,
    link: 'https://www.frontier.xyz/',
  },
  walletconnect: {
    title: 'WalletConnect',
    logo: (s = 30) => <WalletConnectLogo size={ s }/>,
    link: 'https://walletconnect.com/',
  },
  coinbase: {
    title: 'Coinbase',
    logo: (s = 30) => <CoinbaseWalletLogo size={ s }/>,
    link: 'https://www.coinbase.com/wallet',
  },
  trustwallet: {
    title: 'TrustWallet',
    logo: (s = 30) => <TrustWalletLogo size={ s }/>,
    link: 'https://trustwallet.com/',
  },
  binance: {
    title: 'BinanceWallet',
    logo: (s = 30) => <BinanceWalletLogo size={ s }/>,
    link: 'https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
  },
};
