import React, { useState, useEffect } from "react";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

function Pagination(props) {
  //   const { totalRecords = null, pageLimit = 30, pageNeighbors = 0 } = props;
  const [currPage, setCurrPage] = useState(1);
  useEffect(() => {
    gotoPage(1);
  }, []);


  const pageLimit = typeof props.pageLimit === "number" ? props.pageLimit : 10;

  const totalRecords =
    typeof props.totalRecords.length === "number"
      ? props.totalRecords.length
      : 0;

  const pageNeighbors =
    typeof props.pageNeighbors === "number"
      ? Math.max((0, Math.min(props.pageNeighbors, 2)))
      : 0;

  const totalPages = Math.ceil(totalRecords / pageLimit);

  const gotoPage = (page) => {
    const { onPageChanged = (f) => f } = props;
    const currentPage = Math.max(0, Math.min(page, totalPages));
    const paginationData = {
      currentPage,
      totalPages,
      pageLimit,
      totalRecords,
    };
    setCurrPage(currentPage);
    onPageChanged(paginationData);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClick = (page) => (evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    const page = currPage - pageNeighbors * 2 - 1;
    gotoPage(page);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    const page = currPage + pageNeighbors * 2 + 1;
    gotoPage(page);
  };

  const fetchPageNumbers = () => {
    const pageTotal = totalPages;
    const currentPage = currPage;
    const neighborsOfPage = pageNeighbors;

    const totalNumbers = pageNeighbors * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (pageTotal > totalBlocks) {
      const startPage = Math.max(2, currentPage - neighborsOfPage);
      const endPage = Math.min(pageTotal - 1, currentPage + neighborsOfPage);
      let pages = range(startPage, endPage);

      const hasSpillLeft = startPage > 2;
      const hasSpillRight = pageTotal - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasSpillLeft && !hasSpillRight: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        case !hasSpillLeft && hasSpillRight: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        case hasSpillLeft && hasSpillRight:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  if (!totalRecords || totalPages === 1) return null;
  const pages = fetchPageNumbers();

  return (
    <>
      <nav>
        <ul className="pagination">
          {pages.map((page, index) => {
            if (page === LEFT_PAGE)
              return (
                <li key={index} className="page-item">
                  <button
                    className="btn page-link"
                    aria-label="Previous"
                    onClick={handleMoveLeft}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </button>
                </li>
              );

            if (page === RIGHT_PAGE)
              return (
                <li key={index} className="page-item">
                  <button
                    className="btn page-link"
                    aria-label="Next"
                    onClick={handleMoveRight}
                  >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </button>
                </li>
              );

            return (
              <li
                key={index}
                className={`page-item${currPage === page ? " active" : ""}`}
              >
                <a
                  href="#page-top"
                  className="btn page-link"
                  onClick={handleClick(page)}
                >
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default Pagination;
