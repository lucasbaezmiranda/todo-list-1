from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
from typing import List

app = FastAPI()

# Configuración para habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por el dominio específico en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_FILE = "todos.csv"

# Modelo de datos para las tareas
class Todo(BaseModel):
    id: int
    title: str
    completed: bool

# Función para leer el archivo CSV
def read_csv():
    todos = []
    try:
        with open(CSV_FILE, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                todos.append(
                    Todo(
                        id=int(row["id"]),
                        title=row["title"],
                        completed=row["completed"] == "true",
                    )
                )
    except FileNotFoundError:
        # Si el archivo no existe, lo creamos con un encabezado
        with open(CSV_FILE, mode="w", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=["id", "title", "completed"])
            writer.writeheader()
    return todos

# Función para escribir en el archivo CSV
def write_csv(todos: List[Todo]):
    with open(CSV_FILE, mode="w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["id", "title", "completed"])
        writer.writeheader()
        for todo in todos:
            writer.writerow(
                {"id": todo.id, "title": todo.title, "completed": str(todo.completed).lower()}
            )

# Rutas de la API
@app.get("/todos", response_model=List[Todo])
def get_todos():
    return read_csv()

@app.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    todos = read_csv()
    if any(t.id == todo.id for t in todos):
        raise HTTPException(status_code=400, detail="Todo with this ID already exists")
    todos.append(todo)
    write_csv(todos)
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated_todo: Todo):
    todos = read_csv()
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            todos[index] = updated_todo
            write_csv(todos)
            return updated_todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    todos = read_csv()
    todos = [todo for todo in todos if todo.id != todo_id]
    write_csv(todos)
    return {"message": "Todo deleted"}
