export type TopicsFilters = { q: string };

export interface TopicsSorting {
  sort: 'popular' | 'name' | 'updated';
  order: 'asc' | 'desc';
}

export type ThreadsFilters = { q: string; tag?: string };

export interface ThreadsSorting {
  sort: 'popular' | 'name' | 'updated';
  order: 'asc' | 'desc';
}

export interface RepliesSorting {
  sort: 'time';
  order: 'asc' | 'desc';
}
