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
];

const EssentialDappsList = () => {
  return (
    <Flex gap={ 3 } mb={ 8 }>
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
