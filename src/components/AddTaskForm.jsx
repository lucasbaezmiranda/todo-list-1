import { useState } from 'react';
import axios from 'axios';

function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    axios.post('http://todo-list-env.eba-ny4hgubn.us-west-2.elasticbeanstalk.com/todos/', { title })
      .then(response => {
        onTaskAdded(response.data);
        setTitle('');
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default AddTaskForm;
