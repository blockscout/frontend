const styles = {
  '.network-title': {
    paddingBlock: 2,
    paddingInline: 3,
    fontWeight: 'bold',
    backgroundColor: 'var(--chakra-colors-blue-50)',
    marginBlockEnd: 4,
    borderRadius: 'var(--chakra-radii-base)',
  },
  '.network-menu': {
    display: 'grid !important',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px !important',
    padding: 0,
    listStyle: 'none',

    '& .network-menu-li': {
      aspectRatio: '1 / 1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      background: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      flexDirection: 'column',

      '& span': {
        display: 'block',
      },
      '& .network-menu-link': {
        fontWeight: 'bold',

        '& .network-menu-li-icon': {
          display: 'none !important',
        },
      },
    },
  },
};

export default styles;
