/* eslint-disable */
import TokenAmountFormat from "ui/validators/TokenAmountFormat";

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
            textTransform: 'capitalize',
            textAlign: 'center',
        }}
    >
        <span>{ TokenAmountFormat(amount) }</span>
        <span style={{ color: '#000', marginLeft: '4px' }}>{ symbol }</span>
    </span>
    );
}

export default TableTokenAmount;