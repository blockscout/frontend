import { Flex, Tooltip, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import useFetch from 'lib/hooks/useFetch';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import FilterInput from 'ui/shared/filters/FilterInput';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const Item = ({ icon, bgColor }: { icon: string; bgColor: string }) => {
  const { hasCopied, onCopy } = useClipboard(icon, 1000);
  const [ copied, setCopied ] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [ hasCopied ]);

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      rowGap={ 2 }
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      maxW="100px"
      textAlign="center"
      onClick={ onCopy }
      cursor="pointer"
    >
      <IconSvg name={ icon as IconName } boxSize="100px" bgColor={ bgColor } borderRadius="base"/>
      <Tooltip label={ copied ? 'Copied' : 'Copy to clipboard' } isOpen={ copied }>
        <span>{ icon }</span>
      </Tooltip>
    </Flex>
  );
};

const Sprite = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const fetch = useFetch();
  const { data, isFetching, isError } = useQuery({
    queryKey: [ 'sprite' ],
    queryFn: () => {
      const url = route({ pathname: '/node-api/sprite' as StaticRoute<'/api/sprite'>['pathname'] });
      return fetch<{ icons: Array<string> }, unknown>(url);
    },
  });

  const content = (() => {
    if (isFetching) {
      return <ContentLoader/>;
    }

    if (isError || !data || !('icons' in data)) {
      return <DataFetchAlert/>;
    }

    const items = data.icons.filter((icon) => icon.includes(searchTerm));

    if (items.length === 0) {
      return <EmptySearchResult text="No icons found"/>;
    }

    return (
      <Flex flexWrap="wrap" fontSize="sm" columnGap={ 5 } rowGap={ 5 } justifyContent="flex-start">
        { items.map((icon) => <Item key={ icon } icon={ icon } bgColor={ bgColor }/>) }
      </Flex>
    );
  })();

  const searchInput = <FilterInput placeholder="Search by name..." onChange={ setSearchTerm } ml="auto" minW={{ base: '100%', lg: '500px' }}/>;

  return (
    <div>
      <PageTitle title="SVG sprite 🥤" contentAfter={ searchInput }/>
      { content }
    </div>
  );
};

export default React.memo(Sprite);
