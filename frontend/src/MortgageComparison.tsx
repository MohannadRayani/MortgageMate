import React, { useState } from "react";
import LoanDetails from "./LoanDetails/LoanDetails";
import AmortizationTable from "./AmortizationTable/AmortizationTable";
import { Link } from "react-router-dom";


const MortgageComparison = () => {
  const [loan1, setLoan1] = useState({
    principal: "",
    rate: "",
    years: "",
    months: "",
    extraMonthly: "",
    extraYearly: "",
    downpayment: "",
    response: null,
    error: null,
  });

  const [loan2, setLoan2] = useState({
    principal: "",
    rate: "",
    years: "",
    months: "",
    extraMonthly: "",
    extraYearly: "",
    downpayment: "",
    response: null,
    error: null,
  });

  const calculateMortgage = async (loan, setLoan) => {
    try {
      const res = await fetch("http://localhost:8080/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          principal: parseFloat(loan.principal.replace(/,/g, "")),
          rate: parseFloat(loan.rate),
          years: parseInt(loan.years),
          extraMonthly: parseFloat(loan.extraMonthly) || 0,
          extraYearly: parseFloat(loan.extraYearly) || 0,
          downpayment: parseFloat(loan.downpayment.replace(/,/g, "")) || 0,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      setLoan((prevLoan) => ({ ...prevLoan, response: data }));
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoan((prevLoan) => ({ ...prevLoan, error: err.message }));
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md w-full">
      </header>
      <main className="flex-grow container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LoanDetails
              principal={loan1.principal}
              setPrincipal={(value) => setLoan1((prev) => ({ ...prev, principal: value }))}
              rate={loan1.rate}
              setRate={(value) => setLoan1((prev) => ({ ...prev, rate: value }))}
              years={loan1.years}
              setYears={(value) => setLoan1((prev) => ({ ...prev, years: value }))}
              months={loan1.months}
              setMonths={(value) => setLoan1((prev) => ({ ...prev, months: value }))}
              extraMonthly={loan1.extraMonthly}
              setExtraMonthly={(value) => setLoan1((prev) => ({ ...prev, extraMonthly: value }))}
              extraYearly={loan1.extraYearly}
              setExtraYearly={(value) => setLoan1((prev) => ({ ...prev, extraYearly: value }))}
              downpayment={loan1.downpayment}
              setDownpayment={(value) => setLoan1((prev) => ({ ...prev, downpayment: value }))}
              calculateMortgage={() => calculateMortgage(loan1, setLoan1)}
              formatCurrency={formatCurrency}
            />
            {loan1.response && (
              <div className="mt-6 bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-lg font-semibold mt-4">📝 Amortization Schedule</h3>
                <AmortizationTable
                  loanAmount={loan1.response.loanAmount}
                  amortizationTable={loan1.response.amortizationTable}
                  monthlyPayment={loan1.response.monthlyPayment}
                  totalInterestPaid={loan1.response.totalInterestPaid}
                  totalLoanCost={loan1.response.totalLoanCost}
                  payoffDate={loan1.response.payoffDate}
                />
              </div>
            )}
          </div>
          <div>
            <LoanDetails
              principal={loan2.principal}
              setPrincipal={(value) => setLoan2((prev) => ({ ...prev, principal: value }))}
              rate={loan2.rate}
              setRate={(value) => setLoan2((prev) => ({ ...prev, rate: value }))}
              years={loan2.years}
              setYears={(value) => setLoan2((prev) => ({ ...prev, years: value }))}
              months={loan2.months}
              setMonths={(value) => setLoan2((prev) => ({ ...prev, months: value }))}
              extraMonthly={loan2.extraMonthly}
              setExtraMonthly={(value) => setLoan2((prev) => ({ ...prev, extraMonthly: value }))}
              extraYearly={loan2.extraYearly}
              setExtraYearly={(value) => setLoan2((prev) => ({ ...prev, extraYearly: value }))}
              downpayment={loan2.downpayment}
              setDownpayment={(value) => setLoan2((prev) => ({ ...prev, downpayment: value }))}
              calculateMortgage={() => calculateMortgage(loan2, setLoan2)}
              formatCurrency={formatCurrency}
            />
            {loan2.response && (
              <div className="mt-6 bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-lg font-semibold mt-4">📝 Amortization Schedule</h3>
                <AmortizationTable
                  loanAmount={loan2.response.loanAmount}
                  amortizationTable={loan2.response.amortizationTable}
                  monthlyPayment={loan2.response.monthlyPayment}
                  totalInterestPaid={loan2.response.totalInterestPaid}
                  totalLoanCost={loan2.response.totalLoanCost}
                  payoffDate={loan2.response.payoffDate}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MortgageComparison;