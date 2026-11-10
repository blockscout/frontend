// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useSettingsContext } from 'src/shell/top-bar/settings/context';

import { useAddressHighlightContext } from 'src/slices/address/contexts/address-highlight';
import { toBech32Address } from 'src/slices/address/utils/bech32';
import getAddressName from 'src/slices/address/utils/get-address-name';

import type { ContainerBaseProps, ContentBaseProps, CopyBaseProps, IconBaseProps, LinkBaseProps } from 'src/shared/entities/components';
import * as EntityBase from 'src/shared/entities/components';
import type { EntityStyleProps } from 'src/shared/entities/define-entity';
import { ENTITY_OPTION_KEY_LIST, keysOf, mergeIconOptions, resolveEntityOptions, splitByKeys, toShieldInput } from 'src/shared/entities/entity-props';
import { isClusterChain } from 'src/shared/entities/interchain';
import type { EntityChain, EntityLinkResolution } from 'src/shared/entities/resolve-entity-link';
import { resolveEntityLink } from 'src/shared/entities/resolve-entity-link';
import type { EntityOptions, EntityRootValue } from 'src/shared/entities/root';
import { EntityRootProvider, useEntityOptions, useEntityRoot } from 'src/shared/entities/root';
import { useSplitCssProps } from 'src/shared/entities/split-css-props';
import { getVariantPreset } from 'src/shared/entities/variants';
import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import AddressIconDelegated from '../icon/AddressIconDelegated';
import AddressIdenticon from '../icon/AddressIdenticon';
import AddressEntityContentProxy from './AddressEntityContentProxy';

export interface AddressProp extends Partial<schemas['Address']> {
  hash: string;
}

export interface AddressEntityData {
  address: AddressProp;
  isSafeAddress?: boolean;
  noHighlight?: boolean;
  noAltHash?: boolean;
}

type AddressInput = AddressProp | string;

type WithAddressInput<T extends { address?: AddressProp }> = Omit<T, 'address'> & { address?: AddressInput };

export type EntityProps = EntityOptions & EntityStyleProps & AddressEntityData;
export type AddressEntityProps = Omit<EntityProps, 'address'> & { address: AddressInput };
export type RootProps = WithAddressInput<Partial<AddressEntityData>> & EntityOptions & { children?: React.ReactNode };
export type ContainerProps = WithAddressInput<Partial<AddressEntityData>> & EntityOptions & ContainerBaseProps;
export type IconProps = IconBaseProps & WithAddressInput<Partial<AddressEntityData>>;
export type LinkProps = LinkBaseProps & WithAddressInput<Partial<AddressEntityData>>;
export type ContentProps = Omit<ContentBaseProps, 'text'> & WithAddressInput<Partial<AddressEntityData>>;
export type CopyProps = Omit<CopyBaseProps, 'text'> & WithAddressInput<Partial<AddressEntityData>>;

interface AddressRootData {
  readonly address: AddressProp;
  readonly isSafeAddress: boolean | undefined;
  readonly altHash: string | undefined;
  readonly highlight: ReturnType<typeof useAddressHighlightContext>;
}

interface AddressPartData extends Omit<AddressRootData, 'highlight'> {
  readonly highlight: AddressRootData['highlight'] | undefined;
  readonly rootLink: EntityLinkResolution | undefined;
}

const DATA_KEYS = keysOf<AddressEntityData>()([ 'address', 'isSafeAddress', 'noHighlight', 'noAltHash' ]);
const ROOT_KEYS = [ ...ENTITY_OPTION_KEY_LIST, ...DATA_KEYS ] as Array<keyof RootProps>;
const CHAIN_HINT_PREFIX = ' on ';
const EMPTY_ADDRESS: AddressProp = { hash: '' };

const toAddressProp = (address: AddressInput | undefined): AddressProp | undefined => {
  return typeof address === 'string' ? { hash: address } : address;
};

const getDisplayedAddress = (address: AddressProp, altHash?: string) => {
  return address.filecoin?.robust ?? address.filecoin?.id ?? altHash ?? address.hash;
};

const isDelegated = (address: AddressProp) => address.proxy_type === 'eip7702';

const isProxy = (address: AddressProp) => Boolean(address.implementations?.length) && !isDelegated(address);

interface LinkInputs {
  readonly chain: EntityChain | undefined;
  readonly shield: false | undefined;
}

// A multichain deployment has no per-chain address page, only the aggregated one, so a cluster chain
// gets neither the chain-scoped link nor the shield and hint; a link-only chain keeps its explorer link.
const toAddressChain = (chain: EntityChain | undefined): EntityChain | undefined => {
  return chain && !chain.linkOnly && isClusterChain(chain) ? undefined : chain;
};

const useAddressLink = (address: AddressProp | undefined, query: EntityOptions['query'], inputs: LinkInputs): EntityLinkResolution => {
  return resolveEntityLink({
    route: address ? { pathname: '/address/[hash]', query: { hash: address.hash } } : undefined,
    query,
    chain: toAddressChain(inputs.chain),
    contextChain: undefined,
    hintPrefix: CHAIN_HINT_PREFIX,
    routeTemplate: 'address',
    shield: inputs.shield,
  });
};

const useAltHash = (address: AddressProp | undefined, noAltHash: boolean | undefined): string | undefined => {
  const settingsContext = useSettingsContext();
  const isBech32 = !noAltHash && settingsContext?.addressFormat === 'bech32';

  return address && isBech32 ? toBech32Address(address.hash) : undefined;
};

const Root = ({ children, ...props }: RootProps) => {
  const [ input, rest ] = splitByKeys<WithAddressInput<AddressEntityData>, EntityOptions>(props, DATA_KEYS);
  const options = resolveEntityOptions(undefined, rest);
  const address = toAddressProp(input?.address);
  const highlight = useAddressHighlightContext(input?.noHighlight);
  const altHash = useAltHash(address, input?.noAltHash);
  const link = useAddressLink(address, options.query, {
    chain: options.chain,
    shield: toShieldInput(options.icon),
  });

  const value: EntityRootValue<AddressRootData> = {
    data: address ? { address, isSafeAddress: input?.isSafeAddress, altHash, highlight } : undefined,
    options,
    link: address ? link : undefined,
  };

  return <EntityRootProvider value={ value }>{ children }</EntityRootProvider>;
};

const usePartData = <TOwn extends object>(props: object): [ AddressPartData, TOwn ] => {
  const root = useEntityRoot<AddressRootData>();
  const [ override, own ] = splitByKeys<WithAddressInput<AddressEntityData>, TOwn>(props, DATA_KEYS);
  const ownAddress = toAddressProp(override?.address);

  const data: AddressPartData = {
    address: ownAddress ?? root?.data?.address ?? EMPTY_ADDRESS,
    isSafeAddress: override?.isSafeAddress ?? root?.data?.isSafeAddress,
    altHash: ownAddress ? undefined : root?.data?.altHash,
    highlight: root?.data?.highlight,
    // Stryker disable next-line ConditionalExpression: a part that falls back to resolving its own link yields the same value as the root's
    rootLink: ownAddress ? undefined : root?.link,
  };

  return [ data, own ];
};

const usePartLink = (data: AddressPartData, inputs: LinkInputs): EntityLinkResolution => {
  const options = useEntityOptions();
  const resolution = useAddressLink(data.address, options.query, inputs);

  // Stryker disable next-line ConditionalExpression,EqualityOperator,LogicalOperator: reusing the root's resolution only saves work; recomputing it is equal
  return data.rootLink && inputs.chain === options.chain && inputs.shield === toShieldInput(options.icon) ? data.rootLink : resolution;
};

const ContainerBox = (props: ContainerBaseProps) => {
  const root = useEntityRoot<AddressRootData>();
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const { className, ...containerProps } = rest;
  const highlight = root?.data?.highlight ?? null;
  const classNames = [ className, 'address-entity', options.noCopy ? 'address-entity_no-copy' : undefined ].filter(Boolean).join(' ');

  return (
    <EntityBase.Container
      // global classnames (theme/globals/address-entity.ts): a css prop here would make Chakra emit the same styles once per entity instance on the page
      className={ classNames }
      data-hash={ highlight && !options.isLoading ? root?.data?.address.hash : undefined }
      onMouseEnter={ highlight?.onMouseEnter }
      onMouseLeave={ highlight?.onMouseLeave }
      position="relative"
      zIndex={ 0 }
      w="fit-content"
      maxW="100%"
      { ...css }
      { ...containerProps }
    />
  );
};

const Container = (props: ContainerProps) => {
  const [ css, rest ] = useSplitCssProps(props);
  const [ rootProps, containerProps ] = splitByKeys<RootProps, ContainerBaseProps>(rest, ROOT_KEYS);

  return (
    <Root { ...(rootProps as RootProps) }>
      <ContainerBox { ...css } { ...containerProps }/>
    </Root>
  );
};

const HEADING_IDENTICON_SIZE = 30;
const REGULAR_IDENTICON_SIZE = 20;

const getIconLayout = (icon: IconBaseProps, withShield: boolean) => {
  const preset = getVariantPreset(icon.variant).icon;

  return {
    boxSize: icon.boxSize ?? preset.boxSize,
    marginRight: withShield ? icon.marginRightShield ?? preset.marginRightShield : icon.marginRight ?? icon.mr ?? preset.marginRight,
  };
};

const capitalize = (text: string) => text.slice(0, 1).toUpperCase() + text.slice(1);

const getContractIcon = (address: AddressProp, isSafeAddress: boolean | undefined, chainPostfix: string) => {
  if (isSafeAddress) {
    return { name: 'brands/safe' as const };
  }

  const proxy = isProxy(address);
  const isVerified = proxy ? address.is_verified && address.implementations?.every(({ name }) => Boolean(name)) : address.is_verified;
  const contractIconName: IconName = address.is_verified ? 'contracts/verified' : 'contracts/regular';
  const label = (isVerified ? 'verified ' : '') + (proxy ? 'proxy contract' : 'contract') + chainPostfix;

  return {
    name: proxy ? 'contracts/proxy' as const : contractIconName,
    color: isVerified ? 'green.500' : undefined,
    borderRadius: 0,
    hint: capitalize(label),
  };
};

const getIdenticonHint = (address: AddressProp, ownHint: string | undefined, chainPostfix: string): string | undefined => {
  if (isDelegated(address)) {
    return (address.is_verified ? 'EOA + verified code' : 'EOA + code') + chainPostfix;
  }

  if (chainPostfix) {
    return 'Address' + chainPostfix;
  }

  return ownHint;
};

const Icon = (props: IconProps) => {
  const options = useEntityOptions();
  const [ data, own ] = usePartData<object>(props);
  const icon = mergeIconOptions(options.icon, own);
  const [ css, rest ] = useSplitCssProps(icon);
  const chain = icon.chain ?? options.chain;
  const link = usePartLink(data, { chain, shield: toShieldInput(icon) });
  const {
    isLoading = options.isLoading,
    noIcon = options.noIcon,
    variant = options.variant,
  } = icon;

  if (noIcon) {
    return null;
  }

  const shield = icon.shield ?? link.shield;
  const chainPostfix = icon.hintPostfix ?? link.hint ?? '';
  const tooltipInteractive = data.highlight ? true : icon.tooltipInteractive;
  const layout = getIconLayout({ ...icon, variant }, Boolean(shield));
  const { mr, marginRight, boxSize, ...ownCss } = css;
  const { className } = rest;

  if (isLoading) {
    return <Skeleton { ...layout } loading borderRadius="full" flexShrink={ 0 } { ...ownCss } className={ className }/>;
  }

  if ('src' in icon || 'name' in icon) {
    return <EntityBase.Icon { ...icon } chain={ chain } shield={ shield } tooltipInteractive={ tooltipInteractive }/>;
  }

  if (data.address.is_contract && !isDelegated(data.address)) {
    return (
      <EntityBase.Icon
        { ...icon }
        { ...getContractIcon(data.address, data.isSafeAddress, chainPostfix) }
        chain={ chain }
        shield={ shield }
        tooltipInteractive={ tooltipInteractive }
      />
    );
  }

  const hint = getIdenticonHint(data.address, icon.hint, chainPostfix);

  return (
    <Tooltip
      content={ hint }
      disabled={ !hint }
      interactive={ tooltipInteractive }
      positioning={ shield ? { offset: { mainAxis: 8 } } : undefined }
    >
      <Box display="flex" marginRight={ layout.marginRight } position="relative" { ...ownCss } className={ className }>
        <AddressIdenticon
          size={ icon.size ?? (variant === 'heading' ? HEADING_IDENTICON_SIZE : REGULAR_IDENTICON_SIZE) }
          hash={ getDisplayedAddress(data.address) }
        />
        { shield && (
          <EntityBase.IconShield
            { ...shield }
            { ...('src' in shield ? { fallback: <SpriteIcon name="networks/icon-placeholder"/> } : {}) }
          />
        ) }
        { isDelegated(data.address) && <AddressIconDelegated isVerified={ Boolean(data.address.is_verified) }/> }
      </Box>
    </Tooltip>
  );
};

const Link = (props: LinkProps) => {
  const options = useEntityOptions();
  const [ data, own ] = usePartData<LinkBaseProps>(props);
  const chain = own.chain ?? options.chain;
  const link = usePartLink(data, { chain, shield: toShieldInput(options.icon) });
  const href = own.href ?? options.href ?? link.href;

  return (
    <EntityBase.Link
      { ...options.link }
      { ...own }
      href={ href }
      external={ own.external ?? options.link?.external ?? link.isExternal }
      onClick={ own.onClick ?? options.onClick }
      noLink={ own.noLink ?? options.noLink ?? href === undefined }
    >
      { own.children }
    </EntityBase.Link>
  );
};

const NAME_TOOLTIP_MAX_WIDTH = { base: 'calc(100vw - 8px)', lg: '400px' };

const Content = (props: ContentProps) => {
  const options = useEntityOptions();
  const [ data, rest ] = usePartData<Omit<ContentBaseProps, 'text'>>(props);
  const [ css, own ] = useSplitCssProps(rest);
  const { address, altHash } = data;
  const tooltipInteractive = data.highlight ? true : own.tooltipInteractive;
  const nameText = getAddressName(address);

  if (isProxy(address)) {
    return <AddressEntityContentProxy { ...css } { ...own } address={ address } altHash={ altHash } tooltipInteractive={ tooltipInteractive }/>;
  }

  if (nameText) {
    const { isLoading = options.isLoading, variant = options.variant, noTooltip = options.noTooltip } = own;
    const label = (
      <>
        <VStack gap={ 0 } py={ 1 } color="inherit">
          <Box fontWeight={ 600 } whiteSpace="pre-wrap" wordBreak="break-word">{ nameText }</Box>
          <Box whiteSpace="pre-wrap" wordBreak="break-word">{ getDisplayedAddress(address, altHash) }</Box>
        </VStack>
        { own.tooltipContentAfter }
      </>
    );

    return (
      <Tooltip content={ label } contentProps={{ maxW: NAME_TOOLTIP_MAX_WIDTH }} interactive={ tooltipInteractive } disabled={ noTooltip }>
        <Skeleton
          loading={ isLoading }
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          minW={ 0 }
          className={ own.className }
          { ...getVariantPreset(variant).content }
          { ...css }
        >
          { nameText }
        </Skeleton>
      </Tooltip>
    );
  }

  return <EntityBase.Content { ...css } { ...own } tooltipInteractive={ tooltipInteractive } text={ getDisplayedAddress(address, altHash) }/>;
};

const Copy = (props: CopyProps) => {
  const [ data, own ] = usePartData<Omit<CopyBaseProps, 'text'>>(props);

  return (
    <EntityBase.Copy
      { ...own }
      tooltipInteractive={ data.highlight ? true : own.tooltipInteractive }
      text={ getDisplayedAddress(data.address, data.altHash) }
    />
  );
};

const AddressEntity = (props: AddressEntityProps) => {
  return (
    <Container { ...props }>
      <Icon/>
      <Link><Content/></Link>
      <Copy/>
    </Container>
  );
};

const parts: Record<string, React.FC<never>> = { Root, Container, Icon, Link, Content, Copy };
for (const [ partName, Part ] of Object.entries(parts)) {
  Part.displayName = `AddressEntity.${ partName }`;
}
AddressEntity.displayName = 'AddressEntity';

export default React.memo(AddressEntity);

export {
  Root,
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
