'use strict'

const express = require('express');
// Cargar el controlador
const ProjectController = require('../controllers/project');
// Cargar express router
const router = express.Router();

// Configurar un middleware para subir archivos(Se ejecuta antes que la accion del controlador)
const multipart = require('connect-multiparty');
// Directorio donde se va a guardar los archivos
const multipartMiddleware = multipart({uploadDir: './uploads'});



router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.get('/project/:id?', ProjectController.getProject); // id opcional con el signo de ?
router.get('/projects', ProjectController.getProjects);
router.put('/project/:id', ProjectController.updateProjects);
router.delete('/project/:id', ProjectController.deleteProject);
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage); // aplicando el middleware para archivos
router.get('/get-image/:image', ProjectController.getImageFile);

module.exports = router;
  