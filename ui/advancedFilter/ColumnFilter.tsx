import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  IconButton,
  chakra,
  Flex,
  Text,
  Link,
  Button,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  columnName: string;
  title: string;
  isActive?: boolean;
  isFilled?: boolean;
  onFilter: () => void;
  onReset: () => void;
  className?: string;
  children: React.ReactNode;
}

const ColumnFilter = ({ columnName, title, isActive, isFilled, onFilter, onReset, className, children }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <IconButton
          onClick={ onToggle }
          aria-label={ `filter by ${ columnName }` }
          variant="ghost"
          w="30px"
          h="30px"
          icon={ <IconSvg name="filter" w="20px" h="20px"/> }
          isActive={ isActive }
        />
      </PopoverTrigger>
      <PopoverContent className={ className }>
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          <chakra.form
            noValidate
            onSubmit={ onFilter }
            textAlign="start"
          >
            <Flex alignItems="center" justifyContent="space-between" mb={ 3 }>
              <Text color="text_secondary" fontWeight="600">{ title }</Text>
              <Link
                onClick={ onReset }
                cursor={ isFilled ? 'pointer' : 'unset' }
                opacity={ isFilled ? 1 : 0.2 }
                _hover={{
                  color: isFilled ? 'link_hovered' : 'none',
                }}
              >
                Reset
              </Link>
            </Flex>
            { children }
            <Button type="submit" isDisabled={ !isFilled } mt={ 4 }>
            Filter
            </Button>
          </chakra.form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default chakra(ColumnFilter);
