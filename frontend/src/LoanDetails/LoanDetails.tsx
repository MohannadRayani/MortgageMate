import React from "react";

const LoanDetails = ({
  principal,
  setPrincipal,
  rate,
  setRate,
  years,
  setYears,
  months,
  setMonths,
  extraMonthly,
  setExtraMonthly,
  extraYearly,
  setExtraYearly,
  downpayment,
  setDownpayment,
  calculateMortgage,
  formatCurrency,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mx-auto max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold">💰 Loan Amount ($)</label>
          <input
            type="text"
            value={formatCurrency(principal)}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-semibold">📈 Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-semibold">📅 Loan Length</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Months"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold">🏠 Downpayment ($)</label>
          <input
            type="text"
            value={formatCurrency(downpayment)}
            onChange={(e) => setDownpayment(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Extra Payments */}
      <h2 className="text-xl font-semibold mt-6">Extra Payment Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div>
          <label className="block font-semibold">Monthly Payments ($)</label>
          <input
            type="number"
            value={extraMonthly}
            onChange={(e) => setExtraMonthly(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block font-semibold">Annual Payments ($)</label>
          <input
            type="number"
            value={extraYearly}
            onChange={(e) => setExtraYearly(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <button
        className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-6"
        onClick={calculateMortgage}
      >
        Calculate Mortgage 💰
      </button>
    </div>
  );
};

export default LoanDetails;