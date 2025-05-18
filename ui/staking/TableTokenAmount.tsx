/* eslint-disable */

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
            textTransform: 'capitalize'
        }}
    >
        <span>{ Number(amount).toLocaleString('en-US') }</span>
        <span style={{ color: '#000', marginLeft: '4px' , marginRight: '80px'}}>{ symbol }</span>
    </span>
    );
}

export default TableTokenAmount;