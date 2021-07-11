export const pageButtonRenderer = ({ page, active, onPageChange }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onPageChange(page);
  };
  const activeStyle = {};
  if (active) {
    activeStyle.backgroundColor = "#03A688";
    activeStyle.color = "white";
  } else {
    activeStyle.backgroundColor = "white";
    activeStyle.color = "#03A688";
  }
  if (typeof page === "string") {
    activeStyle.backgroundColor = "white";
    activeStyle.color = "#03A688";
  }
  return (
    <li className="page-item">
      <button
        className="page-link shadow-none"
        onClick={handleClick}
        style={activeStyle}
      >
        {page}
      </button>
    </li>
  );
};

export const sizePerPageOptionRenderer = ({
  text,
  page,
  onSizePerPageChange,
}) => (
  <li key={text} role="presentation" className="dropdown-item">
    <div
      tabIndex="-1"
      role="menuitem"
      data-page={page}
      onMouseDown={(e) => {
        e.preventDefault();
        onSizePerPageChange(page);
      }}
      className="page-option-item"
    >
      {text}
    </div>
  </li>
);

export const paginationOptions = {
  sizePerPageOptionRenderer,
  pageButtonRenderer,
  paginationSize: 4,
  pageStartIndex: 0,
  sizePerPageList: [
    {
      text: "5",
      value: 5,
    },
    {
      text: "10",
      value: 10,
    },
    {
      text: "15",
      value: 15,
    },
  ],
};

export default {
  paginationOptions,
};
