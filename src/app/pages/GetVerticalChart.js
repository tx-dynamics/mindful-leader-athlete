import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import DashboardService from "../services/DashboardService";
import _ from "lodash";
function GetVerticalChart({ companyId }) {
  const [companyData, setCompanyData] = useState();
  const [pods, setPods] = useState();
  const [score, setScore] = useState();
  const [companyName, setCompanyName] = useState();
  useEffect(() => {
    let today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    console.log("NEW Date: ", date);
    DashboardService.companyDepartments({
      companyId: companyId,
      startDate: date,
    })
      .then((res) => {
        console.log("Res: ", res);
        setCompanyData(res);
        setCompanyName(res.companyName);
        const dep = res.departments;
        var podresult = _.map(dep, "pod");
        setPods(podresult);
        console.log("podresult: ", podresult);
        var scoreResult = _.map(res.departments, "score");
        setScore(scoreResult);
        console.log("scoreResult: ", scoreResult);
      })
      .catch((err) => console.log("Error: ", err));
  }, []);

  const data = {
    labels: pods,
    datasets: [
      {
        label: companyName,
        data: [10, 12, 8],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <div>
      <Bar data={data} options={options} />
      <br />
    </div>
  );
}

export default GetVerticalChart;
