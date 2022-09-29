import type { RouteName } from 'lib/link/routes';

export interface RoutedTab {
  // for simplicity we use routeName as an id
  // if we migrate to non-Next.js router that should be revised
  // id: string;
  routeName: RouteName | null;
  title: string;
  component: React.ReactNode;
}

export interface MenuButton {
  routeName: null;
  title: string;
  component: null;
}
