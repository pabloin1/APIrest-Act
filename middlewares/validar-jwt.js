const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Administrador = require("../models/administrador");

const validarJwt = async (req = request, res = response, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    const administradorAuth = await Administrador.findById(id);

    if (!administradorAuth) {
      return res.json({ msg: "Rol invalido" });
    }

    req.administrador = administradorAuth;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJwt,
};
