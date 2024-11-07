/* eslint-disable max-len */
import { Box, Text } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

const CapybaraRunner = () => {
  const [ hasReachedHighScore, setHasReachedHighScore ] = React.useState(false);

  React.useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
    };

    const handleHighScore = () => {
      setHasReachedHighScore(true);
    };

    window.addEventListener('reachedHighScore', handleHighScore);
    window.addEventListener('keydown', preventDefaultKeys);

    return () => {
      window.removeEventListener('keydown', preventDefaultKeys);
      window.removeEventListener('reachedHighScore', handleHighScore);
    };
  }, []);

  return (
    <>
      <Script strategy="lazyOnload" src="/static/capibara/index.js"/>
      <Box width={{ base: '100%', lg: '600px' }} height="300px" p="50px 0">
        <div id="main-frame-error" className="interstitial-wrapper">
          <div id="main-content"></div>
          <div id="offline-resources">
            <img id="offline-resources-1x" src="/static/capibara/capybaraSprite.png"/>
            <img id="offline-resources-2x" src="/static/capibara/capybaraSpriteX2.png"/>
          </div>
        </div>
      </Box>
      { hasReachedHighScore && <Text>You&apos;ve reached a high score!</Text> }
    </>
  );
};

export default CapybaraRunner;
