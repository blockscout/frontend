import { Text } from '@chakra-ui/react';

import { route } from 'nextjs-routes';

import { Button } from 'toolkit/chakra/button';
import { Image } from 'toolkit/chakra/image';
import { LinkOverlay, LinkBox } from 'toolkit/chakra/link';

type Props = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
};

const EssentialDappCard = ({ id, title, description, buttonText, imageUrl }: Props) => {
  return (
    <LinkBox
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      w={{ base: 'auto', md: '200px' }}
      minW="135px"
      p={{ base: 3, md: 5 }}
      border="1px solid"
      borderColor={{ _light: 'blackAlpha.300', _dark: 'whiteAlpha.300' }}
      borderRadius="base"
      _hover={{ boxShadow: 'md' }}
      _focusWithin={{ boxShadow: 'md' }}
    >
      <Image src={ imageUrl } alt={ title } h={{ base: '37px', md: '50px' }} mb={ 6 }/>
      <Text textStyle={{ base: 'sm', md: 'xl' }} fontWeight="600" mb={ 2 }>{ title }</Text>
      <Text textStyle={{ base: 'xs', md: 'sm' }} mb={ 3 }>{ description }</Text>
      <LinkOverlay
        href={ route({ pathname: '/essential-dapps/[id]', query: { id } }) }
        w={{ base: 'full', md: 'auto' }}
        mt="auto"
      >
        <Button size="sm" variant="outline" w="full">
          { buttonText }
        </Button>
      </LinkOverlay>
    </LinkBox>
  );
};

export default EssentialDappCard;
