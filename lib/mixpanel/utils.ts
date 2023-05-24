export enum EventTypes {
  PAGE_VIEW = 'Page view',
  SEARCH_QUERY = 'Search query',
}

export type EventPayload<Type extends EventTypes> =
    Type extends EventTypes.PAGE_VIEW ?
      {
        'Page type': string;
        'Tab': string;
        'Page'?: string;
      } :
      Type extends EventTypes.SEARCH_QUERY ? {
        'Search query': string;
        'Source page type': string;
        'Result URL': string;
      } :
        undefined;
