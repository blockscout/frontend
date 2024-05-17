import { Flex, Skeleton, LinkBox, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import MarketplaceAppCardLink from '../MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from '../MarketplaceAppIntegrationIcon';

interface Props {
  app: MarketplaceAppPreview;
  isLoading: boolean | undefined;
  onAppClick: (event: MouseEvent, id: string) => void;
  isLarge?: boolean;
}

const AppLink = ({ app, isLoading, onAppClick, isLarge = false }: Props) => {
  const { id, url, external, title, logo, logoDarkMode, internalWallet, categories } = app;

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  const categoriesLabel = categories.join(', ');

  return (
    <LinkBox display="flex" height="100%" width="100%" role="group" alignItems="center" mb={ isLarge ? 0 : 4 }>
      <Skeleton
        isLoaded={ !isLoading }
        w={ isLarge ? '56px' : '48px' }
        h={ isLarge ? '56px' : '48px' }
        display="flex"
        alignItems="center"
        justifyContent="center"
        mr={ isLarge ? 3 : 4 }
        flexShrink={ 0 }
      >
        <Image
          src={ isLoading ? undefined : logoUrl }
          alt={ `${ title } app icon` }
          borderRadius="8px"
        />
      </Skeleton>

      <Flex direction="column">
        <Skeleton
          isLoaded={ !isLoading }
          marginBottom={ 0 }
          fontSize="sm"
          fontWeight="semibold"
          fontFamily="heading"
          display="inline-block"
          mb={ 1 }
        >
          <MarketplaceAppCardLink
            id={ id }
            url={ url }
            external={ external }
            title={ title }
            onClick={ onAppClick }
          />
          <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
        </Skeleton>
        <Skeleton
          isLoaded={ !isLoading }
          color="text_secondary"
          fontSize={ isLarge ? 'sm' : 'xs' }
        >
          <span>{ categoriesLabel }</span>
        </Skeleton>
      </Flex>
    </LinkBox>
  );
};

export default AppLink;
