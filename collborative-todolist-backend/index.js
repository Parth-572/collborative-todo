import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/error-handler.js";
import taskRouter from "./routes/taskRoute.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Task id for the locking mechanism
let taskLocks = {};

// Middlewares
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Routes
app.use("/api/tasks", taskRouter);

app.get("/api", (req, res) => {
  return res.json({ message: "Server connection is healthy!" });
});

// Socket connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("task:lock", ({ taskId }) => {
    if (!taskLocks[taskId]) {
      taskLocks[taskId] = socket.id;
      io.emit("task:lock", { taskId, locked: true });
    }
  });

  socket.on("task:unlock", ({ taskId }) => {
    if (taskLocks[taskId] === socket.id) {
      delete taskLocks[taskId];
      io.emit("task:unlock", { taskId, locked: false });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Clean up locks held by the disconnected client
    for (const [taskId, clientId] of Object.entries(taskLocks)) {
      if (clientId === socket.id) {
        delete taskLocks[taskId];
        io.emit("task:unlock", { taskId, locked: false });
      }
    }
  });
});


// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
