import { useState, useEffect } from "react";
import socket from "../services/socket";
import API from "../services/api";

const TaskList = ({ tasks, fetchTasks }) => {
  const [lockedTasks, setLockedTasks] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    socket.on("task:lock", ({ taskId, locked }) => {
      setLockedTasks((prevLockedTasks) => ({
        ...prevLockedTasks,
        [taskId]: locked,
      }));
    });

    socket.on("task:unlock", ({ taskId }) => {
      setLockedTasks((prevLockedTasks) => {
        const updatedLocks = { ...prevLockedTasks };
        delete updatedLocks[taskId];
        return updatedLocks;
      });
    });

    return () => {
      socket.off("task:lock");
      socket.off("task:unlock");
    };
  }, []);
  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    if (lockedTasks[task._id]) {
      alert("This task is locked by another user.");
      return;
    }

    socket.emit("task:lock", { taskId: task._id });
    setEditingTaskId(task._id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}`, {
        title: editingTitle,
        completed: tasks.find((task) => task._id === taskId).completed,
      });

      fetchTasks();
      cancelEdit(taskId);
      socket.emit("task:unlock", { taskId });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Task update conflict. The task may be locked by another user.");
      } else {
        console.error("Error saving edited task:", error);
        alert("An error occurred while saving the task. Please try again.");
      }
    }
  };

  const cancelEdit = (taskId) => {
    setEditingTaskId(null);
    setEditingTitle("");
    socket.emit("task:unlock", { taskId });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Task List</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
          >
            {editingTaskId === task._id ? (
              <input
                type="text"
                className="w-full p-2 border rounded-md mr-4"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
              />
            ) : (
              <span
                className={`${
                  lockedTasks[task._id]
                    ? "text-gray-400 line-through"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => startEditing(task)}
                disabled={lockedTasks[task._id]}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  lockedTasks[task._id]
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {lockedTasks[task._id] ? "Locked" : "Edit"}
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              {editingTaskId === task._id && (
                <>
                  <button
                    onClick={() => saveEdit(task._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => cancelEdit(task._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
