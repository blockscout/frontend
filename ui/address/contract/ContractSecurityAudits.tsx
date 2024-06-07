import { Box, Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractSecurityAuditSubmission } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import FormModal from 'ui/shared/FormModal';
import LinkExternal from 'ui/shared/links/LinkExternal';

import ContractSubmitAuditForm from './contractSubmitAuditForm/ContractSubmitAuditForm';

type Props = {
  addressHash?: string;
}

const ContractSecurityAudits = ({ addressHash }: Props) => {
  const { data, isPlaceholderData } = useApiQuery('contract_security_audits', {
    pathParams: { hash: addressHash },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: { items: [] },
      enabled: Boolean(addressHash),
    },
  });

  const formTitle = 'Submit audit';

  const modalProps = useDisclosure();

  const renderForm = React.useCallback(() => {
    return <ContractSubmitAuditForm address={ addressHash } onSuccess={ modalProps.onClose }/>;
  }, [ addressHash, modalProps.onClose ]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ modalProps.onOpen }>Submit audit</Button>
      { data?.items && data.items.length > 0 && (
        <Box position="relative">
          <ContainerWithScrollY
            gradientHeight={ 24 }
            rowGap={ 1 }
            w="100%"
            maxH="80px"
            mt={ 2 }
          >
            { data.items.map(item => (
              <LinkExternal href={ item.audit_report_url } key={ item.audit_company_name + item.audit_publish_date } isLoading={ isPlaceholderData }>
                { `${ item.audit_company_name }, ${ dayjs(item.audit_publish_date).format('MMM DD, YYYY') }` }
              </LinkExternal>
            )) }
          </ContainerWithScrollY>
        </Box>
      ) }
      <FormModal<SmartContractSecurityAuditSubmission>
        isOpen={ modalProps.isOpen }
        onClose={ modalProps.onClose }
        title={ formTitle }
        renderForm={ renderForm }
      />
    </>
  );
};

export default React.memo(ContractSecurityAudits);
