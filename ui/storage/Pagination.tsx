/* eslint-disable no-console */
import {
  Box,
} from '@chakra-ui/react';
import React from 'react';
// import ReactPaginate from 'react-paginate';

import styles from './pagination.module.css';

// Example items, to simulate fetching from another resources.
// const context = useTableListPageContext();
type Props = {
  page: number;
  propsPage: (value: number) => void;
  toNext: boolean;
}

function PaginatedItems(props: Props) {
  // We start with an empty list of items.
  // const [ currentItems, setCurrentItems ] = useState<Array<number>>([]);
  // console.log(currentItems);
  // const [ page, setPage ] = useState(1);
  // const { page, setPage } = React.useState(useTableListPageContext);

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  // const [ itemOffset, setItemOffset ] = useState(0);

  // useEffect(() => {
  //   // Fetch items from another resources.
  //   const endOffset = itemOffset + itemsPerPage;
  //   // console.log(`Loading items from ${ itemOffset } to ${ endOffset }`);
  //   setCurrentItems(items.slice(itemOffset, endOffset));
  //   setPageCount(Math.ceil(items.length / itemsPerPage));
  // }, [ itemOffset, itemsPerPage ]);

  // Invoke when user click to request another page.
  // const handlePageClick = (page: number) => () => {
  //   console.log(page);
  //   const newOffset = page * itemsPerPage % items.length;
  //   setItemOffset(newOffset);
  // };

  const clickPage = (clickEvent: string) => () => {
    if (clickEvent === 'Previous') {
      if (props.page <= 1) {
        return;
      } else {
        props.propsPage(props.page - 1);
      }
    } else if (clickEvent === 'Next') {
      if (!props.toNext) {
        return;
      } else {
        props.propsPage(props.page + 1);
      }
    }
  };
  return (
    // <ReactPaginate
    //   onClick={ clickPage() }
    //   nextLabel=""
    //   previousLabel=""
    //   // onPageChange={ handlePageClick(0) }
    //   pageCount={ pageCount }
    //   pageClassName={ styles['page-item'] }
    //   pageLinkClassName={ styles['page-link'] }
    //   previousClassName={ styles['page-item'] }
    //   previousLinkClassName={ styles['page-link'] }
    //   nextClassName={ styles['page-item'] }
    //   nextLinkClassName={ styles['page-link'] }
    //   breakLabel="..."
    //   breakClassName={ styles['page-item'] }
    //   breakLinkClassName={ styles['page-link'] }
    //   containerClassName={ styles.pagination }
    //   activeClassName={ styles.active }
    //   renderOnZeroPageCount={ null }
    // />
    <Box className={ styles.pagination }>
      <div className={ `${ styles.isPrevious } ${ props.page <= 1 ? styles.isDisabled : styles.isClick } }` } onClick={ clickPage('Previous') }></div>
      <div className={ styles.pageLink }>{ props.page }</div>
      <div className={ `${ styles.isNext } ${ !props.toNext && styles.isDisabledNext }` } onClick={ clickPage('Next') }></div>
    </Box>
  );
}

export default React.memo(PaginatedItems);
