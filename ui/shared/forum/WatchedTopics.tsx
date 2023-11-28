import { useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import useTopicsContent from './useTopicsContent';

const WatchedTopics = ({ account }: { account: DomainAccount }) => {
  const tokens = useMemo(() => [ account.backendAuthKey || '' ], [ account ]);
  const { content } = useTopicsContent(tokens, 'watched');

  return content;
};

export default WatchedTopics;
