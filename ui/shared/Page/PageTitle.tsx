import { Heading, Flex, Tooltip, Link, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import eastArrowIcon from 'icons/arrows/east.svg';
import TextAd from 'ui/shared/ad/TextAd';

type Props = {
  text: string;
  additionals?: React.ReactNode;
  withTextAd?: boolean;
  className?: string;
  backLinkLabel?: string;
  backLinkUrl?: string;
}

const PageTitle = ({ text, additionals, withTextAd, backLinkUrl, backLinkLabel, className }: Props) => {
  const title = <Heading as="h1" size="lg" flex="none">{ text }</Heading>;

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
        { backLinkUrl && (
          <Tooltip label={ backLinkLabel }>
            <Link display="inline-flex" href={ backLinkUrl }>
              <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)"/>
            </Link>
          </Tooltip>
        ) }
        { title }
        { additionals }
      </Flex>
      { withTextAd && <TextAd flexShrink={ 100 }/> }
    </Flex>
  );
};

export default chakra(PageTitle);
