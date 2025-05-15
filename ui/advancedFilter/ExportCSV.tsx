import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import dayjs from 'lib/date/dayjs';
import downloadBlob from 'lib/downloadBlob';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import { Tooltip } from 'toolkit/chakra/tooltip';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

type Props = {
  filters: AdvancedFilterParams;
};

const ExportCSV = ({ filters }: Props) => {
  const recaptcha = useReCaptcha();
  const [ isLoading, setIsLoading ] = React.useState(false);

  const handleExportCSV = React.useCallback(async() => {
    try {
      setIsLoading(true);
      const token = await recaptcha.executeAsync();

      if (!token) {
        throw new Error('ReCaptcha is not solved');
      }

      const url = buildUrl('general:advanced_filter_csv', undefined, {
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
      toaster.error({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [ filters, recaptcha ]);

  if (!config.services.reCaptchaV2.siteKey) {
    return null;
  }

  return (
    <>
      <Tooltip
        content="This feature is not available due to a reCAPTCHA initialization error. Please contact the project team on Discord to report this issue."
        disabled={ !recaptcha.isInitError }
      >
        <Button
          onClick={ handleExportCSV }
          variant="outline"
          loading={ isLoading }
          size="sm"
          mr={ 3 }
          disabled={ recaptcha.isInitError }
        >
          Export to CSV
        </Button>
      </Tooltip>
      <ReCaptcha { ...recaptcha } hideWarning/>
    </>
  );
};

export default ExportCSV;
