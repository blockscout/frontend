import { Box } from '@chakra-ui/react';
import { MultisenderWidget } from '@multisender.app/multisender-react-widget';
import React from 'react';

const Container = ({ children }: { children: React.ReactNode }) => (
  <Box
    maxW="670px"
    css={{
      '& > .multisenderTheme': {
        '--mw-color-brand': { _light: 'colors.blue.600', _dark: 'colors.blue.500' },
        '--mw-color-brand-stroke': { _light: 'colors.gray.200', _dark: 'colors.theme.topbar.bg._dark' },
        '--mw-color-brand-text-secondary': 'colors.text.secondary',
        '--mw-color-brand-fill': 'colors.dialog.bg',
        fontFamily: 'body',
        '& [class*="_stepBody_"] > span': {
          fontSize: 'xs',
          fontWeight: 'normal',
        },
        '& [class*="_step_"]:not([data-progress="true"]), & [class*="_step_"][data-completed="true"]': {
          '& [class*="_stepBody_"] > span': {
            color: 'text.secondary',
          },
          '& [class*="_stepIcon_"]': {
            backgroundColor: { _light: 'gray.100', _dark: 'theme.topbar.bg._dark' },
          },
          '& [class*="_stepCompletedIcon_"]': {
            color: 'text.secondary',
          },
        },
        '& [class*="_stepIcon_"]': {
          fontSize: 'xs',
          width: '24px',
          height: '24px',
          minWidth: '24px',
          minHeight: '24px',
        },
        '& [class*="_stepSeparator_"]': {
          height: '1px',
        },
        '& [class*="_stepperRoot_"] > :nth-child(1)': {
          padding: '0 12px',
        },
        '& [class*="_fieldsetRoot_"]:not([class*="_itemRoot_"])': {
          borderRadius: 'md',
          padding: '24px',
          '& button': {
            fontSize: 'xs',
            '& label': {
              fontWeight: 'medium !important',
            },
          },
          '& > *:first-child': {
            gap: '12px',
            '& > :nth-child(4) > button': {
              marginBottom: '12px',
              border: '2px solid',
              borderColor: 'button.outline.fg',
              borderRadius: 'base',
              color: 'button.outline.fg',
              height: '32px',
              padding: '0 12px',
              fontSize: 'sm',
              transitionProperty: 'all',
              transitionDuration: 'moderate',
              '&:hover': {
                background: 'none',
                color: 'hover',
                borderColor: 'hover',
              },
              '&:active': {
                transform: 'none',
              },
            },
          },
          '& > *:last-child': {
            '& p[data-size="sm"], & a[data-size="sm"]': {
              fontSize: 'xs',
            },
            '& a[data-size="sm"]': {
              color: 'link.primary',
              fontWeight: 'medium !important',
              '&:hover': {
                color: 'link.primary.hover',
              },
            },
          },
          '& p[data-size="xl"], & h5': {
            fontFamily: 'heading',
            fontSize: '18px',
            fontWeight: 'medium !important',
          },
          '& [class*="_tableTr_"]': {
            fontWeight: 'medium',
            '& td': {
              padding: '12px 0',
            },
            '& a': {
              color: 'link.primary',
              fontSize: 'sm',
              '&:hover': {
                color: 'link.primary.hover',
                textDecoration: 'none',
              },
            },
          },
          '& [class*="SummaryList-module__root__"]': {
            '& + div': {
              gap: '4px',
              '& > div:last-child': {
                '& button': {
                  background: 'none',
                  border: 'none',
                  color: 'button.outline.fg',
                  transitionProperty: 'all',
                  transitionDuration: 'moderate',
                  '&:hover': {
                    color: 'hover',
                  },
                  '&:active': {
                    transform: 'none',
                  },
                },
                '& p': {
                  fontSize: 'sm',
                  color: 'text.secondary',
                },
              },
            },
            '& + button': {
              marginTop: '12px',
            },
          },
        },
        '& [class*="_itemRoot_"]': {
          border: 'none',
          borderRadius: 'base',
          backgroundColor: { _light: 'theme.topbar.bg._light', _dark: 'theme.topbar.bg._dark' },
          '& > div': {
            gap: '8px',
          },
        },
        '& [class*="_inputWrapper_"]': {
          '& [class*="_input_"]': {
            borderRadius: 'base',
            border: '2px solid',
            borderColor: 'input.border.filled',
            height: '32px',
            minHeight: '32px',
            fontSize: 'sm',
            fontWeight: 'medium',
            color: 'input.fg',
            '&::placeholder': {
              color: 'input.placeholder',
            },
          },
          '&[data-size="xl"]': {
            '& [class*="_input_"]': {
              height: '60px',
              minHeight: '60px',
              fontSize: 'md',
            },
            '& button': {
              height: '40px',
              fontSize: 'md',
              backgroundColor: 'button.solid.bg',
              borderRadius: 'base',
              transitionProperty: 'all',
              transitionDuration: 'moderate',
              color: 'white',
              '&:hover': {
                backgroundColor: 'hover',
              },
              '&:active': {
                transform: 'none',
              },
              '&:disabled': {
                opacity: '0.2',
              },
            },
          },
        },
        '& [class*="RecipientsEditor-module__head_"]': {
          fontSize: 'xs',
          marginTop: '12px',
          '& p': {
            fontWeight: 'medium',
          },
          '& button': {
            background: 'none',
            color: 'link.primary',
            fontWeight: 'medium',
            padding: 0,
            height: '18px',
            transitionProperty: 'all',
            transitionDuration: 'moderate',
            '&:hover': {
              color: 'link.primary.hover',
            },
            '&:active': {
              transform: 'none',
            },
          },
        },
        '& [class*="CodeMirror"]': {
          fontSize: '15px',
          '& .cm-scroller': {
            borderRadius: 'base',
            borderWidth: '2px',
            borderColor: 'input.border.filled',
          },
          '& .cm-gutters': {
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0',
            borderRightWidth: '2px',
            borderColor: 'input.border.filled',
            backgroundColor: { _light: 'gray.50', _dark: 'whiteAlpha.50' },
            '&:before': {
              background: 'none',
            },
          },
          '& .cm-placeholder': {
            color: 'input.placeholder',
          },
        },
        '& [class*="_modalRoot_"]': {
          '& [class*="_modalOverlay_"]': {
            backgroundColor: 'blackAlpha.800',
          },
          '& [class*="_modalContent_"]': {
            borderRadius: 'xl',
            padding: '24px',
          },
          '& [class*="_modalHeader_"]': {
            minHeight: '40px',
            padding: 0,
            marginBottom: '8px',
            '& [class*="_modalTitle_"]': {
              fontFamily: 'heading',
              fontWeight: 'medium',
              fontSize: '24px',
            },
          },
          '& [class*="_modalHeader_"] + div': {
            '&, & > div': {
              padding: '0 !important',
            },
            '& h6, & p': {
              fontSize: 'md',
            },
          },
          '& [class*="_closeButton_"]': {
            background: 'none',
            color: 'close-button-fg',
            '&:hover': {
              color: 'hover',
            },
          },
        },
        '& div[role="alert"]': {
          borderRadius: 'base',
          padding: '8px 12px',
          margin: '0 !important',
          '& p, & div': {
            fontSize: 'md',
            color: 'text.primary',
          },
          '& [class*="_alertIcon_"]': {
            marginTop: '2px',
            marginRight: '8px',
            '& svg': {
              fill: 'text.primary',
              width: '20px',
              height: '20px',
            },
          },
          '&:not([data-variant="filled"]) [class*="_alertIcon_"]': {
            display: 'none',
          },
        },
        '& div[role="tooltip"]': {
          backgroundColor: 'tooltip.bg',
          color: 'tooltip.fg',
          borderRadius: 'sm',
          padding: '4px 8px !important',
          '& p': {
            fontSize: 'sm',
            fontWeight: 'medium',
          },
        },
        '& [class*="_button_"][data-size="lg"], [class*="_button_"][data-size="md"]': {
          borderRadius: 'base',
          color: 'white',
          height: '40px',
          backgroundColor: 'button.solid.bg',
          transitionProperty: 'background-color',
          transitionDuration: 'moderate',
          '&:disabled': {
            opacity: '0.2',
          },
          '&:hover': {
            backgroundColor: 'hover',
          },
          '&:active': {
            transform: 'none',
          },
          '& > span[aria-hidden="true"]': {
            width: '20px',
            height: '20px',
            '& > span::after': {
              width: '20px',
              height: '20px',
            },
          },
        },
        '& [class*="Summary-module__upgradeBtn__"]': {
          borderRadius: 'base',
          border: 'none',
          height: '32px',
          padding: '0 12px',
          fontSize: 'sm !important',
          fontWeight: 'semibold',
          transitionProperty: 'all',
          transitionDuration: 'moderate',
          '&[class*="_crown_"]': {
            color: 'white',
            backgroundColor: 'button.solid.bg',
            '&:hover': {
              backgroundColor: 'hover',
            },
          },
          '&[class*="_gift_"]': {
            color: 'button.outline.fg',
            border: '2px solid',
            borderColor: 'button.outline.fg',
            marginRight: '-4px',
            background: 'none',
            '&:hover': {
              color: 'hover',
              borderColor: 'hover',
            },
          },
          '& span[data-position="left"]': {
            display: 'none',
          },
        },
        '& [class*="Summary-module__editGasCost__"]': {
          border: 'none',
          background: 'none',
          '& svg': {
            width: '16px',
            height: '16px',
            color: 'link.primary',
            transitionProperty: 'all',
            transitionDuration: 'moderate',
          },
          '&:hover svg': {
            color: 'link.primary.hover',
          },
          '&:active': {
            transform: 'none',
          },
        },
        '& div[role="radiogroup"]': {
          '& > div': {
            gap: '8px',
          },
          '& [class*="LargeRadio-module__root_"]': {
            '& svg': {
              transform: 'none',
            },
            '& label': {
              '& p:not([data-size="sm"])': {
                fontWeight: 'semibold !important',
              },
              '& p[data-size="sm"]': {
                color: 'text.secondary',
              },
            },
            '& > div[class*="LargeRadio-module__body_"]': {
              border: 'none',
              borderRadius: 'base',
              backgroundColor: { _light: 'theme.topbar.bg._light', _dark: 'theme.topbar.bg._dark' },
            },
            '&:not([data-checked="true"]) input': {
              backgroundColor: 'transparent',
              border: '2px solid',
              borderColor: 'input.border.filled',
            },
            '& > div > div:not([class*="_labelWrapper_"])': {
              marginTop: '2px',
            },
            '& .tabler-icon-info-circle': {
              stroke: 'text.primary',
              width: '20px',
              height: '20px',
            },
          },
        },
        '& [class*="TokenSelect-module__grid_"]': {
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '12px',
          flexWrap: 'wrap',
        },
        '& > .multisenderMantineProvider': {
          '--mantine-color-text': 'text.primary',
          '--mantine-color-red-light': 'colors.alert.bg.error',
          '--mantine-color-blue-light': 'colors.alert.bg.info',
          '& > div:nth-child(1)': {
            padding: '0 !important',
            gap: 0,
            '& > :nth-child(1)': {
              margin: '0 !important',
            },
          },
        },
      },
    }}
  >{ children }</Box>
);

const config = {
  '1': {
    id: 1,
    name: 'Ethereum',
    blockExplorerUrl: {
      tx: 'https://eth.blockscout.com/tx/',
      address: 'https://eth.blockscout.com/address/',
    },
    multisenderContractAddress: '0x88888c037DF4527933fa8Ab203a89e1e6E58db70',
    rpcUrls: [ 'https://eth.blockscout.com/api/eth-rpc' ],
    blockScoutApiUrl: 'https://eth.blockscout.com',
  },
  '11155111': {
    id: 11155111,
    name: 'Sepolia',
    blockExplorerUrl: {
      tx: 'https://eth-sepolia.blockscout.com/tx/',
      address: 'https://eth-sepolia.blockscout.com/address/',
    },
    multisenderContractAddress: '0x88888c037DF4527933fa8Ab203a89e1e6E58db70',
    rpcUrls: [ 'https://eth-sepolia.blockscout.com/api/eth-rpc' ],
    blockScoutApiUrl: 'https://eth-sepolia.blockscout.com',
  },
  '30': {
    id: 30,
    name: 'Rootstock',
    blockExplorerUrl: {
      tx: 'https://rootstock.blockscout.com/tx/',
      address: 'https://rootstock.blockscout.com/address/',
    },
    multisenderContractAddress: '0x88888c037DF4527933fa8Ab203a89e1e6E58db70',
    rpcUrls: [ 'https://rootstock.blockscout.com/api/eth-rpc' ],
    blockScoutApiUrl: 'https://rootstock.blockscout.com',
  },
  '100': {
    id: 100,
    name: 'Gnosis',
    blockExplorerUrl: {
      tx: 'https://gnosis.blockscout.com/tx/',
      address: 'https://gnosis.blockscout.com/address/',
    },
    multisenderContractAddress: '0x88888c037DF4527933fa8Ab203a89e1e6E58db70',
    rpcUrls: [ 'https://gnosis.blockscout.com/api/eth-rpc' ],
    blockScoutApiUrl: 'https://gnosis.blockscout.com',
  },
};

const Multisend = () => {
  return (
    <Container>
      <MultisenderWidget
        config={ config }
        logoType="minified"
        classNames={{
          theme: 'multisenderTheme',
          mantineProvider: 'multisenderMantineProvider',
        }}
      />
    </Container>
  );
};

export default Multisend;
