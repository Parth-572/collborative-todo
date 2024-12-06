import React, { useEffect, useState } from "react";
import API from "./services/api";
import socket from "./services/socket";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Listen for WebSocket updates
    socket.on("tasks:updated", fetchTasks);

    // Handle WebSocket connection errors (optional)
    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    return () => {
      socket.off("tasks:updated");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Collaborative To-Do List
        </h1>
        <TaskForm onTaskAdded={fetchTasks} />
        <TaskList tasks={tasks} fetchTasks={fetchTasks} />
      </div>
    </div>
  );
};

export default App;
