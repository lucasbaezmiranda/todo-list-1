import React, { useEffect, useState } from 'react';
import TaskList from './TaskList'; // Importamos el componente TaskList

const App = () => {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);

    // Cargar las tareas desde el backend
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;

        fetch(`${apiUrl}/todos`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Tareas obtenidas:', data);
                setTodos(data); // Actualizamos el estado con las tareas obtenidas
            })
            .catch((err) => {
                console.error('Error fetching todos:', err);
                setError(err.message); // Mostramos el error si no se pudo obtener las tareas
            });
    }, []);

    // Función para alternar el estado de completado de las tareas
    const toggleCompletion = (id) => {
        const apiUrl = import.meta.env.VITE_API_URL;

        // Encuentra la tarea a modificar y alterna el estado de completado
        const updatedTodos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );

        setTodos(updatedTodos); // Actualizamos el estado en el frontend

        // Realiza la solicitud PUT al backend para actualizar el estado de la tarea
        fetch(`${apiUrl}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodos.find(todo => todo.id === id)),
        })
            .then(response => response.json())
            .then(data => console.log('Tarea actualizada:', data))
            .catch(error => console.error('Error al actualizar la tarea:', error));
    };

    // Si ocurre un error, mostramos un mensaje en lugar de la lista de tareas
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Todo List</h1>
            {/* Usamos el componente TaskList pasando las tareas y la función toggleCompletion */}
            <TaskList todos={todos} toggleCompletion={toggleCompletion} />
        </div>
    );
};

export default App;