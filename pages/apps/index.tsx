import { IconButton, Menu, MenuButton, MenuItem, MenuList, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.marketplace;

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const Page: NextPage = () => {
  const isMobile = useIsMobile();
  const links = [];

  if (feature.isEnabled) {
    if (feature.submitFormUrl) {
      links.push({
        label: 'Submit app',
        href: feature.submitFormUrl,
        icon: 'plus' as IconName,
      });
    }
    if (feature.suggestIdeasFormUrl) {
      links.push({
        label: 'Suggest ideas',
        href: feature.suggestIdeasFormUrl,
        icon: 'edit' as IconName,
      });
    }
  }

  return (
    <PageNextJs pathname="/apps">
      <>
        <PageTitle
          title="DAppscout"
          contentAfter={ (isMobile && links.length > 1) ? (
            <Menu>
              <MenuButton
                as={ IconButton }
                size="sm"
                variant="outline"
                colorScheme="gray"
                px="9px"
                ml="auto"
                icon={ <IconSvg name="dots" boxSize="18px"/> }
              />
              <MenuList minW="max-content">
                { links.map(({ label, href, icon }) => (
                  <MenuItem key={ label } as="a" href={ href } target="_blank" py={ 2 } px={ 4 }>
                    <IconSvg name={ icon } boxSize={ 4 } mr={ 2.5 }/>
                    { label }
                    <IconSvg name="arrows/north-east" boxSize={ 4 } color="gray.400" ml={ 2 }/>
                  </MenuItem>
                )) }
              </MenuList>
            </Menu>
          ) : (
            <Flex ml="auto">
              { links.map(({ label, href }) => (
                <LinkExternal key={ label } href={ href } variant="subtle" fontSize="sm" lineHeight={ 5 } ml={ 2 }>
                  { label }
                </LinkExternal>
              )) }
            </Flex>
          ) }
        />
        <Marketplace/>
      </>
    </PageNextJs>
  );
};

export default Page;

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';
