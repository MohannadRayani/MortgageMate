import React from "react";

const ExportButton = ({ data }) => {
  const handleExport = () => {
    const csvData = data.map(row => ({
      Month: row.month,
      Principal: row.principalPayment,
      Interest: row.interestPayment,
      Remaining: row.remainingBalance
    }));

    const csvContent = [
      ["Month", "Principal", "Interest", "Remaining"],
      ...csvData.map(row => [row.Month, row.Principal, row.Interest, row.Remaining])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "amortization_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
    >
      Export as CSV
    </button>
  );
};

export default ExportButton;