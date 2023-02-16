import { Box, Button, Heading, Icon, Text, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import icon404 from 'icons/error-pages/404.svg';
import icon422 from 'icons/error-pages/422.svg';
import icon500 from 'icons/error-pages/500.svg';

interface Props {
  statusCode: number;
  className?: string;
}

const ERRORS: Record<string, {icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>; text: string; title: string }> = {
  '404': {
    icon: icon404,
    title: 'Page not found',
    text: 'This page is no longer explorable! If you are lost, use the search bar to find what you are looking for.',
  },
  '422': {
    icon: icon422,
    title: 'Request cannot be processed',
    text: 'Your request contained an error, perhaps a mistyped tx/block/address hash. Try again, and check the developer tools console for more info.',
  },
  '500': {
    icon: icon500,
    title: 'Oops! Something went wrong',
    text: 'An unexpected error has occurred. Try reloading the page, or come back soon and try again.',
  },
};

const AppError = ({ statusCode, className }: Props) => {
  const error = ERRORS[String(statusCode)] || ERRORS['500'];

  return (
    <Box className={ className }>
      <Icon as={ error.icon } width="200px" height="auto"/>
      <Heading mt={ 8 } size="2xl" fontFamily="body">{ error.title }</Heading>
      <Text variant="secondary" mt={ 3 }> { error.text } </Text>
      <Button
        mt={ 8 }
        size="lg"
        variant="outline"
        as="a"
        href={ route({ pathname: '/' }) }
      >
        Back to home
      </Button>
    </Box>
  );
};

export default chakra(AppError);
