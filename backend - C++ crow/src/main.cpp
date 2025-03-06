#include "crow.h"
#include <cmath>
#include <vector>
#include <iostream>

//CORS Middleware (Allows ONLY 'http://localhost:5173')
struct CORSHandler : crow::ILocalMiddleware {
    struct context {};

    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        res.set_header("Access-Control-Allow-Origin", "http://localhost:5173");  //Restrict to frontend origin
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set_header("Access-Control-Allow-Credentials", "true");
    }

    void after_handle(crow::request& req, crow::response& res, context& ctx) {
        res.set_header("Access-Control-Allow-Origin", "http://localhost:5173");  //Ensure response headers match
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set_header("Access-Control-Allow-Credentials", "true");
    }
};

//Mortgage Calculation Logic
struct Payment {
    int month;
    double principalPayment;
    double interestPayment;
    double remainingBalance;
};

//Function to Calculate Amortization Schedule
std::vector<Payment> calculateAmortization(double principal, double rate, int years) {
    std::vector<Payment> schedule;
    double monthlyRate = rate / 12 / 100;
    int months = years * 12;
    double monthlyPayment = (principal * monthlyRate) / (1 - pow(1 + monthlyRate, -months));

    double remainingBalance = principal;
    for (int i = 1; i <= months; i++) {
        double interestPayment = remainingBalance * monthlyRate;
        double principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push_back({i, principalPayment, interestPayment, remainingBalance});
    }
    return schedule;
}

int main() {
    crow::App<CORSHandler> app;  //Attach Middleware

    //Root Route
    CROW_ROUTE(app, "/")([]() {
        return "Mortgage Calculator API is running!";
    });

    //Handle OPTIONS Preflight Requests (CORS)
    CROW_ROUTE(app, "/calculate")
        .methods("OPTIONS"_method)
        ([](const crow::request& req) {
            crow::response res(200);  //Return 200 OK to avoid CORS issues
            res.set_header("Access-Control-Allow-Origin", "http://localhost:5173");
            res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.set_header("Access-Control-Allow-Credentials", "true");
            res.end();
            return res;
        });

    //Mortgage Calculation API (Handles JSON Correctly)
    CROW_ROUTE(app, "/calculate")
        .methods("POST"_method)
        ([](const crow::request &req) {
            std::cout << "Received JSON: " << req.body << std::endl;  //Debug log

            auto json = crow::json::load(req.body);
            if (!json) {
                std::cerr << "Error: Failed to parse JSON" << std::endl;
                return crow::response(400, "Invalid JSON");
            }

            //Validate Required Fields
            if (!json.has("principal") || !json.has("rate") || !json.has("years")) {
                return crow::response(400, "Missing required fields");
            }

            double principal = json["principal"].d();
            double rate = json["rate"].d();
            int years = json["years"].i();

            std::cout << "Processing: Principal=" << principal << ", Rate=" << rate << ", Years=" << years << std::endl;

            auto schedule = calculateAmortization(principal, rate, years);

            crow::json::wvalue res;
            res["monthlyPayment"] = (principal * (rate / 12 / 100)) /
                                    (1 - pow(1 + (rate / 12 / 100), -years * 12));

            std::vector<crow::json::wvalue> amortizationList;
            for (const auto &p : schedule) {
                crow::json::wvalue row;
                row["month"] = p.month;
                row["principalPayment"] = p.principalPayment;
                row["interestPayment"] = p.interestPayment;
                row["remainingBalance"] = p.remainingBalance;
                amortizationList.push_back(std::move(row));
            }

            res["amortizationTable"] = std::move(amortizationList);

            std::cout << "Response ready" << std::endl;

            return crow::response(res);
        });

    app.port(8080).multithreaded().run();
}
