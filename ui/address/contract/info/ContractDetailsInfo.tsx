import { Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import { Link } from 'toolkit/chakra/link';
import { getGitHubOwnerAndRepo } from 'ui/contractVerification/utils';
import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ContractCreationStatus from 'ui/shared/statusTag/ContractCreationStatus';
import Time from 'ui/shared/time/Time';

import ContractSecurityAudits from '../audits/ContractSecurityAudits';
import ContractDetailsInfoItem from './ContractDetailsInfoItem';

const rollupFeature = config.features.rollup;

interface Props {
  data: SmartContract;
  isLoading: boolean;
  addressData: Address;
}

const ContractDetailsInfo = ({ data, isLoading, addressData }: Props) => {
  const multichainContext = useMultichainContext();

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
      <Link external href={ license.url }>
        { license.label }
      </Link>
    );
  })();

  const sourceCodeLink = (() => {
    if (!data.github_repository_metadata?.repository_url || !data.github_repository_metadata?.commit) {
      return null;
    }

    const { owner, repo } = getGitHubOwnerAndRepo(data.github_repository_metadata.repository_url) || {};

    const repoUrl = data.github_repository_metadata.repository_url;
    const commit = data.github_repository_metadata.commit;
    const pathPrefix = data.github_repository_metadata.path_prefix;
    return (
      <Link external href={ `${ repoUrl }/tree/${ commit }${ pathPrefix ? `/${ pathPrefix }` : '' }` }>
        { owner && repo ? `${ owner }/${ repo }` : data.github_repository_metadata.repository_url }
      </Link>
    );
  })();

  const isStylusContract = data.language === 'stylus_rust';

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 6 } mb={ 8 }>
      { data.name && (
        <ContractDetailsInfoItem
          label="Contract name"
          isLoading={ isLoading }
        >
          { contractNameWithCertifiedIcon }
        </ContractDetailsInfoItem>
      ) }
      { multichainContext && addressData.creator_address_hash && addressData.creation_transaction_hash && (
        <ContractDetailsInfoItem
          label="Creator"
          isLoading={ isLoading }
        >
          <Flex alignItems="center" flexWrap="wrap">
            <AddressEntity
              address={{ hash: addressData.creator_address_hash }}
              truncation="constant"
              noIcon
            />
            <Text whiteSpace="pre" color="text.secondary"> at txn </Text>
            <TxEntity hash={ addressData.creation_transaction_hash } truncation="constant" noIcon/>
            { addressData.creation_status && <ContractCreationStatus status={ addressData.creation_status } ml={{ base: 0, lg: 2 }}/> }
          </Flex>
        </ContractDetailsInfoItem>
      ) }
      { !isLoading && multichainContext && addressData.implementations && addressData.implementations.length > 0 && (
        <ContractDetailsInfoItem
          label={ `${ addressData.proxy_type === 'eip7702' ? 'Delegated to' : `Implementation${ addressData.implementations.length > 1 ? 's' : '' }` }` }
          isLoading={ isLoading }
          contentProps={{ maxW: 'calc(100% - 194px)', position: 'relative' }}
        >
          <ContainerWithScrollY gradientHeight={ 48 } maxH="200px">
            { addressData.implementations.map((item) => (
              <AddressEntity
                key={ item.address_hash }
                address={{
                  hash: item.address_hash,
                  filecoin: { robust: item.filecoin_robust_address },
                  name: item.name,
                  is_contract: true,
                }}
                isLoading={ isLoading }
                noIcon
              />
            )) }
          </ContainerWithScrollY>
        </ContractDetailsInfoItem>
      ) }
      { data.compiler_version && (
        <ContractDetailsInfoItem
          label="Compiler version"
          isLoading={ isLoading }
        >
          { data.compiler_version }
        </ContractDetailsInfoItem>
      ) }
      { data.zk_compiler_version && (
        <ContractDetailsInfoItem
          label="ZK compiler version"
          isLoading={ isLoading }
        >
          { data.zk_compiler_version }
        </ContractDetailsInfoItem>
      ) }
      { data.evm_version && (
        <ContractDetailsInfoItem
          label="EVM version"
          textTransform="capitalize"
          isLoading={ isLoading }
        >
          { data.evm_version }
        </ContractDetailsInfoItem>
      ) }
      { licenseLink && (
        <ContractDetailsInfoItem
          label="License"
          hint="License type is entered manually during verification. The initial source code may contain a different license type than the one displayed."
          isLoading={ isLoading }
        >
          { licenseLink }
        </ContractDetailsInfoItem>
      ) }
      { typeof data.optimization_enabled === 'boolean' && !isStylusContract && (
        <ContractDetailsInfoItem
          label="Optimization enabled"
          isLoading={ isLoading }
        >
          { data.optimization_enabled ? 'true' : 'false' }
        </ContractDetailsInfoItem>
      ) }
      { data.optimization_runs !== null && !isStylusContract && (
        <ContractDetailsInfoItem
          label={ rollupFeature.isEnabled && rollupFeature.type === 'zkSync' ? 'Optimization mode' : 'Optimization runs' }
          isLoading={ isLoading }
        >
          { String(data.optimization_runs) }
        </ContractDetailsInfoItem>
      ) }
      { data.package_name && (
        <ContractDetailsInfoItem
          label="Package name"
          isLoading={ isLoading }
        >
          { data.package_name }
        </ContractDetailsInfoItem>
      ) }
      { data.verified_at && (
        <ContractDetailsInfoItem
          label="Verified at"
          wordBreak="break-word"
          isLoading={ isLoading }
        >
          <Time timestamp={ data.verified_at } format="lll_s"/>
        </ContractDetailsInfoItem>
      ) }
      { data.file_path && !isStylusContract && (
        <ContractDetailsInfoItem
          label="Contract file path"
          wordBreak="break-word"
          isLoading={ isLoading }
        >
          { data.file_path }
        </ContractDetailsInfoItem>
      ) }
      { sourceCodeLink && (
        <ContractDetailsInfoItem
          label="Source code"
          isLoading={ isLoading }
        >
          { sourceCodeLink }
        </ContractDetailsInfoItem>
      ) }
      { config.UI.hasContractAuditReports && (
        <ContractDetailsInfoItem
          label="Security audit"
          isLoading={ isLoading }
        >
          <ContractSecurityAudits addressHash={ addressData.hash }/>
        </ContractDetailsInfoItem>
      ) }
    </Grid>
  );
};

export default React.memo(ContractDetailsInfo);
