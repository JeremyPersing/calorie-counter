import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationService from "../services/paginationService";
import "../styles/MealsTable.css";

function MealsTable({ keyField, data, columns, ...rest }) {
  const { SearchBar, ClearSearchButton } = Search;

  const emptyTableIndication = "Table is Empty";

  return (
    <ToolkitProvider
      keyField={keyField}
      data={data}
      columns={columns}
      noDataIndication={emptyTableIndication}
      search
    >
      {(props) => (
        <div>
          <div className="d-flex justify-content-end">
            <SearchBar {...props.searchProps} className="mb-3" />
            <ClearSearchButton
              {...props.searchProps}
              className="btn btn-secondary mb-3 ml-1"
            />
          </div>
          <BootstrapTable
            {...props.baseProps}
            bordered={false}
            rowClasses="row-classes"
            pagination={paginationFactory(paginationService.paginationOptions)}
            {...rest}
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default MealsTable;
