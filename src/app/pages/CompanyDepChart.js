import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import DashboardService from "../services/DashboardService";
import _ from "lodash";

function CompanyDepChart({ companyId, month }) {
  const [clickedDataset, setClickedDataset] = useState("");
  const [clickedElement, setClickedElement] = useState("");
  const [clickedElements, setClickedElements] = useState("");

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
      monthName: month,
      startDate: date,
    })
      .then((res) => {
        console.log("Graph Res: ", res);
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
  }, [month]);

  const data = {
    labels: pods,
    datasets: [
      {
        label: companyName,
        data: score,
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
  const getDatasetAtEvent = (dataset) => {
    console.log("dataset: ", dataset);
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;
    // setClickedDataset(data.datasets[datasetIndex].label);
    console.log("dataset Index: ", dataset[0].datasetIndex);
  };

  const getElementAtEvent = (element) => {
    console.log("Element: ", element);
  };

  const getElementsAtEvent = (elements) => {
    console.log("Element: ", elements);
  };

  return (
    <div>
      <Bar
        data={data}
        options={options}
        getDatasetAtEvent={getDatasetAtEvent}
        getElementAtEvent={getElementAtEvent}
        getElementsAtEvent={getElementsAtEvent}
      />
      <br />
    </div>
  );
}

export default CompanyDepChart;
