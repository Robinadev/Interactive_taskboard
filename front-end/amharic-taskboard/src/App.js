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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f8ff",
        color: "#333",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Amharic Taskboard</h1>
      <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="የእርስዎን ተግባር ያስገቡ"
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <div>
          <button
            onClick={addTask}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "white",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Add Task
          </button>
          <button
            onClick={handleVoiceInput}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: isListening ? "#f44336" : "#2196f3",
              color: "white",
              cursor: "pointer",
            }}
          >
            🎤 {isListening ? "Listening..." : "Speak"}
          </button>
        </div>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 15px",
              margin: "10px 0",
              backgroundColor: "#ffffff",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span>{task.task}</span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                padding: "5px 10px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#f44336",
                color: "white",
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