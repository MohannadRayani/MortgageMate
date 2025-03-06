import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

// ✅ Register the Filler Plugin to enable the "fill" option
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LoanBalanceChart = ({
  principal,
  rate,
  years,
  downpayment,
  extraMonthly,
  extraYearly,
  prepayments,
  calculateMortgageWithoutExtraPayments,
}) => {
  const [regularData, setRegularData] = useState(null);
  const [noExtraData, setNoExtraData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const regularResult = await calculateMortgageWithoutExtraPayments({
        principal,
        rate,
        years,
        downpayment,
        extraMonthly,
        extraYearly,
        prepayments,
      });

      setRegularData(regularResult || { amortizationTable: [] });

      const noExtraResult = await calculateMortgageWithoutExtraPayments({
        principal,
        rate,
        years,
        downpayment,
        prepayments,
      });

      setNoExtraData(noExtraResult || { amortizationTable: [] });
    } catch (error) {
      console.error("Error calculating data:", error);
    }
  }, [principal, rate, years, downpayment, extraMonthly, extraYearly, prepayments]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!regularData || !regularData.amortizationTable || !noExtraData || !noExtraData.amortizationTable) {
    return <div>Loading...</div>;
  }

  const getYearFromMonth = (month) => Math.floor((month - 1) / 12) + 1;

  const uniqueYears = [...new Set(regularData.amortizationTable.map((row) => getYearFromMonth(row.month)))];

  const regularPaymentsByYear = uniqueYears.map((year) => {
    const yearData = regularData.amortizationTable.filter((row) => getYearFromMonth(row.month) === year);
    return yearData.length > 0 ? yearData[yearData.length - 1].remainingBalance : 0;
  });

  const noExtraPaymentsByYear = uniqueYears.map((year) => {
    const yearData = noExtraData.amortizationTable.filter((row) => getYearFromMonth(row.month) === year);
    return yearData.length > 0 ? yearData[yearData.length - 1].remainingBalance : 0;
  });

  const data = {
    labels: uniqueYears,
    datasets: [
      {
        label: "With Extra Payments",
        data: regularPaymentsByYear,
        borderColor: "#4D9BEF",
        backgroundColor: "rgba(77, 155, 239, 0.3)",
        fill: true, // ✅ This now works since we registered the Filler plugin
        tension: 0.4,
      },
      {
        label: "Without Extra Payments",
        data: noExtraPaymentsByYear,
        borderColor: "#FF9F40",
        backgroundColor: "rgba(255, 159, 64, 0.3)",
        fill: true, // ✅ This now works since we registered the Filler plugin
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Loan Balance Over Time",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LoanBalanceChart;
