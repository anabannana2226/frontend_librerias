const express = require('express');
const router = express.Router();

const funciones = require('../controller/crud.js');

// GET todos
router.get("/", funciones.obtenerLibros);

// GET por ID
router.get("/:id", funciones.obtenerLibroPorId);

// POST
router.post("/", funciones.insertarLibro);

// PUT
router.put("/:id", funciones.actualizarLibro);

// PATCH
router.patch("/:id", funciones.actualizarParcialLibro);

// DELETE
router.delete("/:id", funciones.eliminarLibro);

module.exports = router;