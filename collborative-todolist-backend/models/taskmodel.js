import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  version: { type: Number, default: 1 }, // Task version for concurrency control
  updatedAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
