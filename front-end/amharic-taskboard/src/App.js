import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]); // List of tasks
  const [newTask, setNewTask] = useState(""); // New task input
  const [isListening, setIsListening] = useState(false); // Voice recognition state

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post("http://localhost:3000/tasks", {
        task: newTask,
      });
      setTasks([...tasks, response.data]);
      setNewTask(""); // Clear input field
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewTask(transcript);
      setIsListening(false);
    };

    recognition.onerror = (error) => {
      console.error("Voice recognition error:", error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Amharic Taskboard</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="የእርስዎን ተግባር ያስገቡ"
          style={{ padding: "10px", fontSize: "16px", width: "300px" }}
        />
        <button onClick={addTask} style={{ marginLeft: "10px", padding: "10px" }}>
          Add Task
        </button>
        <button
          onClick={handleVoiceInput}
          style={{
            marginLeft: "10px",
            padding: "10px",
            backgroundColor: isListening ? "red" : "green",
            color: "white",
          }}
        >
          🎤 {isListening ? "Listening..." : "Speak"}
        </button>
      </div>
      <ul style={{ marginTop: "20px" }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: "10px 0", fontSize: "18px" }}>
            {task.task}
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
