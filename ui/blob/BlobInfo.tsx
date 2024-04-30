import { Alert, Grid, GridItem, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Blob } from 'types/api/blobs';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import BlobData from './BlobData';

interface Props {
  data: Blob;
  isLoading?: boolean;
}

const BlobInfo = ({ data, isLoading }: Props) => {
  return (
    <Grid
      columnGap={ 8 }
      rowGap={ 3 }
      templateColumns={{ base: 'minmax(0, 1fr)', lg: '216px minmax(728px, auto)' }}
    >
      { !data.blob_data && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 3 }>
          <Skeleton isLoaded={ !isLoading }>
            <Alert status="warning">This blob is not yet indexed</Alert>
          </Skeleton>
        </GridItem>
      ) }
      { data.kzg_proof && (
        <DetailsInfoItem
          title="Proof"
          hint="Zero knowledge proof. Allows for quick verification of commitment"
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } overflow="hidden" whiteSpace="pre-wrap" wordBreak="break-all" lineHeight={ 6 } my="-2px">
            { data.kzg_proof }
            <CopyToClipboard text={ data.kzg_proof } isLoading={ isLoading }/>
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { data.kzg_commitment && (
        <DetailsInfoItem
          title="Commitment"
          hint="Commitment to the data in the blob"
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } overflow="hidden" whiteSpace="pre-wrap" wordBreak="break-all" lineHeight={ 6 } my="-2px">
            { data.kzg_commitment }
            <CopyToClipboard text={ data.kzg_commitment } isLoading={ isLoading }/>
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { data.blob_data && (
        <DetailsInfoItem
          title="Size, bytes"
          hint="Blob size in bytes"
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } overflow="hidden" whiteSpace="pre-wrap" wordBreak="break-all">
            { (data.blob_data.replace('0x', '').length / 2).toLocaleString() }
          </Skeleton>
        </DetailsInfoItem>
      ) }

      { data.blob_data && <DetailsInfoItemDivider/> }

      { data.transaction_hashes[0] && (
        <DetailsInfoItem
          title="Transaction hash"
          hint="Hash of the transaction with this blob"
          isLoading={ isLoading }
        >
          <TxEntity hash={ data.transaction_hashes[0].transaction_hash } isLoading={ isLoading } noIcon noCopy={ false }/>
        </DetailsInfoItem>
      ) }
      <DetailsSponsoredItem isLoading={ isLoading }/>

      { data.blob_data && (
        <>
          <DetailsInfoItemDivider/>
          <BlobData data={ data.blob_data } hash={ data.hash } isLoading={ isLoading }/>
        </>
      ) }
    </Grid>
  );
};

export default React.memo(BlobInfo);
