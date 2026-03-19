const express = require('express');
const router = express.Router();
const controller = require('../controller/usuarios');

// POST - Registro de usuario
router.post('/registro', controller.registrarUsuario);

// POST - Login de usuario (añadiéndolo para cuando lo necesite)
router.post('/login', controller.loginUsuario);

module.exports = router;
