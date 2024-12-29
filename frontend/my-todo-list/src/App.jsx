import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    const API_URL = "http://127.0.0.1:8000/todos";

    // Cargar las tareas desde el backend
    const fetchTodos = async () => {
        try {
            const response = await axios.get(API_URL);
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    // Añadir una nueva tarea
    const addTodo = async () => {
        if (!newTodo.trim()) return; // Evitar tareas vacías
        const todo = { id: Date.now(), title: newTodo, completed: false };
        try {
            await axios.post(API_URL, todo);
            setNewTodo("");
            fetchTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Cambiar el estado de completado
    const toggleTodo = async (todo) => {
        const updatedTodo = { ...todo, completed: !todo.completed };
        try {
            await axios.put(`${API_URL}/${todo.id}`, updatedTodo);
            fetchTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    // Eliminar una tarea
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTodos();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    // Cargar las tareas al inicio
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Todo List</h1>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                    style={{ padding: "10px", marginRight: "10px" }}
                />
                <button onClick={addTodo} style={{ padding: "10px" }}>
                    Add
                </button>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <span
                            onClick={() => toggleTodo(todo)}
                            style={{
                                textDecoration: todo.completed
                                    ? "line-through"
                                    : "none",
                                cursor: "pointer",
                                flex: 1,
                            }}
                        >
                            {todo.title}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{
                                padding: "5px 10px",
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

