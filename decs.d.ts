declare module 'react-identicons'

declare module 'data/marketplaceApps.json' {
  import type { AppItemOverview } from './types/client/apps';
  const value: Array<AppItemOverview>;
  export default value;
}
