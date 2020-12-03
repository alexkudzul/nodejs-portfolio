'use strict'

// Configuracion de express

// Cargar el modulo de express
const express = require('express');
const bodyParser = require('body-parser');

// Ejecutar express
const app = express();

// Cargar archivos de rutas
const project_routes = require('./routes/project');

// Middlewares, capa de metodo -> se ejecuta antes de llamar una accion del controlador
// Middleware global en app, para convertir cualquier dato que llegue por el metodo post a objeto json
app.use(bodyParser.urlencoded({extended: false}));// extends: false, es una configuracion de bodyParser
app.use(bodyParser.json());// Middleware, todo lo que llegue que lo convierta a json

// CORS, permite el accedo cruzado entre dominios, permite hacer peticiones Ajax con angular a un backend o una API REST

// Middleware configurar cabeceras y cors, siempre se ejecuta este codigo antes de cada peticion
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rutas
// Cargar la ruta en un middleware o sobre escribir las rutas
// http://localhost:3700/api/test
app.use('/api', project_routes);


// exportar 
module.exports = app;







/*
#### EJEMPLO DE RUTAS CON FUNCIONES DE CONTROLADOR  ######

// Funcion de callback recibe un request y un response
// Request es son los datos que se estara enviando desde el cliente o formularios

app.get('/', (req, res) => {
    // Un respuesta exitosa por parte del servidor
    // Enviar los datos como texto 
    res.status(200).send("<h1>Pagina de inicio</h1>");
});

// Response son las respuestas que se estaran enviando
app.get('/test', (req, res) => {
    // Un respuesta exitosa por parte del servidor
    // Enviar los datos como json
    res.status(200).send({
        message: "Hola desde mi API NodeJS"
    });
});
*/