import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './../public/mortgage_mate.svg'; // Ensure the correct path to the logo

const Header = () => {
  const [userFullName, setUserFullName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fullName = localStorage.getItem("userFullName");
    if (fullName) {
      setUserFullName(fullName);
    } else {
      setUserFullName("");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("userFullName");
    setUserFullName("");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <img src={logo} alt="MortgageMate Logo" className="h-20 w-30 mr-4" /> {/* Adjusted height and width */}
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
                  Mortgage Comparison
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {userFullName ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-700">{userFullName}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/signin">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;