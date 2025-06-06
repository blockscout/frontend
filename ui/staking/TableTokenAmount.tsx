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


const TableTokenAmount = ({ 
    amount,
    symbol = 'MOCA'
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