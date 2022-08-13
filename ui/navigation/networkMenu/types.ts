import type { FunctionComponent, SVGAttributes } from 'react';

export interface NetworkLink {
  pathname: string;
  name: string;
  icon: FunctionComponent<SVGAttributes<SVGElement>>;
  iconColor?: string;
  isNewUi?: boolean;
}
