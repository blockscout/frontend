import type { ExternalChain } from 'types/externalChains';

export default function getChainTooltipText(chain: ExternalChain, prefix: string = '') {
  return `${ prefix }${ chain.name } (Chain ID: ${ chain.id })`;
}
