export const sortCaret = (order, column) => {
  if (order === "asc")
    return <i className="pl-1 fa fa-caret-up" aria-hidden="true"></i>;
  else if (order === "desc")
    return <i className="pl-1 fa fa-caret-down" aria-hidden="true"></i>;

  return (
    <i
      style={{ color: "gray" }}
      className="pl-1 fa fa-caret-down"
      aria-hidden="true"
    ></i>
  );
};

