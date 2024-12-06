import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", getTasks);
taskRouter.post("/add-task", addTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
