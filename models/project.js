'use strict'

// Cargar modulos
const mongoose = require('mongoose');
// Cargar objeto Schema para definir el esquema de un modelo
const Schema = mongoose.Schema;

// Crear esquema del modelo Project
const ProjectSchema = Schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    langs:String,
    image:String
});

// Exportar modulo
// model toma el Schema y utilizarlo como un modelo
module.exports = mongoose.model('Project', ProjectSchema);

// Project --> Es una entidad o coleccion que guarda los documentos en la coleccion como projects, se convierte en minusculas y plural
// En la BD se encuentra como portafolio->projects