import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import config from 'configs/app';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import dayjs from 'lib/date/dayjs';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import LinkExternal from 'ui/shared/links/LinkExternal';

import ContractSecurityAudits from '../audits/ContractSecurityAudits';
import ContractDetailsInfoItem from './ContractDetailsInfoItem';

const rollupFeature = config.features.rollup;

interface Props {
  data: SmartContract;
  isLoading: boolean;
  addressHash: string;
}

const ContractDetailsInfo = ({ data, isLoading, addressHash }: Props) => {
  const contractNameWithCertifiedIcon = data ? (
    <Flex alignItems="center">
      { data.name }
      { data.certified && <ContractCertifiedLabel iconSize={ 5 } boxSize={ 5 } ml={ 2 }/> }
    </Flex>
  ) : null;

  const licenseLink = (() => {
    if (!data?.license_type) {
      return null;
    }

    const license = CONTRACT_LICENSES.find((license) => license.type === data.license_type);
    if (!license || license.type === 'none') {
      return null;
    }

    return (
      <LinkExternal href={ license.url }>
        { license.label }
      </LinkExternal>
    );
  })();

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 6 } mb={ 8 }>
      { data.name && (
        <ContractDetailsInfoItem
          label="Contract name"
          content={ contractNameWithCertifiedIcon }
          isLoading={ isLoading }
        />
      ) }
      { data.compiler_version && (
        <ContractDetailsInfoItem
          label="Compiler version"
          content={ data.compiler_version }
          isLoading={ isLoading }
        />
      ) }
      { data.zk_compiler_version && (
        <ContractDetailsInfoItem
          label="ZK compiler version"
          content={ data.zk_compiler_version }
          isLoading={ isLoading }
        />
      ) }
      { data.evm_version && (
        <ContractDetailsInfoItem
          label="EVM version"
          content={ data.evm_version }
          textTransform="capitalize"
          isLoading={ isLoading }
        />
      ) }
      { licenseLink && (
        <ContractDetailsInfoItem
          label="License"
          content={ licenseLink }
          hint="License type is entered manually during verification. The initial source code may contain a different license type than the one displayed."
          isLoading={ isLoading }
        />
      ) }
      { typeof data.optimization_enabled === 'boolean' && (
        <ContractDetailsInfoItem
          label="Optimization enabled"
          content={ data.optimization_enabled ? 'true' : 'false' }
          isLoading={ isLoading }
        />
      ) }
      { data.optimization_runs !== null && (
        <ContractDetailsInfoItem
          label={ rollupFeature.isEnabled && rollupFeature.type === 'zkSync' ? 'Optimization mode' : 'Optimization runs' }
          content={ String(data.optimization_runs) }
          isLoading={ isLoading }
        />
      ) }
      { data.verified_at && (
        <ContractDetailsInfoItem
          label="Verified at"
          content={ dayjs(data.verified_at).format('llll') }
          wordBreak="break-word"
          isLoading={ isLoading }
        />
      ) }
      { data.file_path && (
        <ContractDetailsInfoItem
          label="Contract file path"
          content={ data.file_path }
          wordBreak="break-word"
          isLoading={ isLoading }
        />
      ) }
      { config.UI.hasContractAuditReports && (
        <ContractDetailsInfoItem
          label="Security audit"
          content={ <ContractSecurityAudits addressHash={ addressHash }/> }
          isLoading={ isLoading }
        />
      ) }
    </Grid>
  );
};

export default React.memo(ContractDetailsInfo);
