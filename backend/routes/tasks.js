const express = require("express");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/tasks.json");

// Helper functions
function readTasks() {
  if (!fs.existsSync(filePath)) return {};
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : {};
}
function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Get all tasks
router.get("/", auth, (req, res) => {
  const all = readTasks();
  const userTasks = Object.values(all).filter(t => t.userId === req.user.id);
  res.json(userTasks);
});

// Create task
router.post("/", auth, (req, res) => {
  const tasks = readTasks();
  const id = Date.now().toString();
  const newTask = { id, userId: req.user.id, title: req.body.title, completed: false };
  tasks[id] = newTask;
  writeTasks(tasks);
  res.json(newTask);
});

// Update task
router.put("/:id", auth, (req, res) => {
  const tasks = readTasks();
  const { id } = req.params;
  if (!tasks[id]) return res.status(404).json({ message: "Task not found" });
  if (tasks[id].userId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

  tasks[id] = { ...tasks[id], ...req.body };
  writeTasks(tasks);
  res.json(tasks[id]);
});

// Delete task
router.delete("/:id", auth, (req, res) => {
  const tasks = readTasks();
  const { id } = req.params;
  if (!tasks[id]) return res.status(404).json({ message: "Task not found" });
  if (tasks[id].userId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

  delete tasks[id];
  writeTasks(tasks);
  res.json({ message: "Task deleted" });
});

module.exports = router;
