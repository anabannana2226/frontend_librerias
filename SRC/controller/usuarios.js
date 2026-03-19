const pool = require('../models/connection');
const bcrypt = require('bcryptjs');

// POST - Registro de usuario
async function registrarUsuario(req, res) {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Verificar si el usuario ya existe
        const userCheck = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario
        const query = `
            INSERT INTO usuarios (nombre, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, email, fecha_creacion
        `;

        const result = await pool.query(query, [nombre, email, hashedPassword]);

        res.status(201).json({
            mensaje: "Usuario registrado con éxito",
            usuario: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error en el servidor al registrar usuario" });
    }
}

// POST - Login de usuario
async function loginUsuario(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });
        }

        // Buscar usuario
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        const usuario = result.rows[0];

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        res.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario
};
