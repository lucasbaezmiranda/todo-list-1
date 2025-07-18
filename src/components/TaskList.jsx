import { useEffect, useState } from 'react';
import axios from 'axios';
import AddTaskForm from './AddTaskForm';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    axios.get(`${BASE_URL}/todos/`)
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTaskDone = (id, done) => {
    axios.patch(`${BASE_URL}/todos/${id}`, { done: !done })
      .then(response => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === id ? response.data : task
          )
        );
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`${BASE_URL}/todos/${id}`)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h2>Lista de Tareas</h2>
      <AddTaskForm onTaskAdded={handleTaskAdded} />
      <ul>
        {tasks.length === 0 && <li>No hay tareas.</li>}
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} {task.done ? "(hecha)" : "(pendiente)"}{" "}
            <button onClick={() => toggleTaskDone(task.id, task.done)}>
              Marcar como {task.done ? "pendiente" : "hecha"}
            </button>{" "}
            <button onClick={() => deleteTask(task.id)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
