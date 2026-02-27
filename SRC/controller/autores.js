const pool = require('../models/connection');

// GET - Obtener todos los autores
function obtenerAutores(req, res) {
    try {
        const query = "SELECT * FROM autores";

        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error en el servidor");
            }
            res.json(result.rows);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// GET - Obtener autor por ID
function obtenerAutorPorId(req, res) {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM autores WHERE id_autor = $1";

        pool.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error en el servidor");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Autor no encontrado" });
            }

            res.json(result.rows[0]);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// POST - Insertar autor
function insertarAutor(req, res) {
    try {
        const { nombre, apellido, edad } = req.body;

        const query = `
            INSERT INTO autores (nombre, apellido, edad)
            VALUES ($1,$2,$3)
            RETURNING *
        `;

        pool.query(query, [nombre, apellido, edad], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al insertar");
            }

            res.json({
                mensaje: "Autor insertado correctamente",
                autor: result.rows[0]
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// PUT - Actualizar completamente
function actualizarAutor(req, res) {
    try {
        const id = req.params.id;
        const { nombre, apellido, edad } = req.body;

        const query = `
            UPDATE autores
            SET nombre=$1, apellido=$2, edad=$3
            WHERE id_autor=$4
            RETURNING *
        `;

        pool.query(query, [nombre, apellido, edad, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al actualizar");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Autor no encontrado" });
            }

            res.json({
                mensaje: "Autor actualizado completamente",
                autor: result.rows[0]
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// PATCH - Actualizar solo edad
function actualizarParcialAutor(req, res) {
    try {
        const id = req.params.id;
        const { edad } = req.body;

        const query = `
            UPDATE autores
            SET edad=$1
            WHERE id_autor=$2
            RETURNING *
        `;

        pool.query(query, [edad, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al actualizar parcialmente");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Autor no encontrado" });
            }

            res.json({
                mensaje: "Autor actualizado parcialmente",
                autor: result.rows[0]
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// DELETE - Eliminar autor
function eliminarAutor(req, res) {
    try {
        const id = req.params.id;
        const query = "DELETE FROM autores WHERE id_autor=$1 RETURNING *";

        pool.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al eliminar");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Autor no encontrado" });
            }

            res.json({ mensaje: "Autor eliminado correctamente" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
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