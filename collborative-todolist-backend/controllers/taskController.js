import Task from "../models/taskmodel.js";

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

// Add a new task
export const addTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    req.io.emit("tasks:updated"); // Notify all clients about the new task
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
};

// Update a task with version control
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update task
    task.title = title;
    task.completed = completed;
    await task.save();

    req.io.emit("tasks:updated", task); // Notify all clients
    req.io.emit("task:unlock", { taskId: id }); // Emit unlock event
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    req.io.emit("tasks:updated"); // Notify all clients about the deletion
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
};
