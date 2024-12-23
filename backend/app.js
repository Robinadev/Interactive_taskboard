const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON

// Sample tasks in Amharic
let tasks = [
    { id: 1, task: "ምሳ ማብሰል" },
    { id: 2, task: "መጽሃፍ ማንበብ" }
];

// Get all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const newTask = req.body.task; // Get task from request body
    if (!newTask) {
        return res.status(400).json({ error: "Task is required" });
    }
    const task = {
        id: tasks.length + 1,
        task: newTask
    };
    tasks.push(task); // Add to tasks array
    res.status(201).json(task); // Return the new task
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body.task;
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    if (!updatedTask) {
        return res.status(400).json({ error: "Updated task is required" });
    }

    task.task = updatedTask; // Update task content
    res.status(200).json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1); // Remove task from array
    res.status(204).send(); // No content response
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Amharic Task API is running on http://localhost:${PORT}`);
});
