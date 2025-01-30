import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "../styles/dashboard.css"; // Importing the CSS file

const BACKEND_URL = "http://localhost:5000";

// Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyD8mqwXJEwbb9Bwncuh54fauz4iSK1D6X0",
  authDomain: "login-authentication-4106f.firebaseapp.com",
  projectId: "login-authentication-4106f",
  storageBucket: "login-authentication-4106f.firebasestorage.app",
  messagingSenderId: "248719151816",
  appId: "1:248719151816:web:86155051c320203d50cbfd",
  measurementId: "G-R72RFWYYLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to get the Firebase token
const getTokenFromLocalStorage = async () => {
  const user = auth.currentUser; // Get the currently authenticated user
  if (user) {
    const idToken = await user.getIdToken(); // Get Firebase ID Token
    return idToken; // Return the token
  } else {
    throw new Error('User is not logged in');
  }
};

const Dashboard = () => {
  const [inputData, setInputData] = useState(""); // User input for new task
  const [tasks, setTasks] = useState([]); // Task list

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await getTokenFromLocalStorage(); // Get token here
        const response = await fetch(`${BACKEND_URL}/api/getData`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach token to Authorization header
          },
        });
        const result = await response.json();
        setTasks(result.data); // Assuming the response has `data`
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputData) {
      // Add the new task to the list locally first
      const newTask = { text: inputData, id: Date.now(), completed: false };
      setTasks([...tasks, newTask]);
      setInputData(""); // Clear the input field

      // Send the new task to the backend
      try {
        const token = await getTokenFromLocalStorage(); // Get token here
        const response = await fetch(`${BACKEND_URL}/api/storeData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach token to Authorization header
          },
          body: JSON.stringify({ data: newTask }),
        });

        const result = await response.json();
        if (result.message === "Data stored successfully") {
          console.log("Task stored successfully in the backend");
        } else {
          console.error("Failed to store task in the backend");
        }
      } catch (error) {
        console.error("Error storing task:", error);
      }
    } else {
      alert("Please enter a task.");
    }
  };

  // Handle checkbox change
  const handleCheck = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to the To-Do Dashboard!</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Enter a task"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="task-button">Add Task</button>
      </form>

      <h3>Task List</h3>
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheck(task.id)}
              className="task-checkbox"
            />
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
