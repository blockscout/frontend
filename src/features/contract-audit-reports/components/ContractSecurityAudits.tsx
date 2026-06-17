// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractSecurityAuditSubmission } from 'src/features/contract-audit-reports/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ContainerWithScrollY from 'src/shared/containers/ContainerWithScrollY';
import dayjs from 'src/shared/date-and-time/dayjs';
import FormModal from 'src/shared/forms/FormModal';

import { Button } from 'src/toolkit/chakra/button';
import { Link } from 'src/toolkit/chakra/link';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import ContractSubmitAuditForm from './ContractSubmitAuditForm';

type Props = {
  addressHash?: string;
};

const ContractSecurityAudits = ({ addressHash }: Props) => {
  const { data, isPlaceholderData } = useApiQuery('core:contract_security_audits', {
    pathParams: { hash: addressHash },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: { items: [], next_page_params: null },
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
      { data?.items && data.items.length > 0 && (
        <Box position="relative">
          <ContainerWithScrollY
            gradientHeight={ 24 }
            rowGap={ 1 }
            w="100%"
            maxH="80px"
            mb={ 2 }
          >
            { data.items.map(item => (
              <Link external href={ item.audit_report_url } key={ item.audit_company_name + item.audit_publish_date } loading={ isPlaceholderData }>
                { `${ item.audit_company_name }, ${ dayjs(item.audit_publish_date).format('MMM DD, YYYY') }` }
              </Link>
            )) }
          </ContainerWithScrollY>
        </Box>
      ) }
      <Button variant="outline" size="sm" onClick={ modalProps.onOpen }>Submit audit</Button>
      <FormModal<SmartContractSecurityAuditSubmission>
        open={ modalProps.open }
        onOpenChange={ modalProps.onOpenChange }
        title={ formTitle }
        renderForm={ renderForm }
      />
    </>
  );
};

export default React.memo(ContractSecurityAudits);
