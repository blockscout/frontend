import { Heading, Flex, Tooltip, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import eastArrowIcon from 'icons/arrows/east.svg';
import TextAd from 'ui/shared/ad/TextAd';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = {
  text: string;
  additionals?: React.ReactNode;
  withTextAd?: boolean;
  className?: string;
  backLinkLabel?: string;
  backLinkUrl?: string;
}

const PageTitle = ({ text, additionals, withTextAd, backLinkUrl, backLinkLabel, className }: Props) => {
  const title = (
    <Heading
      as="h1"
      size="lg"
      flex="none"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      width={ backLinkUrl ? 'calc(100% - 36px)' : '100%' }
    >
      { text }
    </Heading>
  );

  return (
    <Flex
      columnGap={ 3 }
      rowGap={ 3 }
      alignItems={{ base: 'start', lg: 'center' }}
      flexDirection={{ base: 'column', lg: 'row' }}
      mb={ 6 }
      justifyContent="space-between"
      className={ className }
    >
      <Flex flexWrap="wrap" columnGap={ 3 } alignItems="center" width={ withTextAd ? 'unset' : '100%' }>
        <Flex
          flexWrap="nowrap"
          alignItems="center"
          columnGap={ 3 }
          overflow="hidden"
        >
          { backLinkUrl && (
            <Tooltip label={ backLinkLabel }>
              <LinkInternal display="inline-flex" href={ backLinkUrl }>
                <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)"/>
              </LinkInternal>
            </Tooltip>
          ) }
          { title }
        </Flex>
        { additionals }
      </Flex>
      { withTextAd && <TextAd flexShrink={ 100 }/> }
    </Flex>
  );
};

export default chakra(PageTitle);
