const { Router } = require("express");
const {
  obtenerEntidad,
  crearEntidad,
  actualizarEntidad,
  eliminarEntidad,
  obtenerAlumnoPorId,
} = require("../controllers/alumno.controller.js");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos.js");
const { existeMatricula, existeId } = require("../helpers/db-validator.js");
const routerAlumno = Router();

//IMPORTANTE: validarCampos debe de ir siempre al final de la posicion del arreglo de middlewares

routerAlumno.get("/", obtenerEntidad);

routerAlumno.get(
  "/:id",
  [check("id").custom(existeId), check("id", "No es un id valido").isMongoId(),validarCampos],
  obtenerAlumnoPorId
);

routerAlumno.post(
  "/",
  [check("matricula").custom(existeMatricula), validarCampos],
  crearEntidad
);

routerAlumno.patch(
  "/alumnos/:id",
  [
    check("matricula").custom(existeMatricula),
    check("id").custom(existeId),
    check("id", "No es un id valido").isMongoId(),
    validarCampos,
  ],
  actualizarEntidad
);

routerAlumno.put(
  "/:id",
  [
    check("matricula").custom(existeMatricula),
    check("id").custom(existeId),
    check("id", "No es un id valido").isMongoId(),
    validarCampos,
  ],
  actualizarEntidad
);

routerAlumno.delete(
  "/:id",
  [check("id").custom(existeId), check("id", "No es un id valido").isMongoId(),validarCampos],
  eliminarEntidad
);

module.exports = routerAlumno;
