/* eslint-disable */
import TokenAmountFormat from "ui/validators/TokenAmountFormat";


const truncateTokenAmount = (num : number | string | null | undefined): string => {
    let _num = num;
    if (typeof num === 'string') {
      _num = Number(_num);
    }
    if (typeof _num !== 'number' || isNaN(_num)) return '-';

    const truncated = Math.trunc(_num * 100) / 100;

    if (truncated === 0 && _num > 0 && _num < 0.01) {
      return '<0.01';
    }

    const hasDecimal = truncated % 1 !== 0;
    return hasDecimal ? truncated.toFixed(2).replace(/\.?0+$/, '') : truncated.toString();
}


const truncatePercentage = ( _num: number | string | null | undefined): string => {
  let num = _num;
  if (typeof num === 'string') {
      num = Number(num);
  } else if (!num || isNaN(num)) {
    return '-';
  }
  const rounded = +(num.toFixed(2)); // 四舍五入到两位

  if (rounded === 0 && num > 0 && num < 0.01) {
    return '<0.01%';
  }

  const hasDecimal = rounded % 1 !== 0;
  return hasDecimal ? `${rounded}` + '%' : `${rounded}%`;
}


const TableTokenAmount = ({ 
    amount,
    symbol = 'Moca'
}: { amount: number | string ; symbol: string }) => {

    return (
    <span 
        style={{ 
            color: '#A80C53',
            fontFamily: "HarmonyOS Sans",
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            width: '100%',
                
            textAlign: 'center',
        }}
    >
        <span>{ TokenAmountFormat(amount) }</span>
        <span style={{ color: '#000', marginLeft: '4px' }}>{ symbol }</span>
    </span>
    );
}

export default TableTokenAmount;