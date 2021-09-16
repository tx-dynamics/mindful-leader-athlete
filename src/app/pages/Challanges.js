import React, { useState } from "react";
import { Dashboard } from "../../_metronic/_partials";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import _ from "lodash";
import ChallangeService from "../services/ChallangeService";
import moment from "moment";
import { toAbsoluteUrl } from "../../_metronic/_helpers";
export function Challanges(props) {
  const userTableRef = React.createRef();
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [recordId, setRecordId] = useState(null);
  const [menuRecordId, setMenuRecordId] = useState(null);
  const handleDeleteClick = (id) => {
    console.log("DELETE", id);
    ChallangeService.deleteChallange(id)
      .then((result) => {
        window.location.reload();
        console.log("OK", result);
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  const handleRefClick = (user) => {
    handleEdit(user._id);
  };

  const [state, setState] = useState({
    columns: [
      {
        title: "Challange Title",
        field: "challangeTitle",
        // render: (row) => <>{row.name} </>,
        filtering: false,
      },
      {
        title: "Company Name",
        // field: "challangeTitle",
        render: (row) => <>{row.company.companyName} </>,
        // filtering: false,
      },
      {
        title: "Start Date",
        field: "startDate",
        render: (row) => {
          const date = moment(row.startDate).format("YYYY-MM-DD");
          return <>{date}</>;
        },
        filtering: false,
      },
      {
        title: "Expiry Date",
        field: "expiryDate",
        render: (row) => {
          const date = moment(row.expiryDate).format("YYYY-MM-DD");
          return <>{date}</>;
        },
        filtering: false,
      },
      {
        title: "Actions",
        field: "reference",
        filtering: false,
        render: (row) => (
          <>
            <Link
              to={`/editChallange/${row._id}/?company=${row.company.companyName}`}
              title="Edit challange"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Write.svg")} />
              </span>
            </Link>
            <> </>

            <Link
              title="Delete challange"
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              onClick={() => handleDeleteClick(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Trash.svg")} />
              </span>
            </Link>
          </>
        ),
      },
    ],
    data: (query) =>
      new Promise((resolve, reject) => {
        ChallangeService.query(query).then((result) => {
          console.log("Query: ", query);
          console.log("Result: ", result);
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
  React.useEffect(() => {
    refreshTable();
    if (!open) setRecordId(null);
  }, [open]);
  React.useEffect(() => {
    refreshTable();
    if (!openMenu) setMenuRecordId(null);
  }, [openMenu]);
  React.useEffect(() => {
    setTimeout(() => {
      // handleEdit("5f751ba4d31aa542447b9af0");
      // setOpen(true);
    }, 10);
  }, []);
  const handleEdit = (id) => {
    setRecordId(id);
    setOpen(true);
  };
  const handleCardOpen = (id) => {
    setRecordId(id);
    setOpenCard(true);
  };

  return (
    // <Dashboard />
    // <h1>Dashboard</h1>
    <>
      <MaterialTable
        title="Challanges"
        columns={state.columns}
        data={state.data}
        tableRef={userTableRef}
        detailPanel={[
          {
            tooltip: "Show Habbits",
            render: (rowData) => {
              //CompanyService.getSingleCompany(id)
              return (
                <MaterialTable
                  columns={[
                    { title: "Habit Title", field: "habbitTitle" },
                    {
                      title: "Habit Description",
                      field: "habbitDescription",
                    },
                  ]}
                  data={rowData.habbits}
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
            tooltip: "Create Challange",
            isFreeAction: true,
            onClick: (event) => {
              event.preventDefault();
              props.history.push("/createChallange");
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
}
