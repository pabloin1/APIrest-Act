const { Router } = require("express");
const { validarJwt } = require("../middlewares/validar-jwt");
const {
  obtenerEntidad,
  crearEntidad,
  actualizarEntidad,
  eliminarEntidad,
  obtenerAlumnoPorId,
  contarAlumnosConectados,
} = require("../controllers/alumno.controller.js");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { existeMatricula, existeId } = require("../helpers/db-validator");
const Notificador = require("../Notificador/Notificador.js")
const routerAlumno = Router();
const notifyObject = new Notificador(routerAlumno);
//IMPORTANTE: validarCampos debe ir siempre al final del arreglo de middlewares

routerAlumno.get('/alumnosConectados',contarAlumnosConectados);

routerAlumno.get("/", [ validarCampos], obtenerEntidad);

routerAlumno.get(
  "/:id",
  [
    check("id").custom(existeId),
    check("id", "No es un ID válido").isMongoId(),
    validarJwt,
    validarCampos,
  ],
  obtenerAlumnoPorId
);



routerAlumno.post(
  "/",
  [check("matricula").custom(existeMatricula), validarCampos],
  crearEntidad
);

routerAlumno.patch(
  "/:id",
  [
    check("matricula").custom(existeMatricula),
    check("id").custom(existeId),
    check("id", "No es un ID válido").isMongoId(),
    validarJwt,
    validarCampos,
  ],
  actualizarEntidad
);

routerAlumno.put(
  "/:id",
  [
    check("matricula").custom(existeMatricula),
    check("id").custom(existeId),
    check("id", "No es un ID válido").isMongoId(),
    validarJwt,
    validarCampos,
  ],
  actualizarEntidad
);
function deleteWithNotify(notificador){
  return async function(req, res) {
    req.notificador = notificador;
    console.log("si jalo")
    await eliminarEntidad(req,res,notificador);

  }
}
routerAlumno.delete(
  "/:id",
  [
    check("id").custom(existeId),
    check("id", "No es un ID válido").isMongoId(),
    validarJwt,
    validarCampos,
  ],
   deleteWithNotify(notifyObject)
);
module.exports = routerAlumno;
