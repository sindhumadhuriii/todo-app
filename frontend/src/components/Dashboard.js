import React, { useState, useEffect } from "react";
import "../styles/dashboard.css"; // Importing the CSS file

const BACKEND_URL = "https://backend-db1s0i4on-sindhu-madhuris-projects.vercel.app"; 

const Dashboard = () => {
  const [inputData, setInputData] = useState(""); // User input for new task
  const [tasks, setTasks] = useState([]); // Task list

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/getTasks`);
        const result = await response.json();
        setTasks(result.tasks); // Assuming the backend sends a list of tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
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
        const response = await fetch(`${BACKEND_URL}/api/storeTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: newTask }),
        });

        const result = await response.json();
        if (result.success) {
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

  const handleCheck = async (taskId) => {
    // Toggle the completion status of the task
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Send the updated task completion status to the backend
    const taskToUpdate = updatedTasks.find(task => task.id === taskId);
    try {
      const response = await fetch(`${BACKEND_URL}/api/updateTask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskToUpdate }),
      });

      const result = await response.json();
      if (!result.success) {
        console.error("Failed to update task status in the backend");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
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
