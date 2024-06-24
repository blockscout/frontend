import { Button, Box } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app';

export const ViewOnBuildBear = () => {
  const router = useRouter();
  const [ sandboxId, setSandboxId ] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = window.location.hostname;
    const urlParts = url.split('.');
    if (urlParts.length >= 3) {
      const sandboxId = urlParts[0];
      setSandboxId(sandboxId);
    }
  }, []);

  return (
    <Box position="fixed" right="12" bottom="12">
      <a
        href={
          sandboxId ?
            `https://explorer.${ appConfig?.app?.buildbearBase }/${ sandboxId }${
              router?.asPath ? router?.asPath : ''
            }` : `https://explorer.${ appConfig?.app?.buildbearBase }`
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button colorScheme="teal" size="md" bgColor="#54A9B3" gap="4px">
          <Image
            src="https://home.buildbear.io/BBLogo.svg"
            alt="BuildBear Logo"
            width="24"
            height="24"
          />
					View on BuildBear
        </Button>
      </a>
    </Box>
  );
};
