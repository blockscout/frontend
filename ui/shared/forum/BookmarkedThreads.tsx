import { useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import useThreadsContent from './useThreadsContent';

const BookmarkedThreads = ({ account }: { account: DomainAccount }) => {
  const tokens = useMemo(() => [ account.backendAuthKey || '' ], [ account ]);
  const { content } = useThreadsContent(tokens, undefined, 'bookmarked');

  return content;
};

export default BookmarkedThreads;
