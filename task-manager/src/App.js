import { useEffect, useState } from "react";
import API from "./api";
import Login from "./Login";
import Register from "./Register";
import "./styles.css";

export default function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLogged) fetchTasks();
  }, [isLogged]);

  const addTask = async () => {
    if (!title) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    setIsLogged(false);
  };

  if (!isLogged) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={() => setIsLogged(true)} onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="container">
      <h2>Task Manager</h2>
      <button onClick={logout}>Logout</button>
      <input placeholder="Enter task..." value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={addTask}>Add Task</button>

      {tasks.map((task) => (
        <div key={task.id} className="task">
          {task.title}
          <button onClick={() => deleteTask(task.id)}>❌</button>
        </div>
      ))}
    </div>
  );
}
