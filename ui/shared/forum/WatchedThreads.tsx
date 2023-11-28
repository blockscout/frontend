import { useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import useThreadsContent from './useThreadsContent';

const WatchedThreads = ({ account }: { account: DomainAccount }) => {
  const tokens = useMemo(() => [ account.backendAuthKey || '' ], [ account ]);
  const { content } = useThreadsContent(tokens, undefined, 'watched');

  return content;
};

export default WatchedThreads;
