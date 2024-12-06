import React, { useState } from "react";
import API from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Task title is required");
      return;
    }

    try {
      const newTask = { title, completed: false };
      await API.post("/tasks/add-task", newTask);

      onTaskAdded();
      setTitle("");
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Add a New Task
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="mb-5">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-600 mb-2"
        >
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your task here..."
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
          title
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!title}
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
