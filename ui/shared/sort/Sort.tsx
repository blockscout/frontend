import { chakra } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { IconButton } from 'toolkit/chakra/icon-button';
import type { SelectRootProps, SelectControlProps } from 'toolkit/chakra/select';
import { SelectContent, SelectItem, SelectRoot, SelectControl, SelectValueText } from 'toolkit/chakra/select';
import IconSvg from 'ui/shared/IconSvg';

export interface Props extends SelectRootProps {
  controlProps?: SelectControlProps;
  isLoading?: boolean;
}

const Sort = (props: Props) => {
  const { collection, controlProps, isLoading, ...rest } = props;
  const isMobile = useIsMobile(false);

  const trigger = (() => {
    if (isMobile) {
      return (
        <SelectControl { ...controlProps } triggerProps={{ asChild: true }} noIndicator>
          <IconButton
            loading={ isLoading }
            aria-label="sort"
            size="sm"
            variant="outline"
            colorScheme="gray"
            width="36px"
          >
            <IconSvg name="arrows/up-down" boxSize={ 5 }/>
          </IconButton>
        </SelectControl>
      );
    }

    return (
      <SelectControl
        { ...controlProps }
        loading={ isLoading }
      >
        <chakra.span
          flexShrink={ 0 }
          fontWeight="normal"
          color={{ _light: 'blackAlpha.600', _dark: 'whiteAlpha.600' }}
          _groupHover={{ color: 'inherit' }}
        >
          Sort by
        </chakra.span>
        <SelectValueText
          color={{ _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' }}
          _groupHover={{ color: 'inherit' }}
        />
      </SelectControl>
    );
  })();

  return (
    <SelectRoot variant={{ lgDown: 'outline', lg: 'sort' }} collection={ collection } { ...rest }>
      { trigger }
      <SelectContent>
        { collection.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
};

export default React.memo(chakra(Sort)) as typeof Sort;
