// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import { useMultichainContext } from 'src/features/multichain/context';

import type { Route } from 'src/shared/router/routes';
import type { IconName } from 'src/sprite/SpriteIcon';

import type { ImageProps } from 'src/toolkit/chakra/image';

import type { ContainerBaseProps, ContentBaseProps, CopyBaseProps, IconBaseProps, LinkBaseProps } from './components';
import {
  Container as ContainerBase,
  Content as ContentBase,
  Copy as CopyBase,
  Icon as IconBase,
  Link as LinkBase,
} from './components';
import { ENTITY_OPTION_KEY_LIST, mergeEntityData, mergeIconOptions, resolveEntityOptions, splitByKeys, toShieldInput } from './entity-props';
import type { EntityChain, EntityLinkResolution, ExternalRouteTemplateKey } from './resolve-entity-link';
import { resolveEntityLink } from './resolve-entity-link';
import type { EntityDefaults, EntityOptions, EntityRootValue } from './root';
import { EntityRootProvider, useEntityRoot } from './root';
import { useSplitCssProps } from './split-css-props';

export interface EntityStyleProps extends JsxStyleProps {
  className?: string;
}

export type EntityComponentProps<TData extends object> = EntityOptions & EntityStyleProps & TData;
export type EntityRootProps<TData extends object> = EntityOptions & Partial<TData> & { children?: React.ReactNode };
export type EntityContainerProps<TData extends object> = EntityOptions & Partial<TData> & ContainerBaseProps;
export type EntityIconProps<TData extends object> = IconBaseProps & Partial<TData>;
export type EntityLinkProps<TData extends object> = LinkBaseProps & Partial<TData>;
export type EntityContentProps<TData extends object> = Omit<ContentBaseProps, 'text'> & Partial<TData>;
export type EntityCopyProps<TData extends object> = Omit<CopyBaseProps, 'text'> & Partial<TData>;

export interface EntityDefinition<TData extends object> {
  readonly name: string;
  readonly data: ReadonlyArray<keyof TData>;
  readonly route: (data: TData) => Route | undefined;
  readonly routeTemplate?: ExternalRouteTemplateKey;
  readonly singleChain?: true;
  readonly hintPrefix: string;
  readonly icon: IconName | ((data: TData) => IconName | React.ReactElement | ImageProps);
  readonly hint?: (data: TData) => string | undefined;
  readonly text: (data: TData) => string;
  readonly copyText: ((data: TData) => string) | false;
  readonly defaults?: EntityDefaults;
}

export interface EntityComponents<TData extends object> {
  readonly Entity: React.NamedExoticComponent<EntityComponentProps<TData>>;
  readonly Root: React.FC<EntityRootProps<TData>>;
  readonly Container: React.FC<EntityContainerProps<TData>>;
  readonly Icon: React.FC<EntityIconProps<TData>>;
  readonly Link: React.FC<EntityLinkProps<TData>>;
  readonly Content: React.FC<EntityContentProps<TData>>;
  readonly Copy: React.FC<EntityCopyProps<TData>>;
}

type IconSource = { name: IconName } | { children: React.ReactElement } | ImageProps;

export function resolveIconSource<TData extends object>(icon: EntityDefinition<TData>['icon'], data: TData): IconSource {
  const value = typeof icon === 'function' ? icon(data) : icon;

  if (typeof value === 'string') {
    return { name: value };
  }

  return React.isValidElement(value) ? { children: value } : value;
}

interface LinkInputs {
  readonly chain: EntityChain | undefined;
  readonly shield: false | undefined;
  readonly query: EntityOptions['query'];
}

export function defineEntity<TData extends object>(definition: EntityDefinition<TData>): EntityComponents<TData> {
  const dataKeys = definition.data;
  const rootKeys = [ ...ENTITY_OPTION_KEY_LIST, ...dataKeys ] as Array<keyof EntityRootProps<TData>>;

  const useLinkResolution = (data: TData, inputs: LinkInputs): EntityLinkResolution => {
    const multichainContext = useMultichainContext();

    return resolveEntityLink({
      route: definition.route(data),
      query: inputs.query,
      chain: inputs.chain,
      contextChain: definition.singleChain ? undefined : multichainContext?.chain,
      hintPrefix: definition.hintPrefix,
      routeTemplate: definition.routeTemplate,
      shield: inputs.shield,
    });
  };

  // A part with its own data, chain or shield cannot reuse the root's resolution.
  const usePartLink = (root: EntityRootValue<TData> | null, data: TData, override: Partial<TData> | undefined, inputs: LinkInputs) => {
    const resolution = useLinkResolution(data, inputs);
    // Stryker disable next-line ConditionalExpression: reusing the root's resolution only saves work; recomputing it yields the same value
    const reusesRoot = root?.link !== undefined && override === undefined &&
      inputs.chain === root.options.chain && inputs.shield === toShieldInput(root.options.icon);

    return reusesRoot ? root.link : resolution;
  };

  const Root = ({ children, ...props }: EntityRootProps<TData>) => {
    const [ data, rest ] = splitByKeys<TData, EntityOptions>(props, dataKeys);
    const options = resolveEntityOptions(definition.defaults, rest);
    const link = useLinkResolution(mergeEntityData(undefined, data), {
      chain: options.chain,
      shield: toShieldInput(options.icon),
      query: options.query,
    });

    const value: EntityRootValue<TData> = { data: data as TData | undefined, options, link: data ? link : undefined };

    return <EntityRootProvider value={ value }>{ children }</EntityRootProvider>;
  };

  const Container = (props: EntityContainerProps<TData>) => {
    const [ css, rest ] = useSplitCssProps(props);
    const [ rootProps, containerProps ] = splitByKeys<EntityRootProps<TData>, ContainerBaseProps>(rest, rootKeys);

    return (
      <Root { ...(rootProps as EntityRootProps<TData>) }>
        <ContainerBase { ...css } { ...containerProps }/>
      </Root>
    );
  };

  const Icon = (props: EntityIconProps<TData>) => {
    const root = useEntityRoot<TData>();
    const [ override, own ] = splitByKeys<TData, object>(props, dataKeys);
    const data = mergeEntityData(root?.data, override);
    const icon = mergeIconOptions(root?.options.icon ?? definition.defaults?.icon, own);
    const chain = icon.chain ?? root?.options.chain;
    const link = usePartLink(root, data, override, { chain, shield: toShieldInput(icon), query: root?.options.query });

    return (
      <IconBase
        { ...resolveIconSource(definition.icon, data) }
        { ...icon }
        shield={ icon.shield ?? link.shield }
        hint={ icon.hint ?? link.hint ?? definition.hint?.(data) }
      />
    );
  };

  const Link = (props: EntityLinkProps<TData>) => {
    const root = useEntityRoot<TData>();
    const [ override, own ] = splitByKeys<TData, LinkBaseProps>(props, dataKeys);
    const data = mergeEntityData(root?.data, override);
    const options = root?.options;
    const chain = own.chain ?? options?.chain;
    const link = usePartLink(root, data, override, { chain, shield: toShieldInput(options?.icon), query: options?.query });
    const href = own.href ?? options?.href ?? link.href;

    return (
      <LinkBase
        { ...options?.link }
        { ...own }
        href={ href }
        external={ own.external ?? options?.link?.external ?? link.isExternal }
        onClick={ own.onClick ?? options?.onClick }
        noLink={ own.noLink ?? options?.noLink ?? href === undefined }
      >
        { own.children }
      </LinkBase>
    );
  };

  const Content = (props: EntityContentProps<TData>) => {
    const root = useEntityRoot<TData>();
    const [ override, own ] = splitByKeys<TData, Omit<ContentBaseProps, 'text'>>(props, dataKeys);
    const data = mergeEntityData(root?.data, override);

    return <ContentBase { ...own } text={ definition.text(data) }/>;
  };

  const Copy = (props: EntityCopyProps<TData>) => {
    const root = useEntityRoot<TData>();
    const [ override, own ] = splitByKeys<TData, Omit<CopyBaseProps, 'text'>>(props, dataKeys);
    const data = mergeEntityData(root?.data, override);

    if (definition.copyText === false) {
      return null;
    }

    return <CopyBase { ...own } text={ definition.copyText(data) }/>;
  };

  // `TData` is still generic here, so the compiler cannot see that a bare `children` is an empty data override.
  const linkedContentProps = { children: <Content/> } as EntityLinkProps<TData>;

  const Entity = (props: EntityComponentProps<TData>) => {
    return (
      <Container { ...(props as EntityContainerProps<TData>) }>
        <Icon/>
        <Link { ...linkedContentProps }/>
        <Copy/>
      </Container>
    );
  };

  const parts: Record<string, React.FC<never>> = { Root, Container, Icon, Link, Content, Copy };
  for (const [ partName, Part ] of Object.entries(parts)) {
    Part.displayName = `${ definition.name }.${ partName }`;
  }
  Entity.displayName = definition.name;

  return { Entity: React.memo(Entity), Root, Container, Icon, Link, Content, Copy };
}
