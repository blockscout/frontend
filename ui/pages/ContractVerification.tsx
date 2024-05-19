import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ContractVerificationForm from 'ui/contractVerification/ContractVerificationForm';
import useFormConfigQuery from 'ui/contractVerification/useFormConfigQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerification = () => {
  const listBgColor = useColorModeValue('white', 'blue.1000');
  const configQuery = useFormConfigQuery(true);

  const content = (() => {
    if (configQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <ContractVerificationForm config={ configQuery.data }/>
    );
  })();

  return (
    <>
      <Flex direction="column" paddingX={{ base: 4, lg: 8 }} bg="red.700">
        <PageTitle title="Verify & publish contract"/>
      </Flex>
      <Flex
        minH="75vh"
        bg={ listBgColor }
        borderTopRadius="2.5em"
        paddingY={{
          base: '1em',
          md: '2em',
        }}
        paddingX="1em"
        width="100%"
      >
        { content }
      </Flex>
    </>
  );
};

export default ContractVerification;
