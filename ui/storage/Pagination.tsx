/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import styles from './pagination.module.css';

// Example items, to simulate fetching from another resources.
const items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ];

function PaginatedItems({ itemsPerPage }: { itemsPerPage: number }) {
  // We start with an empty list of items.
  const [ currentItems, setCurrentItems ] = useState<Array<number>>([]);
  console.log(currentItems);
  const [ pageCount, setPageCount ] = useState(1);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [ itemOffset, setItemOffset ] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    // console.log(`Loading items from ${ itemOffset } to ${ endOffset }`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [ itemOffset, itemsPerPage ]);

  // Invoke when user click to request another page.
  const handlePageClick = (page: number) => () => {
    const newOffset = page * itemsPerPage % items.length;
    setItemOffset(newOffset);
  };
  // console.log(handlePageClick);
  return (
    <ReactPaginate
      nextLabel=">"
      previousLabel="<"
      onPageChange={ handlePageClick(1) }
      pageRangeDisplayed={ 2 }
      marginPagesDisplayed={ 2 }
      pageCount={ pageCount }
      pageClassName={ styles['page-item'] }
      pageLinkClassName={ styles['page-link'] }
      previousClassName={ styles['page-item'] }
      previousLinkClassName={ styles['page-link'] }
      nextClassName={ styles['page-item'] }
      nextLinkClassName={ styles['page-link'] }
      breakLabel="..."
      breakClassName={ styles['page-item'] }
      breakLinkClassName={ styles['page-link'] }
      containerClassName={ styles.pagination }
      activeClassName={ styles.active }
      renderOnZeroPageCount={ null }
    />
  );
}

export default React.memo(PaginatedItems);
