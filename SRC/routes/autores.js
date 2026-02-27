const express = require('express');
const router = express.Router();

const funciones = require('../controller/autores.js');

// GET todos
router.get("/", funciones.obtenerAutores);

// GET por ID
router.get("/:id", funciones.obtenerAutorPorId);

// POST
router.post("/", funciones.insertarAutor);

// PUT
router.put("/:id", funciones.actualizarAutor);

// PATCH
router.patch("/:id", funciones.actualizarParcialAutor);

// DELETE
router.delete("/:id", funciones.eliminarAutor);

module.exports = router;