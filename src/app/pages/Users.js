import React from "react";

import { useState } from "react";
import MaterialTable from "material-table";
import _ from "lodash";
import UserService from "../services/UserService";
// import moment from "moment";
const Users = () => {
  // let companies = useSelector(({ adminReducer }) => adminReducer.companies);
  // console.log(companies);
  const userTableRef = React.createRef();
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [recordId, setRecordId] = useState(null);
  const [menuRecordId, setMenuRecordId] = useState(null);
  const handleRefClick = (user) => {
    handleEdit(user._id);
  };

  const [state, setState] = useState({
    columns: [
      {
        title: "Name",
        field: "fullName",
        // render: (row) => <>{row.name} </>,
        filtering: false,
      },
      {
        title: "Email",
        field: "email",
        filtering: false,
      },
      {
        title: "Company Name",
        // field: "challangeTitle",
        render: (row) => <>{row.company.companyName} </>,
        filtering: false,
      },
    ],
    data: (query) =>
      new Promise((resolve, reject) => {
        UserService.query(query).then((result) => {
          resolve({
            data: result.data,
            page: result.page,
            totalCount: result.total,
          });
        });
      }),
  });

  const refreshTable = () => {
    if (userTableRef.current) userTableRef.current.onQueryChange();
  };

  const handleEdit = (id) => {
    setRecordId(id);
    setOpen(true);
  };

  // console.log(recordId);
  return (
    <div className="col">
      <MaterialTable
        title="Users"
        columns={state.columns}
        data={state.data}
        tableRef={userTableRef}
        options={{
          search: true,
          filtering: true,
          rowStyle: { height: "2.0rem" },
          headerStyle: { padding: "0.5em" },
          cellStyle: {
            padding: "0.5em",
          },
        }}
      ></MaterialTable>
    </div>
  );
};

export default Users;
