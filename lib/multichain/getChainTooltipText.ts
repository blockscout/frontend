import type { ChainConfig } from 'types/multichain';

export default function getChainTooltipText(chain: ChainConfig, prefix: string = '') {
  return `${ prefix }${ chain.config.chain.name } (Chain ID ${ chain.config.chain.id })`;
}
