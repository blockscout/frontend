/* eslint-disable max-len */
import { Center, VStack, Box, chakra } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import Page from 'ui/shared/Page/Page';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <Page>
      <Center h="100%" fontSize={{ base: 'sm', lg: 'xl' }}>
        <VStack gap={ 4 }>
          <Box>
            <p>home page for { router.query.network_type } { router.query.network_sub_type } network</p>
            { /* for scroll demo purpose only */ }
            <chakra.p mt={ 2 }>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at cursus nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam sed nisi sit amet sem iaculis tempor. Vestibulum at risus lectus. Aliquam vitae tortor bibendum, molestie erat nec, dapibus lorem. Curabitur ac tristique dolor. Maecenas condimentum ac odio vitae hendrerit. Maecenas iaculis vitae mauris id tincidunt. Fusce ac nulla mi. Aenean quis purus vehicula, ultricies quam vel, suscipit turpis. Aliquam dignissim pharetra consequat. In at urna id orci ullamcorper iaculis. Vestibulum sed dolor eu augue elementum sodales. Duis lacus arcu, vulputate id tempus et, ultricies ut augue. Nunc sit amet mi eu massa maximus viverra at in leo.</chakra.p>
            <chakra.p mt={ 2 }>Aliquam hendrerit nunc non metus sollicitudin, sit amet vehicula tellus interdum. Etiam molestie, odio at dapibus bibendum, velit ante gravida dui, et viverra nibh lorem vitae tellus. Pellentesque tristique orci vitae ipsum feugiat, sed elementum odio dictum. Curabitur maximus quis enim vel bibendum. Proin elementum arcu ligula, vitae elementum diam laoreet in. Etiam mollis scelerisque risus id facilisis. Nullam dapibus dignissim consequat. Praesent faucibus tincidunt metus, quis posuere tortor ullamcorper a. Fusce porttitor mollis dui a aliquam. Nunc congue tellus euismod elit aliquet, eget posuere purus gravida. Morbi ultrices pretium interdum. Phasellus ultricies felis euismod malesuada luctus.</chakra.p>
            <chakra.p mt={ 2 }>Nulla eget accumsan mauris. Aliquam ultrices porta diam, a viverra dui aliquam quis. Praesent porttitor ultricies volutpat. Ut sem metus, venenatis in lacus placerat, rhoncus ornare dolor. In hac habitasse platea dictumst. Nullam ac ornare quam. Aenean sed congue nisl. Mauris malesuada egestas erat, a finibus purus consequat nec. Mauris congue scelerisque urna non faucibus. Sed vehicula vitae sem eu varius. In sit amet nunc non metus fermentum finibus.</chakra.p>
            <chakra.p mt={ 2 }>Nulla sollicitudin fringilla mauris in ornare. Donec consectetur ultricies lorem ac rhoncus. Mauris dictum vestibulum sollicitudin. Cras in orci eget urna sollicitudin auctor. Suspendisse pellentesque eget purus nec facilisis. Nunc in vulputate odio. Aenean viverra malesuada consequat. Quisque eleifend faucibus aliquam. Aenean dui erat, ultricies quis iaculis sed, malesuada eleifend justo. Proin sollicitudin venenatis cursus. Mauris quis enim mollis, lacinia metus in, luctus ligula.</chakra.p>
            <chakra.p mt={ 2 }>Vestibulum eget mollis arcu, sed malesuada massa. Nunc at est vel felis scelerisque sollicitudin. Vestibulum vulputate ipsum sapien, eu vestibulum nibh maximus tincidunt. Sed posuere fermentum leo nec bibendum. Cras tincidunt dui ullamcorper lectus luctus, vitae consequat velit scelerisque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eleifend imperdiet ultrices. Etiam ullamcorper mi semper interdum iaculis. Suspendisse urna lacus, egestas ut vehicula non, varius non diam. Nunc consequat eros in accumsan interdum. Morbi blandit risus sollicitudin, suscipit nisl at, malesuada est. Vestibulum eget molestie diam. Suspendisse potenti.</chakra.p>
            <chakra.p mt={ 2 }>Pellentesque enim risus, elementum ut ornare id, faucibus in urna. Sed laoreet iaculis augue in fermentum. Morbi nec lacus pharetra, condimentum justo eget, commodo est. Donec nec auctor sapien, eget fringilla nisl. Aliquam ac ex rhoncus, tempor augue quis, aliquet sapien. Curabitur ullamcorper lacus orci, eget placerat velit sollicitudin non. Praesent imperdiet convallis tincidunt. Aliquam venenatis ultricies orci. Mauris accumsan volutpat magna vel condimentum. Donec et volutpat enim. Cras ac purus eget ex bibendum sollicitudin sed eget ligula. Nunc magna velit, feugiat in accumsan quis, aliquet posuere lorem. Proin dapibus leo sem, vitae dignissim odio malesuada eget. Donec venenatis pretium porta. In tempus eros at magna consectetur, id pellentesque magna iaculis.</chakra.p>
          </Box>
        </VStack>
      </Center>
    </Page>
  );
};

export default Home;
