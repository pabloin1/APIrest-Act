const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Alumno = require("../models/alumno");
const { generarJWT } = require("../helpers/jwt");

const iniciarSesion = async (req, res) => {
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
    const token = await generarJWT(alumno.id)


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


module.exports={
    iniciarSesion
}
