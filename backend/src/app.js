import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* Ruta base */
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

/* Obtener todas las tareas */
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo tareas" });
  }
});

/* Crear una tarea */
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;

    // ✅ Validación
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const result = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea" });
  }
});

/* Marcar tarea como completada */
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const result = await pool.query(
      "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
      [title, completed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando tarea" });
  }
});

/* Eliminar tarea */
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    // ✅ Verificar si existe
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando tarea" });
  }
});

/* Puerto */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});