import { Button, Skeleton } from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function RestakeBtn() {
  const router: any = useRouter();
  console.log(router, '?????????????????????');

  const [isPending, start] = useTimeoutFn(
    () => {
      console.log('已经3s了', isPending);
    },
    2000,
    { immediate: true }
  );

  return (
    <>
      <Skeleton isLoaded={!isPending}>
        <Button size="sm" variant="outline" onClick={() => router.push({ pathname: '/mining/DeepLink' })}>
          Restake
        </Button>
      </Skeleton>
    </>
  );
}

export default RestakeBtn;
