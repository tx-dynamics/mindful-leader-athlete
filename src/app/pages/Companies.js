import React from "react";

import { useState } from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import _ from "lodash";
import CompanyService from "../services/CompanyService";
import { toAbsoluteUrl } from "../../_metronic/_helpers";
import { Button } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";

const Companies = (props) => {
  // let companies = useSelector(({ adminReducer }) => adminReducer.companies);

  const userTableRef = React.createRef();
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [recordId, setRecordId] = useState(null);
  const [menuRecordId, setMenuRecordId] = useState(null);
  const handleDeleteClick = (id) => {
    console.log("DELETE", id);
    CompanyService.deleteCompany(id)
      .then((result) => {
        window.location.reload();
        console.log("OK", result);
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  const [state, setState] = useState({
    columns: [
      {
        title: "Company Name",
        field: "companyName",
        // render: (row) => <>{row.name} </>,
        filtering: false,
      },
      {
        title: "Users",
        field: "reference",
        filtering: false,
        render: (row) => (
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              props.history.push("/company/users/" + row._id);
            }}
          >
            View
          </Button>
        ),
      },
      // {
      //   title: "Company ID",
      //   field: "_id",
      //   filtering: false,
      // },
      {
        title: "Actions",
        field: "reference",
        filtering: false,
        render: (row) => (
          <>
            <Link
              to={`/editCompany/${row._id}`}
              title="Edit company"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Write.svg")} />
              </span>
            </Link>
            <> </>

            {/* <Link
              title="Delete company"
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              onClick={() => handleDeleteClick(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </Link> */}
          </>
        ),
      },
    ],
    data: (query) =>
      new Promise((resolve, reject) => {
        CompanyService.query(query).then((result) => {
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
  const handleCardOpen = (id) => {
    setRecordId(id);
    setOpenCard(true);
  };

  return (
    <>
      <MaterialTable
        title="Companies"
        columns={state.columns}
        data={state.data}
        tableRef={userTableRef}
        detailPanel={[
          {
            icon: VisibilityIcon,
            tooltip: "Show Departments",
            render: (rowData) => {
              //CompanyService.getSingleCompany(id)
              return (
                <MaterialTable
                  // title="Simple Action Preview"
                  columns={[{ title: "Department", field: "pod" }]}
                  data={rowData.departments}
                  options={{
                    // search: false,
                    paging: false,
                    toolbar: false,
                  }}
                />
              );
            },
          },
        ]}
        actions={[
          {
            icon: "add_box",
            tooltip: "Create Company",
            isFreeAction: true,
            onClick: (event) => {
              props.history.push("/createCompany");
            },
          },
        ]}
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
    </>
  );
};
const ClientName = ({ client }) => {
  if (!client) return <>No Client</>;
  return <>{client.name}</>;
};
const CompanyName = ({ company }) => {
  if (_.isEmpty(company)) return <>No Company</>;
  return <>{company.name}</>;
};

export default Companies;
