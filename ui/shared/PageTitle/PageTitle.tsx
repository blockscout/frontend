import { Heading, Flex, Tooltip, Icon, Link, chakra, Skeleton, Box } from '@chakra-ui/react';
import React from 'react';

import eastArrowIcon from 'icons/arrows/east.svg';
import TextAd from 'ui/shared/ad/TextAd';
import LinkInternal from 'ui/shared/LinkInternal';

// Component scheme (desktop):
// TopRow
// MainRow :: BackLink + MainContent | SecondaryContent
// BottomRow

// Component scheme (mobile):
// TopRow
// MainRow
//    BackLink + MainContent
//    SecondaryContent <-- could consists of multiple rows
// BottomRow

// CONTAINER

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <Flex
      flexDir="column"
      rowGap={{ base: 4, lg: 3 }}
      alignItems="stretch"
      mb={ 8 }
    >
      { children }
    </Flex>
  );
};

// TOP ROW

interface TopRowProps {
  children: JSX.Element;
}

const TopRow = ({ children }: TopRowProps) => {
  return children;
};

// MAIN ROW

interface MainRowProps {
  children: React.ReactNode;
  className?: string;
}

const MainRow = chakra(({ children, className }: MainRowProps) => {
  return (
    <Box
      className={ className }
      display="grid"
      gridTemplateColumns={{ base: 'minmax(0, auto)', lg: 'minmax(0, max-content) minmax(max-content, 1fr)' }}
      columnGap={ 3 }
      rowGap={ 4 }
      w="100%"
    >
      { children }
    </Box>
  );
});

// BACK LINK

type BackLinkProps = Props['backLink'] & Pick<Props, 'isLoading'>;

const BackLink = (props: BackLinkProps) => {
  if (!props) {
    return null;
  }

  if (props.isLoading) {
    return <Skeleton boxSize={ 6 } display="inline-block" borderRadius="base" my={ 2 } verticalAlign="text-bottom" isLoaded={ !props.isLoading }/>;
  }

  const icon = <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)" margin="auto"/>;

  if ('url' in props) {
    return (
      <Tooltip label={ props.label }>
        <LinkInternal display="inline-flex" href={ props.url } h="40px">
          { icon }
        </LinkInternal>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={ props.label }>
      <Link display="inline-flex" onClick={ props.onClick } h="40px">
        { icon }
      </Link>
    </Tooltip>
  );
};

// MAIN CONTENT

interface MainContentProps extends Pick<Props, 'backLink' | 'isLoading'> {
  children: React.ReactNode;
  className?: string;
}

const MainContent = chakra(({ children, backLink, isLoading, className }: MainContentProps) => {
  return (
    <Flex alignItems="center" columnGap={ 3 } w={{ base: '100%', lg: 'auto' }} className={ className }>
      { backLink && <BackLink { ...backLink } isLoading={ isLoading }/> }
      { children }
    </Flex>
  );
});

// SECONDARY CONTENT

interface SecondaryContentProps {
  children: React.ReactNode;
  className?: string;
}

const SecondaryContent = chakra(({ children, className }: SecondaryContentProps) => {
  return (
    <Flex
      className={ className }
      alignItems="center"
      flexGrow={ 1 }
      w={{ base: '100%', lg: 'auto' }}
      flexWrap="nowrap"
      rowGap={{ base: 4, lg: 3 }}
      _empty={{ display: 'none' }}
    >
      { children }
    </Flex>
  );
});

// BOTTOM ROW

interface BottomRowProps {
  children: React.ReactNode;
  className?: string;
}

const BottomRow = chakra(({ children, className }: BottomRowProps) => {
  return (
    <Flex className={ className } alignItems="center" rowGap={{ base: 4, lg: 3 }}>
      { children }
    </Flex>
  );
});

// MAIN COMPONENT

type Props = {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  backLink?: { label: string; url: string } | { label: string; onClick: () => void };
  withTextAds?: boolean;
}

const PageTitle = ({ backLink, isLoading, children, withTextAds }: Props) => {
  return (
    <Container>
      <MainRow
        gridTemplateColumns={{
          base: 'minmax(0, auto)',
          lg: withTextAds ? 'auto auto' : '1fr',
        }}
      >
        <MainContent alignItems="flex-start" flexShrink={ 0 }>
          { backLink && <BackLink { ...backLink } isLoading={ isLoading }/> }
          <Heading as="h1" size="lg">
            { children }
          </Heading>
        </MainContent>
        { withTextAds && (
          <SecondaryContent order={{ base: -1, lg: 1 }}>
            <TextAd ml="auto"/>
          </SecondaryContent>
        ) }
      </MainRow>
    </Container>
  );
};

export default PageTitle;

export {
  Container,
  TopRow,
  MainRow,
  BackLink,
  MainContent,
  SecondaryContent,
  BottomRow,
};
