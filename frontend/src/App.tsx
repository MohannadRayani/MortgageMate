import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AmortizationTable from "./AmortizationTable/AmortizationTable";
import LoanDetails from "./LoanDetails/LoanDetails";
import Header from "./Header";
import SignIn from "./SignIn";
import Register from "./Register";
import MortgageComparison from "./MortgageComparison";

function App() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [extraMonthly, setExtraMonthly] = useState("");
  const [extraYearly, setExtraYearly] = useState("");
  const [downpayment, setDownpayment] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const calculateMortgage = async () => {
    try {
      const res = await fetch("http://localhost:8080/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          principal: parseFloat(principal.replace(/,/g, "")),
          rate: parseFloat(rate),
          years: parseInt(years),
          extraMonthly: parseFloat(extraMonthly) || 0,
          extraYearly: parseFloat(extraYearly) || 0,
          downpayment: parseFloat(downpayment.replace(/,/g, "")) || 0,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    }
  };

  const calculateMortgageWithoutExtraPayments = async () => {
    try {
      const res = await fetch("http://localhost:8080/calculate-without-extra-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          principal: parseFloat(principal.replace(/,/g, "")),
          rate: parseFloat(rate),
          years: parseInt(years),
          extraMonthly: parseFloat(extraMonthly) || 0,
          extraYearly: parseFloat(extraYearly) || 0,
          downpayment: parseFloat(downpayment.replace(/,/g, "")) || 0,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <main className="flex-grow container mx-auto p-6">
                {/* Loan Calculation Inputs */}
                <LoanDetails
                  principal={principal}
                  setPrincipal={setPrincipal}
                  rate={rate}
                  setRate={setRate}
                  years={years}
                  setYears={setYears}
                  months={months}
                  setMonths={setMonths}
                  extraMonthly={extraMonthly}
                  setExtraMonthly={setExtraMonthly}
                  extraYearly={extraYearly}
                  setExtraYearly={setExtraYearly}
                  downpayment={downpayment}
                  setDownpayment={setDownpayment}
                  calculateMortgage={calculateMortgage}
                  formatCurrency={formatCurrency}
                />

                {/* Results */}
                {response && (
                  <div className="mt-6 bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-lg font-semibold mt-4">📝 Amortization Schedule</h3>
                    <AmortizationTable
                      calculateMortgageWithoutExtraPayments={calculateMortgageWithoutExtraPayments}
                      loanAmount={response.loanAmount}
                      amortizationTable={response.amortizationTable}
                      monthlyPayment={response.monthlyPayment}
                      totalInterestPaid={response.totalInterestPaid}
                      totalLoanCost={response.totalLoanCost}
                      payoffDate={response.payoffDate}
                    />
                  </div>
                )}
              </main>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comparison" element={<MortgageComparison />} />
        </Routes>
      </div>
  );
}

export default App;
