import type { IconName } from 'ui/shared/IconSvg';

export type DeFiDropdownItem = {
  text: string;
  icon: IconName;
} & (
  { dappId: string; url?: never } |
  { url: string; dappId?: never }
);
