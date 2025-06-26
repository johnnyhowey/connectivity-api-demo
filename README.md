# Connectivity API Demo (React + Node.js)

This is a simple web application to demonstrate a React frontend UI communicating with a Node.js backend REST API.

## Project Structure

- `backend/`: Contains the Node.js Express backend.
  - `server.js`: The main Express application file.
  - `package.json`: Node.js dependencies.
- `frontend/`: Contains the React frontend application.

## How to Run

### 1. Run the Backend Server

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
npm install
npm start
```
The backend will be running at `http://localhost:5001`.

### 2. Run the Frontend Development Server

Open a second terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm start
```
The frontend development server will open at `http://localhost:3000`. The app will automatically open in your browser.

Now, click the "Get Message from API" button to see the communication between the frontend and backend.
