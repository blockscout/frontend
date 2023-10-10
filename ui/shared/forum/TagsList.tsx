import { Flex, Tag, chakra } from '@chakra-ui/react';
import React from 'react';

const TagsList = ({
  tags,
  ...props
}: { tags: Array<string>}) => {
  // const handleClick = React.useCallback(() => {
  //   router.push({
  //     pathname: '/forum/[topic]/[thread]',
  //     query: link,
  //   });
  // }, [ link, router ]);

  return (
    <Flex gap={ 2 } { ...props }>
      { tags.map(tag => (
        <Tag key={ tag }>{ tag }</Tag>
      )) }
    </Flex>
  );
};

export default chakra(TagsList);
