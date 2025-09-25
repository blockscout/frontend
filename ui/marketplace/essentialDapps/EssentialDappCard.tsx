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
      flexDirection="column"
      alignItems="flex-start"
      w="200px"
      p={ 5 }
      border="1px solid"
      borderColor={{ _light: 'blackAlpha.300', _dark: 'whiteAlpha.300' }}
      borderRadius="base"
      _hover={{ boxShadow: 'md' }}
      _focusWithin={{ boxShadow: 'md' }}
    >
      <Image src={ imageUrl } alt={ title } h="50px" mb={ 6 }/>
      <Text textStyle="xl" fontWeight="600" mb={ 2 }>{ title }</Text>
      <Text textStyle="sm" mb={ 3 }>{ description }</Text>
      <LinkOverlay href={ route({ pathname: '/essential-dapps/[id]', query: { id } }) }>
        <Button size="sm" variant="outline">{ buttonText }</Button>
      </LinkOverlay>
    </LinkBox>
  );
};

export default EssentialDappCard;
