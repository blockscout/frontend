import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';

interface Props {
  question: string;
  answer: string;
}

const GasTrackerFaqItem = ({ question, answer }: Props) => {
  const hoverColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  return (
    <AccordionItem as="section" _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }} borderColor={ borderColor }>
      { ({ isExpanded }) => (
        <>
          <AccordionButton
            _hover={{ bgColor: hoverColor }}
            px={ 0 }
          >
            <chakra.h3 flex="1" textAlign="left" fontSize="lg" fontWeight={ 500 }>{ question }</chakra.h3>
            <AccordionIcon transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' } color="gray.500"/>
          </AccordionButton>
          <AccordionPanel pb={ 4 } px={ 0 }>
            <Text color="text_secondary">{ answer }</Text>
          </AccordionPanel>
        </>
      ) }
    </AccordionItem>
  );
};

export default GasTrackerFaqItem;
