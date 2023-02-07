import { Heading, Flex, Grid, Tooltip, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import eastArrowIcon from 'icons/arrows/east.svg';
import TextAd from 'ui/shared/ad/TextAd';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = {
  text: string;
  additionalsLeft?: React.ReactNode;
  additionalsRight?: React.ReactNode;
  withTextAd?: boolean;
  className?: string;
  backLinkLabel?: string;
  backLinkUrl?: string;
}

const PageTitle = ({ text, additionalsLeft, additionalsRight, withTextAd, backLinkUrl, backLinkLabel, className }: Props) => {
  const title = (
    <Heading
      as="h1"
      size="lg"
      flex="none"
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
        <Grid
          templateColumns={ [ backLinkUrl && 'auto', additionalsLeft && 'auto', '1fr' ].filter(Boolean).join(' ') }
          columnGap={ 3 }
        >
          { backLinkUrl && (
            <Tooltip label={ backLinkLabel }>
              <LinkInternal display="inline-flex" href={ backLinkUrl } h="40px">
                <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)" margin="auto"/>
              </LinkInternal>
            </Tooltip>
          ) }
          { additionalsLeft !== undefined && (
            <Flex h="40px" alignItems="center">
              { additionalsLeft }
            </Flex>
          ) }
          { title }
        </Grid>
        { additionalsRight }
      </Flex>
      { withTextAd && <TextAd flexShrink={ 100 }/> }
    </Flex>
  );
};

export default chakra(PageTitle);
