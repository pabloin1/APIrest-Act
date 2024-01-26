const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Alumno = require("../models/alumno");
const Administrador = require('../models/administrador')
const { generarJWT } = require("../helpers/jwt");

const iniciarSesionAdministrador = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const administrador = await Administrador.findOne({ correo });

    if (!administrador) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    const contrasenaValida = await bcrypt.compare(
      password,
      administrador.password
    );

    if (!contrasenaValida) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    // Generar token
    const token = await generarJWT(administrador.id);

    res.status(200).json({
      msg: "Inicio de sesión exitoso",
      administrador,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al iniciar sesión",
    });
  }
};
const iniciarSesionAlumno = async (req, res) => {
  const { matricula, password } = req.body;

  try {
    const alumno = await Alumno.findOne({ matricula });

    if (!alumno) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    const contrasenaValida = await bcrypt.compare(password, alumno.password);

    if (!contrasenaValida) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    // Generar token
    const token = await generarJWT(alumno.id);

    res.status(200).json({
      msg: "Inicio de sesión exitoso",
      alumno,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al iniciar sesión",
    });
  }
};

module.exports = {
  iniciarSesionAlumno,
  iniciarSesionAdministrador,
};
