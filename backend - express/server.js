const express = require("express");
const cors = require("cors");
const os = require("os");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 8080;
const SALT_ROUNDS = 10; // For hashing passwords

// Initialize SQLite Database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) console.error("Database Error:", err.message);
  console.log("Connected to SQLite database.");

  // Ensure the users table exists (case-insensitive emails)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE COLLATE NOCASE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

// Mortgage Calculation Function
const calculateAmortization = (
  principal,
  rate,
  years,
  downpayment = 0,
  extraMonthly = 0,
  extraYearly = 0,
  prepayments = 0
) => {
  const schedule = [];
  const loanAmount = principal - downpayment;

  if (downpayment >= principal) {
    return {
      loanAmount: loanAmount,
      monthlyPayment: 0,
      totalInterestPaid: 0,
      payoffDate: "N/A",
      totalLoanCost: 0,
      amortizationTable: [
        {
          month: 1,
          payment: 0,
          principalPayment: 0,
          interestPayment: 0,
          remainingBalance: 0,
        },
      ],
    };
  }

  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  let remainingBalance = loanAmount;
  let totalInterestPaid = 0;
  let totalExtraPayments = 0;
  let currentDate = new Date();

  for (let i = 1; i <= months; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;

    principalPayment += extraMonthly;
    if (i % 12 === 0) {
      principalPayment += extraYearly;
      totalExtraPayments += extraYearly;
    }
    if (i === 1 && prepayments > 0) {
      remainingBalance -= prepayments;
      totalExtraPayments += prepayments;
    }

    remainingBalance -= principalPayment;
    totalInterestPaid += interestPayment;
    if (remainingBalance < 0) remainingBalance = 0;

    schedule.push({
      month: i,
      payment: parseFloat(monthlyPayment.toFixed(2)),
      principalPayment: parseFloat(principalPayment.toFixed(2)),
      interestPayment: parseFloat(interestPayment.toFixed(2)),
      remainingBalance: parseFloat(remainingBalance.toFixed(2)),
    });

    if (remainingBalance <= 0) break;

    // Update current date to reflect month progress
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return {
    loanAmount: parseFloat(loanAmount.toFixed(2)), // Include loanAmount in the response
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalInterestPaid: parseFloat(totalInterestPaid.toFixed(2)),
    payoffDate: currentDate.toISOString().split("T")[0], // Returns YYYY-MM-DD
    totalLoanCost: parseFloat(totalInterestPaid + loanAmount),
    amortizationTable: schedule,
  };
};

// Mortgage Calculation API Endpoint (Without Extra Payments)
app.post("/calculate-without-extra-payments", (req, res) => {
  const {
    principal,
    rate,
    years,
    downpayment,
    extraMonthly,
    extraYearly,
    prepayments,
  } = req.body;

  if (!principal || !rate || !years) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Here, we ignore extraMonthly and extraYearly
  const result = calculateAmortization(
    parseFloat(principal),
    parseFloat(rate),
    parseInt(years),
    parseFloat(downpayment) || 0,
    0, // Set extraMonthly to 0 to ignore it
    0, // Set extraYearly to 0 to ignore it
    parseFloat(prepayments) || 0
  );

  res.json(result);
});

// Mortgage Calculation API Endpoint (With Extra Payments)
app.post("/calculate", (req, res) => {
  const {
    principal,
    rate,
    years,
    downpayment,
    extraMonthly,
    extraYearly,
    prepayments,
  } = req.body;

  if (!principal || !rate || !years) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = calculateAmortization(
    parseFloat(principal),
    parseFloat(rate),
    parseInt(years),
    parseFloat(downpayment) || 0,
    parseFloat(extraMonthly) || 0,
    parseFloat(extraYearly) || 0,
    parseFloat(prepayments) || 0
  );

  res.json(result);
});

// Register User API Endpoint (Case-Insensitive Email + Hashed Password)
app.post("/register", (req, res) => {
  let { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Missing full name, email, or password" });
  }

  email = email.toLowerCase(); // Normalize email to lowercase
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS); // Hash password

  db.run(
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
    [full_name, email, hashedPassword],
    function (err) {
      if (err) {
        console.error("Database Error:", err.message);
        return res
          .status(500)
          .json({ error: "User already exists, please sign in." });
      }
      res.json({
        message: "User registered successfully",
        userId: this.lastID,
        fullName: full_name,
      });
    }
  );
});

// Login Authentication API Endpoint (Case-Insensitive Email + Secure Password Check)
app.post("/login", (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  email = email.toLowerCase(); // Normalize email to lowercase

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Valid login", fullName: user.full_name });
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Mortgage Calculator API is running!");
});

// Start Server
app.listen(PORT, () => {
  const networkInterfaces = os.networkInterfaces();
  let localIp = "localhost";
  for (const interfaceName in networkInterfaces) {
    for (const netConfig of networkInterfaces[interfaceName]) {
      if (netConfig.family === "IPv4" && !netConfig.internal) {
        localIp = netConfig.address;
        break;
      }
    }
    if (localIp !== "localhost") break;
  }
  console.log(`Server is running on http://${localIp}:${PORT}`);
});
