import type { FunctionComponent, SVGAttributes } from 'react';

export interface NetworkLink {
  url: string;
  name: string;
  icon: FunctionComponent<SVGAttributes<SVGElement>>;
  iconColor?: string;
}
