import type { HTMLChakraProps } from '@chakra-ui/react';
import { Flex, Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import useFetch from 'lib/hooks/useFetch';
import { Tooltip } from 'toolkit/chakra/tooltip';
import useClipboard from 'toolkit/hooks/useClipboard';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import FilterInput from 'ui/shared/filters/FilterInput';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const formatFileSize = (fileSizeInBytes: number) => `${ (fileSizeInBytes / 1_024).toFixed(2) } Kb`;

interface IconInfo {
  name: string;
  fileSize: number;
}

const Item = ({ name, fileSize, bgColor }: IconInfo & HTMLChakraProps<'div'>) => {
  const { hasCopied, copy } = useClipboard(name, 1000);
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
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      maxW="100px"
      textAlign="center"
      onClick={ copy }
      cursor="pointer"
    >
      <IconSvg name={ name as IconName } boxSize="100px" bgColor={ bgColor } borderRadius="base"/>
      <Tooltip content={ copied ? 'Copied' : 'Copy to clipboard' } open={ copied }>
        <Box fontWeight={ 500 } mt={ 2 }>{ name }</Box>
      </Tooltip>
      <Box color="text_secondary">{ formatFileSize(fileSize) }</Box>
    </Flex>
  );
};

const Sprite = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const fetch = useFetch();
  const { data, isFetching, isError } = useQuery({
    queryKey: [ 'sprite' ],
    queryFn: () => {
      const url = route({ pathname: '/node-api/sprite' as StaticRoute<'/api/sprite'>['pathname'] });
      return fetch<{ icons: Array<IconInfo> }, unknown>(url);
    },
  });

  const content = (() => {
    if (isFetching) {
      return <ContentLoader/>;
    }

    if (isError || !data || !('icons' in data)) {
      return <DataFetchAlert/>;
    }

    const items = data.icons.filter((icon) => icon.name.includes(searchTerm));

    if (items.length === 0) {
      return <EmptySearchResult text="No icons found"/>;
    }

    return (
      <Flex flexWrap="wrap" fontSize="sm" columnGap={ 5 } rowGap={ 5 } justifyContent="flex-start">
        { items.map((item) => <Item key={ item.name } { ...item } bgColor={{ _light: 'blackAlpha.100', _dark: 'whiteAlpha.100' }}/>) }
      </Flex>
    );
  })();

  const total = React.useMemo(() => {
    if (!data || !('icons' in data)) {
      return;
    }
    return data?.icons.reduce((result, item) => {
      result.num++;
      result.fileSize += item.fileSize;
      return result;
    }, { num: 0, fileSize: 0 });
  }, [ data ]);

  const searchInput = <FilterInput placeholder="Search by name..." onChange={ setSearchTerm } loading={ isFetching } minW={{ base: '100%', lg: '300px' }}/>;
  const totalEl = total ? <Box ml="auto">Items: { total.num } / Size: { formatFileSize(total.fileSize) }</Box> : null;

  const contentAfter = (
    <>
      { totalEl }
      { searchInput }
    </>
  );

  return (
    <div>
      <PageTitle title="SVG sprite 🥤" contentAfter={ contentAfter }/>
      { content }
    </div>
  );
};

export default React.memo(Sprite);
