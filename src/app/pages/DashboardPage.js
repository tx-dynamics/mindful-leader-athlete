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
import CompanyService from "../services/CompanyService";
import GetVerticalChart from "./GetVerticalChart";

export function DashboardPage() {
  const [allCompanies, setAllCompanies] = useState([]);

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
      <div className="row">
        {allCompanies.map((company) => (
          <div className="col-md-6" key={company._id}>
            <div className={`card card-custom mb-5`}>
              <div className="card-body d-flex flex-column p-0 ">
                <GetVerticalChart companyId={company._id} />
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
