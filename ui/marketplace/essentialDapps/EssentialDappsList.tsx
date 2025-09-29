import { Flex } from '@chakra-ui/react';

import EssentialDappCard from './EssentialDappCard';

const essentialDapps = [
  {
    id: 'swap',
    title: 'Swap',
    description: 'Swap, trade and bridge tokens between chains',
    buttonText: 'Swap tokens',
    imageUrl: '/static/marketplace/swap.png',
  },
  {
    id: 'revoke',
    title: 'Revoke',
    description: 'View and remove token approvals',
    buttonText: 'Get started',
    imageUrl: '/static/marketplace/revoke.png',
  },
  {
    id: 'multisend',
    title: 'Multisend',
    description: 'Send tokens to multiple addresses at once',
    buttonText: 'Send tokens',
    imageUrl: '/static/marketplace/multisend.png',
  },
];

const EssentialDappsList = () => {
  return (
    <Flex gap={ 3 } mb={ 8 } w="full" overflowX="auto">
      { essentialDapps.map((dapp) => (
        <EssentialDappCard
          key={ dapp.id }
          id={ dapp.id }
          title={ dapp.title }
          description={ dapp.description }
          buttonText={ dapp.buttonText }
          imageUrl={ dapp.imageUrl }
        />
      )) }
    </Flex>
  );
};

export default EssentialDappsList;
