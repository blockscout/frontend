// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TMultichainContext } from 'src/features/multichain/context';

import type { IconBaseProps, EntityBaseProps } from './components';
import type { Variant } from './root';
import { getVariantPreset } from './variants';

export function getIconProps(props: IconBaseProps, withShield: boolean = false) {
  const preset = getVariantPreset(props.variant).icon;

  return {
    boxSize: props.boxSize ?? preset.boxSize,
    marginRight: withShield ? props.marginRightShield ?? preset.marginRightShield : props.marginRight ?? props.mr ?? preset.marginRight,
  };
}

export function getContentProps(variant: Variant | undefined) {
  return getVariantPreset(variant).content;
}

export function distributeEntityProps<Props extends EntityBaseProps>(props: Props, multichainContext?: TMultichainContext | null) {
  const { className, onClick, icon, noIcon, link, chain, contentProps, ...mainProps } = props;
  const { variant, ...restProps } = mainProps;

  return {
    container: { className },
    // For entities within the multichain views, we decided not to highlight the chain in the entity icon unless the chain data is passed manually via props.
    // This does not apply to the links. If the links are within the multichain views, they should lead to chain-specific pages.
    icon: { ...mainProps, ...icon, chain, noIcon },
    link: { ...restProps, ...link, onClick, chain: chain ?? multichainContext?.chain },
    content: { ...mainProps, ...contentProps },
    symbol: restProps,
    copy: restProps,
  };
}
