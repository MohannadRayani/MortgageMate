cmake_minimum_required(VERSION 3.10)

# Define project name and set C++ standard
project(MortgageCalculator)
set(CMAKE_CXX_STANDARD 17)

# Set vcpkg toolchain file (should be set before find_package)
set(CMAKE_TOOLCHAIN_FILE "C:/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")

# Find and include SQLite3
find_package(SQLite3 REQUIRED)
include_directories(${SQLite3_INCLUDE_DIRS})

# Include custom project headers
include_directories(${CMAKE_SOURCE_DIR}/include)


set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

# Define the executable
add_executable(server src/main.cpp)

# Link SQLite3 library
target_link_libraries(server PRIVATE SQLite::SQLite3)