'use strict'

// Importar el modulo de mongoose
const mongoose = require('mongoose');
const app = require('./app');
const port = 3700;

// Conexion a la DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
        .then(() => {
            console.log('Conexion a la base de datos establecida');

            // Creacion del servidor
            app.listen(port, () => {
                console.log("Servidor corriendo en la url: localhost:3700");
            });

        })
        .catch(err => console.log(err));