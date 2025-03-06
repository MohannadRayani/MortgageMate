import React from "react";
import ExportButton from "../ExportButton";
import PieChart from "../PieChart";
import BarChart from "../BarChart";
import LoanBalanceChart from "../LoanBalanceChart";

const AmortizationTable = ({
  calculateMortgageWithoutExtraPayments,
  amortizationTable,
  monthlyPayment,
  totalInterestPaid,
  totalLoanCost,
  payoffDate,
  loanAmount,
  interestRate,
  loanLength,
  downpayment,
  extraMonthly,
  extraYearly,
}) => {
  const handlePrint = () => {
    const printContent = document.getElementById("printableContent").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Function to format the next month of payoff date
  const getNextMonthFormatted = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="relative">
      {/* Printable Content Wrapper */}
      <div id="printableContent">
        {/* Loan Summary */}
        <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg mt-3 p-4">
          <h3 className="text-lg font-semibold mb-2 text-center">Loan Summary</h3>
          <div className="flex justify-between items-center text-center border-b pb-3">
            <div className="w-1/4">
              <span className="font-semibold block">Monthly Payment:</span>
              <span>${monthlyPayment?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-1/4">
              <span className="font-semibold block">Total Interest Paid:</span>
              <span>${Math.ceil(totalInterestPaid).toLocaleString("en-US")}</span>
            </div>
            <div className="w-1/4">
              <span className="font-semibold block">Total Cost of Loan:</span>
              <span>${Math.ceil(totalLoanCost).toLocaleString("en-US")}</span>
            </div>
            <div className="w-1/4">
              <span className="font-semibold block">Payoff Date:</span>
              <span>{getNextMonthFormatted(payoffDate)}</span>
            </div>
          </div>
        </div>
        {/* Scrollable Amortization Table */}
        <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg mt-3 overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-2 px-4 border">Month</th>
                  <th className="py-2 px-4 border">Principal</th>
                  <th className="py-2 px-4 border">Interest</th>
                  <th className="py-2 px-4 border">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(amortizationTable)
                  ? amortizationTable.map((row, index) => (
                      <tr key={index} className="border-b text-center">
                        <td className="py-2 px-4 border">{row.month}</td>
                        <td className="py-2 px-4 border">${parseFloat(row.principalPayment)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 px-4 border">${parseFloat(row.interestPayment)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 px-4 border">${parseFloat(row.remainingBalance)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  : JSON.parse(amortizationTable).map((row, index) => (
                      <tr key={index} className="border-b text-center">
                        <td className="py-2 px-4 border">{row.month}</td>
                        <td className="py-2 px-4 border">${parseFloat(row.principalPayment)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 px-4 border">${parseFloat(row.interestPayment)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 px-4 border">${parseFloat(row.remainingBalance)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export and Print Buttons */}
      <div className="flex justify-end mt-4 space-x-2">
        <ExportButton data={amortizationTable} className="px-6 py-1.5 text-white font-semibold text-md rounded-lg bg-blue-500 hover:bg-blue-600 shadow-md transition duration-200 w-44 text-center" />
        <button 
          onClick={handlePrint} 
          className="px-6 py-1.5 text-white font-semibold text-md rounded-lg bg-blue-500 hover:bg-blue-600 shadow-md transition duration-200 w-44 text-center"
        >
          Print Version
        </button>
      </div>

      {/* Charts Side by Side */}
      <div className="mt-6 flex flex-wrap md:flex-nowrap gap-4">
        <div className="w-full md:w-1/2">
          <PieChart totalPrincipal={loanAmount} totalInterestPaid={totalInterestPaid} />
        </div>
        <div className="w-full md:w-1/2">
          <BarChart totalPrincipal={loanAmount} totalInterestPaid={totalInterestPaid} />
        </div>
      </div>
    </div>
  );
};

export default AmortizationTable;
