# Real-Time Collaborative To-Do List

A real-time collaborative to-do list application that allows users to add, edit, and delete tasks with WebSocket-powered synchronization for seamless multi-user interaction.

---

## Installation and Setup

Follow these steps to set up the project locally:

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (You can use a local MongoDB instance or MongoDB Atlas)
- [Git](https://git-scm.com/)

### Clone the Repository
First, clone the repository to your local machine:

```bash
git clone https://github.com/Parth-572/collborative-todo.git
```

# Backend Setup
## Navigate to the backend folder:
```bash
cd collborative-todolist-backend
```
##Install dependencies:
```bash
npm install
```
## Set up environment variables:
Create a .env file in the backend directory and add the following variables:
```bash
MONGO_URI=mongodb+srv://your-mongo-db-uri
PORT=8000
```
## Replace your-mongo-db-uri with your MongoDB connection string. If you're using MongoDB Atlas, you can get this string from your Atlas dashboard.
##Start the backend server:
```bash
npm start
```
Your backend will now be running at http://localhost:5000

## Frontend Setup
Navigate to the frontend folder:
```bash
cd ../collaborative-todo-list
```
##Install dependencies:
```bash
npm install
```
## Start the frontend development server:
```bash
npm run dev
```



