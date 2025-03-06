import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ totalPrincipal, totalInterestPaid }) => {
  const data = {
    labels: ["Total Principal", "Total Interest Paid"],
    datasets: [
      {
        data: [totalPrincipal, totalInterestPaid],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) =>
          new Intl.NumberFormat("en-US").format(value), // Format with commas
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
