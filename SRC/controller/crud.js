const pool = require('../models/connection');

// GET - Obtener libros con JOIN
async function obtenerLibros(req, res) {
    try {
        const query = `
            SELECT l.*, a.nombre as autor_nombre, a.apellido as autor_apellido 
            FROM libros l
            LEFT JOIN autores a ON l.autor_id = a.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor :(");
    }
}

// GET - Obtener libro por ID
async function obtenerLibroPorId(req, res) {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM libros WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// POST - Insertar libro
async function insertarLibro(req, res) {
    try {
        const { isbn, titulo, autor_id, precio, fecha_publicacion, genero, stock } = req.body;
        const query = `
            INSERT INTO libros (isbn, titulo, autor_id, precio, fecha_publicacion, genero, stock)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        `;
        const result = await pool.query(query, [isbn, titulo, autor_id, precio, fecha_publicacion, genero, stock]);
        
        res.json({
            mensaje: "Libro insertado correctamente",
            libro: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error al insertar libro", error: err.message });
    }
}

// PUT - Actualizar completamente
async function actualizarLibro(req, res) {
    try {
        const id = req.params.id;
        const { isbn, titulo, autor_id, precio, fecha_publicacion, genero, stock } = req.body;
        const query = `
            UPDATE libros
            SET isbn=$1, titulo=$2, autor_id=$3, precio=$4, fecha_publicacion=$5, genero=$6, stock=$7
            WHERE id=$8
            RETURNING *
        `;
        const result = await pool.query(query, [isbn, titulo, autor_id, precio, fecha_publicacion, genero, stock, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json({
            mensaje: "Libro actualizado completamente",
            libro: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error al actualizar libro", error: err.message });
    }
}

// PATCH - Actualizar solo precio
async function actualizarParcialLibro(req, res) {
    try {
        const id = req.params.id;
        const { precio } = req.body;
        const query = `
            UPDATE libros
            SET precio=$1
            WHERE id=$2
            RETURNING *
        `;
        const result = await pool.query(query, [precio, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json({
            mensaje: "Libro actualizado parcialmente",
            libro: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar");
    }
}

// DELETE - Eliminar
async function eliminarLibro(req, res) {
    try {
        const id = req.params.id;
        const query = "DELETE FROM libros WHERE id=$1 RETURNING *";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json({ mensaje: "Libro eliminado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar");
    }
}

module.exports = {
    obtenerLibros,
    obtenerLibroPorId,
    insertarLibro,
    actualizarLibro,
    actualizarParcialLibro,
    eliminarLibro
};
