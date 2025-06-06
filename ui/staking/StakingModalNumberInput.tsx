/* eslint-disable */
import { 
    Input ,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import {
    Box,
    Flex,
    Button,
    Text,
} from '@chakra-ui/react';
import React , { useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';
import { Avatar } from '@chakra-ui/react';
import useAccount from 'lib/web3/useAccount';
import { useBalance, usePublicClient } from 'wagmi';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';


const valueFormatter = (price : string | number | null) => {
    if ( price === null || Number.isNaN(price)) {
        return `$--`
    }
    if (price === 0) {
        return `$0.00`
    }
    return `$${Number(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

const valueCalculator = ( tokenAmount : string | number, tokenPrice : string | number ) => {
    if ( tokenAmount === "" || Number.isNaN(Number(tokenAmount)) ) {
        return null;
    }
    const amount = Number(tokenAmount || 0);
    const price = Number(tokenPrice || 0);
    return (amount * price);
}

const StakingModalNumberInput = ({
    value,
    currentTxType,
    availableAmount = '0.00',
    setValue,
    inputStr,
    setInputStr,
    isOverAmount = false,
    uneditable = false,
    handleMaxClick
}: {
    value: string;
    availableAmount: string;
    uneditable?: boolean;
    currentTxType: string;
    setValue: (value: string) => void;
    inputStr: string;
    isOverAmount?: boolean;
    setInputStr: (value: string) => void;
    handleMaxClick: () => void;
}) => {


  const { address: userAddr } = useAccount();
  const { data: balanceData } = useBalance({ address: userAddr});
  const { tokenPrice } = useStakeLoginContextValue();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const formattedBalanceStr = React.useMemo(() => {
      if (balanceData && !!balanceData.value) {
          return formatUnits(balanceData.value, 18);
      }
      return '0.00';
  }, [userAddr , balanceData]);


  const availableAmountNumber = Number(availableAmount.replace(/,/g, ''));


  const amountStringFormatter = (amount: string) => {
    return amount.replace(/,/g, "")
  }


  const overTips = useMemo(() => (
    <span
      style={{
        color: '#EE6969',
        fontFamily: 'HarmonyOS Sans',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '140%',
      }}>
      { currentTxType.includes('Stake') ? "Insufficient Balance" : "Amount exceeds available balance" }
    </span>
  ), [currentTxType]);


  const handleChange = (e : any ) => {
    let value = e.target.value.replace(/,/g, ''); // 移除现有逗号
    let formattedValue = '';

    // 允许临时状态：空输入、"0."、"-" 等
    if (!value || value === '-' || /^-?\d+\.?$|^-?0\.?\d{0,2}$/.test(value)) {
        e.target.lastValidValue = value; // 保存临时状态
        formattedValue = value; // 直接显示用户输入
    } else {
        // 验证输入格式：整数部分任意长度，小数部分最多四位
        if (!/^-?\d*\.?\d{0,2}$/.test(value)) {
            // 输入无效，回退到上一个有效值
            e.target.value = e.target.lastValidValue || '';
            return;
        }

        // 保存当前有效值
        e.target.lastValidValue = value;

        // 分离整数和小数部分
        let [integerPart, decimalPart = ''] = value.split('.');

        // 添加逗号到整数部分
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // 拼接整数和小数部分
        formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    }
      setInputStr(formattedValue);
      setValue(amountStringFormatter(formattedValue));
  };

  const prefix = useMemo(() => {
    if (currentTxType === 'Stake' || currentTxType === 'ChooseStake') {
      return 'Balance:';
    }
    return 'Available:';
  }
  , [currentTxType]);

  return (
    <InputGroup height={'auto'} width={'100%'} borderRadius={'16px'}>
      <Input
          pr='145px'
          pb='44px'
          height={'auto'}
          type={'text'}
          value={inputStr}
          onChange={ handleChange }
          style={{
            color: '#FF57B7 !important',
          }}
          borderRadius={'16px'}
          onWheel={(e) => e.currentTarget.blur()}
          _placeholder={{
            fontFamily: "HarmonyOS Sans",
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '140%',
            color: 'rgba(0, 0, 0, 0.10)'
          }}
          _focus={{
            color: '#FF57B7',
            border: isOverAmount ? '1px solid #EE6969' : '1px solidrgb(7, 7, 7)',
          }}
          _hover={{
            color: '#FF57B7',
          }}
          _active={{
            color: '#FF57B7',
          }}
          fontFamily={'HarmonyOS Sans'}
          fontSize={'40px'}
          fontStyle={'normal'}
          color={'#FF57B7'}
          fontWeight={700}
          disabled={uneditable}
          lineHeight={'140%'} /* 56px */
          border = { isOverAmount ? '1px solid #EE6969' : '1px solid rgba(0, 46, 51, 0.10)'}
          backdropFilter='blur(5px)'
          placeholder = '0.00'
      />
      <InputRightElement width='auto' top={'14px'} right={'16px'} height='auto'>
        <Flex flexDirection={'column'} width='auto' height='auto'>
            <Box width='auto' height='56px' paddingY={'16px'}>
                <Flex justifyContent={'flex-end'} gap={'12px'} alignItems="center" width='100%' height='100%'>
                    <Button
                      px='8px'
                      py='4px'
                      borderRadius={'9999px'}
                      backgroundColor={'#FFCBEC'}
                      color={'#FF57B7'}
                      fontSize='12px'
                      fontStyle='normal'
                      fontWeight='400'
                      lineHeight='normal'
                      fontFamily="HarmonyOS Sans"
                      textTransform='capitalize'
                      _hover={{
                        backgroundColor: '#FF57B7',
                        color: '#FFCBEC',
                      }}
                      height='auto'
                      colorScheme='pink'
                      onClick={ handleMaxClick}
                    >MAX</Button>
                    <Flex flexDirection={'row'} width='auto' gap={"4px"} height='auto' alignItems='center' justifyContent={'flex-end'}>
                        <img
                            style={{ borderRadius: '50%' }}
                            src="/static/moca-brand.svg"
                            width="20px"
                            draggable={false}
                            height="20px"
                        />
                        <Text
                            fontSize="14px"
                            fontWeight="500"
                            color="rgba(0, 0, 0, 0.60)"
                            textAlign="center"
                            fontStyle="normal"
                            lineHeight="normal"
                            fontFamily="HarmonyOS Sans"
                        >
                          Moca
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
      </InputRightElement>
      <Flex 
        
        zIndex='200'
        px="16px"
        w="100%"
        height="20px"
        py = { 0}
        position={"absolute"}
        justifyContent="space-between"
        alignItems="center"
        bottom={"16px"}
        left={0}
      >
            <Text
                fontSize="14px"
                fontWeight="500"
                color="rgba(0, 0, 0, 0.30)"
                textAlign="center"
                fontStyle="normal"
                lineHeight="140%"
                as ="span"
                fontFamily="HarmonyOS Sans"
            >
                {  isOverAmount ? ( overTips ) : valueFormatter(valueCalculator(value, tokenPrice)) }
            </Text>
            <Text
                fontSize="14px"
                fontWeight="500"
                color="rgba(0, 0, 0, 0.30)"
                textAlign="center"
                fontStyle="normal"
                lineHeight="140%"
                as ="span"
                fontFamily="HarmonyOS Sans"
            >
                { prefix }&nbsp;<span  style={{ color: '#000' }}>
                    <span>
                      {availableAmountNumber.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} MOCA
                    </span>
                </span>
            </Text>
      </Flex>
    </InputGroup>
  )
}

export default StakingModalNumberInput;