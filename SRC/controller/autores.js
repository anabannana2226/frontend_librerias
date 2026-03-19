const pool = require('../models/connection');

// GET - Obtener todos los autores
async function obtenerAutores(req, res) {
    try {
        const query = "SELECT * FROM autores";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// GET - Obtener autor por ID
async function obtenerAutorPorId(req, res) {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM autores WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Autor no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// POST - Insertar autor
async function insertarAutor(req, res) {
    try {
        const { nombre, apellido, nacionalidad, biografia, fecha_nacimiento } = req.body;
        const query = `
            INSERT INTO autores (nombre, apellido, nacionalidad, biografia, fecha_nacimiento)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `;
        const result = await pool.query(query, [nombre, apellido, nacionalidad, biografia, fecha_nacimiento]);

        res.json({
            mensaje: "Autor insertado correctamente",
            autor: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar");
    }
}

// PUT - Actualizar completamente
async function actualizarAutor(req, res) {
    try {
        const id = req.params.id;
        const { nombre, apellido, nacionalidad, biografia, fecha_nacimiento } = req.body;
        const query = `
            UPDATE autores
            SET nombre=$1, apellido=$2, nacionalidad=$3, biografia=$4, fecha_nacimiento=$5
            WHERE id=$6
            RETURNING *
        `;
        const result = await pool.query(query, [nombre, apellido, nacionalidad, biografia, fecha_nacimiento, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Autor no encontrado" });
        }

        res.json({
            mensaje: "Autor actualizado completamente",
            autor: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar");
    }
}

// PATCH - Actualizar solo nacionalidad
async function actualizarParcialAutor(req, res) {
    try {
        const id = req.params.id;
        const { nacionalidad } = req.body;
        const query = `
            UPDATE autores
            SET nacionalidad=$1
            WHERE id=$2
            RETURNING *
        `;
        const result = await pool.query(query, [nacionalidad, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Autor no encontrado" });
        }

        res.json({
            mensaje: "Autor actualizado parcialmente",
            autor: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar");
    }
}

// DELETE - Eliminar autor
async function eliminarAutor(req, res) {
    try {
        const id = req.params.id;
        const query = "DELETE FROM autores WHERE id=$1 RETURNING *";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Autor no encontrado" });
        }

        res.json({ mensaje: "Autor eliminado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar");
    }
}

module.exports = {
    obtenerAutores,
    obtenerAutorPorId,
    insertarAutor,
    actualizarAutor,
    actualizarParcialAutor,
    eliminarAutor
};