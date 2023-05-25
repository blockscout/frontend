import { Heading, Flex, Tooltip, Icon, Link, chakra, Box, Skeleton } from '@chakra-ui/react';
import React from 'react';

import eastArrowIcon from 'icons/arrows/east.svg';
import TextAd from 'ui/shared/ad/TextAd';
import LinkInternal from 'ui/shared/LinkInternal';

type BackLinkProp = { label: string; url: string } | { label: string; onClick: () => void };

type Props = {
  title: string;
  className?: string;
  backLink?: BackLinkProp;
  beforeTitle?: React.ReactNode;
  afterTitle?: React.ReactNode;
  contentAfter?: React.ReactNode;
  isLoading?: boolean;
  withTextAd?: boolean;
}

const BackLink = (props: BackLinkProp & { isLoading?: boolean }) => {
  if (!props) {
    return null;
  }

  if (props.isLoading) {
    return <Skeleton boxSize={ 6 } display="inline-block" borderRadius="base" mr={ 3 } isLoaded={ !props.isLoading }/>;
  }

  const icon = <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)" margin="auto"/>;

  if ('url' in props) {
    return (
      <Tooltip label={ props.label }>
        <LinkInternal display="inline-flex" href={ props.url } h="40px" mr={ 3 }>
          { icon }
        </LinkInternal>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={ props.label }>
      <Link display="inline-flex" onClick={ props.onClick } h="40px" mr={ 3 }>
        { icon }
      </Link>
    </Tooltip>
  );
};

const PageTitle = ({ title, contentAfter, withTextAd, backLink, className, isLoading, afterTitle, beforeTitle }: Props) => {
  return (
    <Flex
      className={ className }
      mb={ 6 }
      flexDir="row"
      flexWrap="wrap"
      rowGap={ 3 }
      columnGap={ 3 }
      alignItems="center"
    >
      <Box>
        { backLink && <BackLink { ...backLink } isLoading={ isLoading }/> }
        { beforeTitle }
        <Skeleton
          isLoaded={ !isLoading }
          display={ isLoading ? 'inline-block' : 'inline' }
          verticalAlign={ isLoading ? 'super' : undefined }
        >
          <Heading
            as="h1"
            size="lg"
            display="inline"
            wordBreak="break-word"
            w="100%"
          >
            { title }
          </Heading>
        </Skeleton>
        { afterTitle }
      </Box>
      { contentAfter }
      { withTextAd && <TextAd order={{ base: -1, lg: 100 }} mb={{ base: 6, lg: 0 }} ml="auto"/> }
    </Flex>
  );
};

export default chakra(PageTitle);
