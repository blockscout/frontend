import { useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import useTopicsContent from './useTopicsContent';

const BookmarkedTopics = ({ account }: { account: DomainAccount }) => {
  const tokens = useMemo(() => [ account.backendAuthKey || '' ], [ account ]);
  const { content } = useTopicsContent(tokens, 'bookmarked');

  return content;
};

export default BookmarkedTopics;
