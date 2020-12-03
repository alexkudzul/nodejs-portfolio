'use strict'

// Importar modelo
const Project = require('../models/project');
// Importar libreria fs o filesystem para elimnar un archivo con unlink
const fs = require('fs');
// Modulo de node que permite cargar rutas fisicas del sistema de archivos
const path = require('path');

const controller = {
    // Funcion anonima recibe un request y un response
    // Request es son los datos que se estara enviando desde el cliente o formularios
    // Response son las respuestas que se estaran enviando
    home: function(req, res){
        // Un respuesta exitosa por parte del servidor
        // Enviar los datos como json
        return res.status(200).send({
            message: "Vista Home"
        });
    },

    test: function(req, res){
        return res.status(200).send({
            message: "Vista Test"
        });
    },

    saveProject: function(req , res){
        // Instancia del objeto
        const project = new Project(); //asigna un id en el objeto
        // Recoge los parametros por medio del body de la peticion
        const params = req.body;

        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;
        
        // recibe dos parametros un error y un stored
        // projectStored es el objeto que sera guardado
        project.save((err, projectStored) => {
            // Si da algun error
            if(err) return res.status(500).send({message: 'Error al guardar el documento'});
            // Si no se guarda el projectStored, sino existe o da false
            if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto'});

            // Devuelve el projectStored dentro de una propiedad
            return res.status(200).send({project: projectStored});
        });

        /*
        hacer pruebas antes de utilizar el metodo save()
        return res.status(200).send({
            project: project, // imprime el objeto completo
            params: params, // imprime los valores de la peticion
            message: "Metodo saveProject"
        });
        */
    },

    getProject: function(req, res){
        // Recoge el parametro id por medio del url de la peticion de routes
        const projectId = req.params.id;

        // Condicion para verificar si tiene parametro id en la url (en routes esta como opcional)
        if(projectId == null) return res.status(404).send({message: 'El proyecto no existe'});

        // recibe 2 parametros. el id que se va a buscar y una funcion de callback y el objeto del documento que se ha sacado o se va a sacar
        Project.findById(projectId, (err, project) => {

            if(err) return res.status(500).send({message: 'Error al devolver los datos'});

            if(!project) return res.status(404).send({message: 'El proyecto no existe'});

            // Devuelve el projecto obtenido
            return res.status(200).send({
                project
            });
        });
    },

    getProjects: function(req, res){
        // find puede tener parametros que simula el where, ejemplo find({year: 2020})
        // sort('year') ordena por year antiguo a nuevo, con menos year (-year) de mayor a menor
        // exec, se ejecuta cuando ya alla sacado los resultados de find
        // err y projects(rray de todo los projectos)
        Project.find({}).sort('-year').exec((err, projects) => {
            if(err) return res.status(500).send({message: 'Error al devolver los datos'});

            if(!projects) return res.status(404).send({message: 'No hay projectos que mostrar'});

            return res.status(200).send({projects});
        });
    }, 

    updateProjects: function(req, res){

        const projectId = req.params.id; // Recoge los parametros por medio del url de la peticion
        const update = req.body; // Recoge los parametros por medio del body de la peticion

        // findByAndUpdate por defaul devuelve valores antiguos
        // new:true devuelve el objeto nuevo o el objeto actualizado
        Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdate) =>{

            if(err) return res.status(500).send({message: 'Error al actualizar'});

            if(!projectUpdate) return res.status(404).send({message: 'No existe el proyecto para actualizar'});

            return res.status(200).send({
                project : projectUpdate
            });
        } );
    },

    deleteProject: function(req, res){
        const projectId = req.params.id;

        Project.findByIdAndRemove(projectId, (err, projectRemoved) => {

            if(err) return res.status(500).send({message: 'No se ha podido borrar el proyecto'});

            if(!projectRemoved) return res.status(404).send({message: 'No se puede eliminar el proyecto, no existe'});

            return res.status(200).send({
                project: projectRemoved
            });
        });
    },

    uploadImage: function(req, res){

        const projectId = req.params.id; // recoge el id del projecto que se va a guardar el archivo en routes
        const fileName = 'Imagen no subida'; // Nombre del archivo por default

        /*  files, propiedad que genera el modulo connect-multiparty, genera un objeto con todo 
            los datos del archivo y se configura en las rutas para que inicie el if

            "files": {
                "image": {
                    "fieldName": "image",
                    "originalFilename": "img-post-1.png",
                    "path": "uploads\\QsiBs9iZRT0VnXO5r_LFQ9gO.png",
                    "headers": {
                        "content-disposition": "form-data; name=\"image\"; filename=\"img-post-1.png\"",
                        "content-type": "image/png"
                    },
                    "size": 884672,
                    "name": "img-post-1.png",
                    "type": "image/png"
                }
            },

            Si existe en la resquest un archivo, se ejecuta el bloque de codigo */
        if(req.files){
            const filePath = req.files.image.path; // obtiene la ruta
            const fileSplit = filePath.split('\\'); // obtiene el nombre original que se guardado en el Dir por medio de un recorte con split
            const fileName = fileSplit[1]; // obtiene el indice de fileSplit[1] ejemplo "uploads[0]\\[1]QsiBs9iZRT0VnXO5r_LFQ9gO.png"

            const extSplit = fileName.split('\.'); // obtiene la extencion del archivo medio de un recorte con split
            const fileExt = extSplit[1]; // obtiene el indice de fileSplit[1] ejemplo "QsiBs9iZRT0VnXO5r_LFQ9gO[0].png[1]"

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                // Se le pasa la propiedad {image:fileName} para que guarde el nombre del fichero
                // new:true devuelve el objeto nuevo o el objeto actualizado
                Project.findByIdAndUpdate(projectId, {image:fileName}, {new:true}, (err, projectUpdated) => {

                    if(err) return res.status(500).send({message: 'La imagen no se ha subido'});

                    if(!projectUpdated) return res.status(404).send({message: 'El proyecto no existe'});

                    return res.status(200).send({
                        files: req.files,
                        project: projectUpdated
                    });
                });
            }else{ 
                // si la extencion es diferente a una imagen, que se elimine
                // fs = filesystem libreria de nodejs para eliminar un archivo con unlink
                // se le pasa como parametro la ruta completa y un mensaje de error en caso de que suceda 
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({message: 'La extensión no es valida'});
                });
            }
        }else {
            return res.status(200).send({
                message: fileName
            });
        }
    },

    getImageFile: function(req, res){
        // recoge un parametro image, que se pasara por la url de routes
        const file = req.params.image;
        // ruta de la imagen y el nombre del archivo
        const path_file = './uploads/'+file;
        // fs libreria para devolver archivos, si el path_file existe se ejecuta la funcion
        fs.exists(path_file, (exists) => {
            // Si existe da true
            if(exists){
                // devolver el archivo, path es un objeto que se tiene que importar para cargar rutas fisicas del sistema de archivos
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({
                    message: "No existe la imagen"
                });
            }
        })
    }
};
 

module.exports = controller;

