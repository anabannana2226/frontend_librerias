console.log(__dirname);

const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const librosRoutes = require('./SRC/routes/crud');
const autoresRoutes = require('./SRC/routes/autores');

app.use("/api/libros", librosRoutes);
app.use('/api/autores', autoresRoutes);

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});