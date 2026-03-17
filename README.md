Installation & Setup Guide
This section describes the steps required to set up and run the Inventory Management System locally.
The application consists of three main components:
• SQL Server Database
• .NET 8 Web API Backend
• React Frontend (Vite)

1. Database Setup (SQL Server)
Step 1 — Install SQL Server
Ensure that Microsoft SQL Server and SQL Server Management Studio (SSMS) are installed.
Step 2 — Create Database
Create a new database named:
InventoryDB
Step 3 — Run Database Schema Scripts
Execute the SQL scripts provided in the Database Schema section of this document to create all required tables.
Step 4 — Insert Seed Data
Insert initial records such as:
• Default Admin User
• Sample Inventory Items
• Initial Stock Data (optional)
This allows quick testing of the system.

2. Backend Setup (.NET 8 Web API)
Step 1 — Navigate to Backend Folder
Open terminal in the backend project directory.
cd InventoryManagement.API
Step 2 — Restore Dependencies
dotnet restore
Step 3 — Build the Application
dotnet build
Step 4 — Run the API Server
dotnet run
Once the server starts, the API will be available at:
http://localhost:5000
Swagger documentation can be accessed at:
http://localhost:5000/swagger
Swagger provides an interactive interface for testing API endpoints.

3. Frontend Setup (React + Vite)
The frontend application is built using React with Vite.
Step 1 — Navigate to Frontend Folder
cd inventory-frontend
Step 2 — Install Dependencies
npm install
Step 3 — Start Development Server
npm run dev
The frontend application will be available at:
http://localhost:5173
The React application communicates with the backend APIs to perform inventory operations.

4. Application Startup Flow
To run the full system:
1️⃣ Start SQL Server and ensure the database is created
2️⃣ Run the backend API using dotnet run
3️⃣ Start the React frontend using npm run dev
4️⃣ Open the frontend URL in the browser
The frontend will communicate with the backend API to fetch and update inventory data.
