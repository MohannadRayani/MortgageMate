# MortgageMate

A mortgage calculator application with user authentication, built with Express.js backend and C++ alternative backend.

## Project Structure

- `frontend/` - Web interface built with Vue.js
- `backend - express/` - Node.js/Express.js backend
- `backend - C++/` - Alternative C++ backend using Crow

## Setup & Installation

### Express Backend
1. Navigate to `backend - express/`
2. Run `npm install`
3. Start the server: `node server.js`

### Frontend
1. Navigate to `frontend/`
2. Run `npm install`
3. Start development server: `npm run dev`

### C++ Backend
1. Navigate to `backend - C++/`
2. Create build directory: `mkdir build && cd build`
3. Generate build files: `cmake ..`
4. Build the project: `cmake --build .`

## Environment Setup
The Express backend runs on port 8080 and frontend on port 5173 by default.

## Features
- Mortgage calculation with various parameters
- User authentication system
- Amortization schedule generation
- Support for extra payments calculation