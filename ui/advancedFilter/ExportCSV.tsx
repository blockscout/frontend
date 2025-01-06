import { Button } from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import dayjs from 'lib/date/dayjs';
import downloadBlob from 'lib/downloadBlob';
import useToast from 'lib/hooks/useToast';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

type Props = {
  filters: AdvancedFilterParams;
};

const ExportCSV = ({ filters }: Props) => {
  const recaptcha = useReCaptcha();
  const toast = useToast();
  const [ isLoading, setIsLoading ] = React.useState(false);

  const handleExportCSV = React.useCallback(async() => {
    try {
      setIsLoading(true);
      const token = await recaptcha.executeAsync();

      if (!token) {
        throw new Error('ReCaptcha is not solved');
      }

      const url = buildUrl('advanced_filter_csv', undefined, {
        ...filters,
        recaptcha_response: token,
      });

      const response = await fetch(url, {
        headers: {
          'content-type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();
      const fileName = `export-filtered-txs-${ dayjs().format('YYYY-MM-DD-HH-mm-ss') }.csv`;
      downloadBlob(blob, fileName);

    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [ toast, filters, recaptcha ]);

  if (!config.services.reCaptchaV2.siteKey) {
    return null;
  }

  return (
    <>
      <Button
        onClick={ handleExportCSV }
        variant="outline"
        isLoading={ isLoading }
        size="sm"
        mr={ 3 }
      >
        Export to CSV
      </Button>
      <ReCaptcha ref={ recaptcha.ref }/>
    </>
  );
};

export default ExportCSV;
