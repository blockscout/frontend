import { LinkIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box, Button, Heading, Icon, IconButton, Image, Link, List, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, Text,
} from '@chakra-ui/react';
import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';

import type { AppCategory, AppItemOverview } from 'types/client/apps';

import { TEMPORARY_DEMO_APPS } from 'data/apps';
import ghIcon from 'icons/social/git.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import { nbsp } from 'lib/html-entities';

type Props = {
  id: string | null;
  onClose: () => void;
}

const AppModal = ({
  id,
  onClose,
}: Props) => {
  const handleFavorite = useCallback(() => {
    // TODO: implement
  }, []);

  if (!id) {
    return null;
  }

  const {
    title,
    author,
    description,
    url,
    site,
    github,
    telegram,
    twitter,
    logo,
    categories,
  } = TEMPORARY_DEMO_APPS.find(app => app.id === id) as AppItemOverview;

  const isFavorite = false;

  const socialLinks = [
    Boolean(telegram) && {
      icon: tgIcon,
      url: telegram,
    },
    Boolean(twitter) && {
      icon: twIcon,
      url: twitter,
    },
    Boolean(github) && {
      icon: ghIcon,
      url: github,
    },
  ].filter(Boolean) as Array<{ icon: FunctionComponent; url: string }>;

  return (
    <Modal
      isOpen={ Boolean(id) }
      onClose={ onClose }
      size={{ base: 'full', lg: 'md' }}
      isCentered
    >
      <ModalOverlay/>

      <ModalContent>
        <ModalHeader
          display="grid"
          gridTemplateColumns={{ base: 'auto 1fr' }}
          paddingRight={{ sm: 12 }}
        >
          <Box
            w={{ base: '72px', sm: '144px' }}
            h={{ base: '72px', sm: '144px' }}
            marginRight={{ base: 6, sm: 8 }}
            gridRow={{ base: '1 / 3', sm: '1 / 4' }}
          >
            <Image
              src={ logo }
              alt={ `${ title } app icon` }
            />
          </Box>

          <Heading
            as="h2"
            gridColumn={ 2 }
            fontSize={{ base: '2xl', sm: '3xl' }}
            fontWeight="medium"
            lineHeight={ 1 }
            color="blue.600"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            { title }
          </Heading>

          <Text
            variant="secondary"
            gridColumn={ 2 }
            fontSize="sm"
            fontWeight="normal"
            lineHeight={ 1 }
          >
            By{ nbsp }{ author }
          </Text>

          <Box
            gridColumn={{ base: '1 / 3', sm: 2 }}
            marginTop={{ base: 6, sm: 0 }}
          >
            <Box display="flex">
              <Button
                href={ url }
                as="a"
                size="sm"
                marginRight={ 2 }
                width={{ base: '100%', sm: 'auto' }}
              >
                Launch app
              </Button>

              <IconButton
                aria-label="Mark as favorite"
                title="Mark as favorite"
                variant="outline"
                colorScheme="gray"
                w={ 9 }
                h={ 8 }
                onClick={ handleFavorite }
                icon={ isFavorite ?
                  <Icon as={ StarIcon } w={ 4 } h={ 4 } color="yellow.400"/> :
                  <Icon as={ starOutlineIcon } w={ 4 } h={ 4 }/> }
              />
            </Box>
          </Box>
        </ModalHeader>

        <ModalCloseButton/>

        <ModalBody>
          <Heading
            as="h3"
            fontSize="2xl"
            marginBottom={ 4 }
          >
            Overview
          </Heading>

          <Box marginBottom={ 2 }>
            { categories.map((category: AppCategory) => (
              <Tag
                colorScheme="blue"
                marginRight={ 2 }
                marginBottom={ 2 }
                key={ category.id }
              >
                { category.name }
              </Tag>
            )) }
          </Box>

          <Text>{ description }</Text>
        </ModalBody>

        <ModalFooter
          display="flex"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems={{ base: 'flex-start', sm: 'center' }}
        >
          { site && (
            <Link
              isExternal
              href={ site }
              display="flex"
              alignItems="center"
              paddingRight={{ sm: 2 }}
              marginBottom={{ base: 2, sm: 0 }}
              overflow="hidden"
              maxW="100%"
            >
              <Icon
                as={ LinkIcon }
                display="inline"
                verticalAlign="baseline"
                boxSize={ 3 }
                color="blue.400"
                marginRight={ 2 }
              />

              <Text
                as="span"
                color="blue.400"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                { site }
              </Text>
            </Link>
          ) }

          { socialLinks.length && (
            <List
              marginLeft={{ sm: 'auto' }}
              display="flex"
            >
              { socialLinks.map(({ icon, url }) => (
                <Link
                  aria-label={ `Link to ${ url }` }
                  title={ url }
                  key={ url }
                  href={ url }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  isExternal
                  w={ 10 }
                  h={ 10 }
                  marginRight={ 2 }
                  _last={{ marginRight: 0 }}
                >
                  <Icon
                    as={ icon }
                    w="20px"
                    h="20px"
                    display="block"
                    color="blue.400"
                  />
                </Link>
              )) }
            </List>
          ) }
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AppModal;
