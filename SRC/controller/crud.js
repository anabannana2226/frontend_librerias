const pool = require('..//models/connection');

function obtenerLibros(req, res) {
    try {
        const query = "SELECT * FROM libros";

        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error en el servidor :(");
            }
            res.json(result.rows);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// GET - Obtener libro por ID
function obtenerLibroPorId(req, res) {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM libros WHERE id_libro = $1";

        pool.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error en el servidor");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            res.json(result.rows[0]);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// POST - Insertar libro
function insertarLibro(req, res) {
    try {
        const { isbn, titulo, autor, precio, duracion_minutos } = req.body;

        const query = `
            INSERT INTO libros (isbn, titulo, autor, precio, duracion_minutos)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `;

        pool.query(query, [isbn, titulo, autor, precio, duracion_minutos], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al insertar");
            }

            res.json({
                mensaje: "Libro insertado correctamente",
                libro: result.rows[0]
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// PUT - Actualizar completamente
function actualizarLibro(req, res) {
    try {
        const id = req.params.id;
        const { isbn, titulo, autor, precio, duracion_minutos } = req.body;

        const query = `
            UPDATE libros
            SET isbn=$1, titulo=$2, autor=$3, precio=$4, duracion_minutos=$5
            WHERE id_libro=$6
            RETURNING *
        `;

        pool.query(query, [isbn, titulo, autor, precio, duracion_minutos, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al actualizar");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            res.json({
                mensaje: "Libro actualizado completamente",
                libro: result.rows[0]
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// PATCH - Actualizar solo precio
function actualizarParcialLibro(req, res) {
    try {
        const id = req.params.id;
        const { precio } = req.body;

        const query = `
            UPDATE libros
            SET precio=$1
            WHERE id_libro=$2
            RETURNING *
        `;

        pool.query(query, [precio, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al actualizar parcialmente");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            res.json({
                mensaje: "Libro actualizado parcialmente",
                libro: result.rows[0]
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

// DELETE - Eliminar
function eliminarLibro(req, res) {
    try {
        const id = req.params.id;
        const query = "DELETE FROM libros WHERE id_libro=$1 RETURNING *";

        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al eliminar");
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            res.json({ mensaje: "Libro eliminado correctamente" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
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
