import type { TMultichainContext } from 'lib/contexts/multichain';

export function getChainDataForList(multichainContext: TMultichainContext | null) {
  // for now we only show chain icon in the list with chain selector (not in the entire local pages)
  return multichainContext?.chain && multichainContext.level !== 'page' ? multichainContext.chain : undefined;
}
