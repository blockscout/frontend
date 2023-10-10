import type { Uint256 } from '@ylide/sdk';

export interface PaginatedState<T> {
  loading: boolean;
  error: NonNullable<unknown> | null;
  data: PaginatedArray<T>;
}

export interface PaginatedArray<T> {
  count: number;
  items: Array<T>;
}

export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  adminOnly: boolean;
  creatorAddress: string;
  slug: string;
  threadsCount: string;
}

export interface ForumThreadCompact {
  id: string;
  slug: string;
  feedId: Uint256;
  createTimestamp: number;
  updateTimestamp: number | null;

  topic: string;
  title: string;
  description: string;
  tags: Array<string>;

  blockchainAddress: string | null;
  blockchainTx: string | null;
  comissions: Record<string, string>;
  creatorAddress: string;
  messageFeedId: Uint256;
  parentFeedId: Uint256 | null;
}

export interface ForumThread extends ForumThreadCompact {
  activated: boolean;
  bookmarked: null | Array<string>;
  replyCount: string;
  tags: Array<string>;
  topicId: string;
  topicSlug: string;
  watched: null | Array<string>;
}

export interface ForumReply {
  id: string;

  createTimestamp: number;

  blockchain: string;
  feedId: Uint256;
  sender: string;

  contentText: string;

  banned: boolean;
  isAdmin: boolean;
}

export const defaultPaginatedState: <T>() => PaginatedState<T> = () => ({
  loading: true,
  error: null,
  data: {
    count: 0,
    items: [],
  },
});
