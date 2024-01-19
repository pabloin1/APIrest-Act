const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos.js");
const { iniciarSesion } = require("../controllers/auth.controller.js");
const routerAuth = Router();


routerAuth.post("/login", [check("matricula").exists(), check("password").exists(), validarCampos], iniciarSesion );

module.exports = routerAuth;