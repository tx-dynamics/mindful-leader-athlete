// import React, { useState } from "react";
// import { Dashboard } from "../../_metronic/_partials";
// export function DashboardPage() {
//   return (
//     // <Dashboard />
//     <>
//       <h1>Dashboard</h1>
//       <Dashboard />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { MixedWidget1 } from "../../_metronic/_partials/widgets";
import CompanyService from "../services/CompanyService";
import CompanyDepChart from "./CompanyDepChart";
import CompanyUsersChart from "./CompanyUsersChart";

import { Dropdown } from "react-bootstrap";

export function DashboardPage() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [monthNames, setMonthNames] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [month, setMonth] = useState("January");
  useEffect(() => {
    CompanyService.getAllCompanies()
      .then((res) => {
        console.log("AllCompanies: ", res);
        setAllCompanies(res);
      })
      .catch((err) => console.log("Error: ", err));
  }, []);
  return (
    <>
      <div className="col-lg-12">
        <MixedWidget1 className="card-stretch gutter-b" />
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className={`card card-custom mb-5`}>
            {/* Header bg-light-warning bg-light-success bg-light-danger bg-light-info */}
            {/* success */}
            {/* font-weight-normal text-dark-75 text-hover-primary font-size-lg mb-1 */}
            {/* font-weight-bolder text-success py-1 font-size-lg */}

            <div className="card-header border-0 bg-light-success py-5">
              <h3 className="card-title font-weight-bolder text-success py-1 font-size-lg ">
                Companies Stat for {month}
              </h3>
              <div className="card-toolbar">
                <Dropdown className="dropdown-inline" drop="down" alignRight>
                  <Dropdown.Toggle
                    id="dropdown-autoclose-inside"
                    className="btn btn-light-danger btn-sm font-weight-bolder dropdown-toggle px-5 btn btn-transparent"
                    variant="transparent"
                    // id="dropdown-toggle-top"
                  >
                    Select Month
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                    {/* <DropdownMenu2 /> */}
                    {/*begin::Navigation*/}
                    <ul className="navi navi-hover">
                      {monthNames.map((monthName) => (
                        <li className="navi-item" key={monthName}>
                          <a href="#" className="navi-link">
                            <span
                              className="navi-text"
                              value={monthName}
                              onClick={(e) => {
                                console.log(monthName);
                                setMonth(monthName);
                              }}
                            >
                              {monthName}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    {/*end::Navigation*/}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* <div className="card-body d-flex flex-column">Companies</div> */}
          </div>
        </div>
        {allCompanies.map((company) => (
          <div className="col-md-6" key={company._id}>
            <div className={`card card-custom mb-5`}>
              <div className="card-body d-flex flex-column p-0 ">
                <CompanyDepChart companyId={company._id} month={month} />
              </div>
            </div>
          </div>
        ))}
        <div className="col-md-12">
          <div className={`card card-custom mb-5`}>
            <div className="card-header border-0 bg-light-warning py-5">
              <h3 className="card-title font-weight-bolder text-warning py-1 font-size-lg ">
                Companies Users Stat for {month}
              </h3>
            </div>
          </div>
        </div>
        {allCompanies.map((company) => (
          <div className="col-md-12" key={company._id}>
            <div className={`card card-custom mb-5`}>
              <div className="card-body d-flex flex-column p-0 ">
                <CompanyUsersChart
                  companyId={company._id}
                  month={month}
                  companyName={company.companyName}
                />
              </div>
            </div>
          </div>
        ))}
        {/* <div className="col-md-6">
          <div className={`card card-custom`}>
            <GetVerticalChart />
          </div>
        </div> */}
      </div>
    </>
  );
}
