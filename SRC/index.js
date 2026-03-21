console.log(__dirname);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const librosRoutes = require('./routes/crud');
const autoresRoutes = require('./routes/autores');
const usuariosRoutes = require('./routes/usuarios');

app.use("/api/libros", librosRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
    res.send('API de librería funcionando');
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});