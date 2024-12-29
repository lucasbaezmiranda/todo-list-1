import React from 'react';

const TaskList = ({ todos, toggleCompletion }) => {
    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                    {todo.title} - {todo.completed ? "Completed" : "Pending"}
                    <button onClick={() => toggleCompletion(todo.id)}>
                        {todo.completed ? "Mark as Pending" : "Mark as Completed"}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
