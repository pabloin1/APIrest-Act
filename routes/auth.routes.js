const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos.js");
const { iniciarSesionAdministrador, iniciarSesionAlumno } = require("../controllers/auth.controller.js");
const routerAuth = Router();


routerAuth.post("/loginAl", [check("matricula").exists(), check("password").exists(), validarCampos], iniciarSesionAlumno );
routerAuth.post('/loginAd',iniciarSesionAdministrador)


module.exports = routerAuth;