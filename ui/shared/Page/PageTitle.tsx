import { Heading, Flex, Grid, Tooltip, Icon, Link, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import eastArrowIcon from 'icons/arrows/east.svg';
import TextAd from 'ui/shared/ad/TextAd';
import LinkInternal from 'ui/shared/LinkInternal';

type BackLinkProp = { label: string; url: string } | { label: string; onClick: () => void };

type Props = {
  text: string;
  additionalsLeft?: React.ReactNode;
  additionalsRight?: React.ReactNode;
  withTextAd?: boolean;
  className?: string;
  backLink?: BackLinkProp;
  afterTitle?: React.ReactNode;
  isLoading?: boolean;
}

const PageTitle = ({ text, additionalsLeft, additionalsRight, withTextAd, backLink, className, isLoading, afterTitle }: Props) => {
  const title = (
    <Skeleton isLoaded={ !isLoading }>
      <Heading
        as="h1"
        size="lg"
        flex="none"
        wordBreak="break-word"
      >
        { text }
        { afterTitle }
      </Heading>
    </Skeleton>
  );

  const backLinkComponent = (() => {
    if (!backLink) {
      return null;
    }

    const icon = <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)" margin="auto"/>;

    if ('url' in backLink) {
      return (
        <Tooltip label={ backLink.label }>
          <LinkInternal display="inline-flex" href={ backLink.url } h="40px">
            { icon }
          </LinkInternal>
        </Tooltip>
      );
    }

    return (
      <Tooltip label={ backLink.label }>
        <Link display="inline-flex" onClick={ backLink.onClick } h="40px">
          { icon }
        </Link>
      </Tooltip>
    );
  })();

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
      <Flex flexWrap="wrap" columnGap={ 3 } alignItems="center" width={ withTextAd ? 'unset' : '100%' } flexShrink={ 0 }>
        <Grid
          templateColumns={ [ backLinkComponent && 'auto', additionalsLeft && 'auto', '1fr' ].filter(Boolean).join(' ') }
          columnGap={ 3 }
        >
          { backLinkComponent }
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
