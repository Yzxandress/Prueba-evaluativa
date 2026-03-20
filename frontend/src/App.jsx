import { useEffect, useState } from "react";

const API = "http://localhost:3000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // 🔄 Obtener tareas
  const fetchTodos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ➕ Agregar tarea
  const addTodo = async () => {
    const title = prompt("Ingrese nueva tarea:");
    if (!title || !title.trim()) return;

    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      fetchTodos();
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  // ❌ Eliminar
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      fetchTodos();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // ✏️ Iniciar edición
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditCompleted(todo.completed);
  };

  // 💾 Guardar edición
  const saveEdit = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          completed: editCompleted,
        }),
      });

      setEditingId(null);
      fetchTodos();
    } catch (error) {
      console.error("Error editando:", error);
    }
  };

  // 🔍 Filtro
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TO DO LIST</h1>

      {/* 🔝 Barra superior */}
      <div style={styles.topBar}>
        <button style={styles.addBtn} onClick={addTodo}>
          Add Task
        </button>

        <select
          style={styles.select}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">ALL</option>
          <option value="pending">PENDING</option>
          <option value="completed">COMPLETED</option>
        </select>
      </div>

      {/* 📦 Contenedor */}
      <div style={styles.card}>
        {filteredTodos.length === 0 ? (
          <p style={styles.empty}>No To do Found</p>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} style={styles.todoItem}>
              {editingId === todo.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={styles.input}
                  />

                  <label>
                    <input
                      type="checkbox"
                      checked={editCompleted}
                      onChange={(e) =>
                        setEditCompleted(e.target.checked)
                      }
                    />
                    ✔
                  </label>

                  <button
                    onClick={() => saveEdit(todo.id)}
                    style={styles.saveBtn}
                  >
                    💾
                  </button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: todo.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {todo.title}
                  </span>

                  <div>
                    <button
                      onClick={() => startEdit(todo)}
                      style={styles.editBtn}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={styles.deleteBtn}
                    >
                      ❌
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* 🎨 ESTILOS */

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    fontFamily: "Arial",
    textAlign: "center",
  },
  title: {
    color: "#555",
    marginBottom: "20px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  addBtn: {
    backgroundColor: "#6C63FF",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  select: {
    padding: "5px",
    borderRadius: "5px",
  },
  card: {
    backgroundColor: "#eee",
    padding: "20px",
    borderRadius: "10px",
  },
  empty: {
    backgroundColor: "#ddd",
    padding: "5px 10px",
    display: "inline-block",
    borderRadius: "10px",
    color: "#555",
  },
  todoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    background: "#fff",
    padding: "10px",
    borderRadius: "5px",
  },
  editBtn: {
    marginRight: "5px",
  },
  deleteBtn: {},
  saveBtn: {
    marginLeft: "5px",
  },
  input: {
    marginRight: "10px",
  },
};

export default App;