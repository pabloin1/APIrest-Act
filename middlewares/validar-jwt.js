const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Alumno = require("../models/alumno");

const validarJwt = async(req = request, res = response, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      msg: "no hay token",
    });
  }

  try {
    const {id} =jwt.verify(token, process.env.SECRET_KEY);

    const alumnoAuth = await Alumno.findById(id)

    if (!alumnoAuth) {
      return res.json({msg:"el usuario no existe en DB"})
    }

    req.alumno = alumnoAuth;
   
    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      msg: "token no valido",
    });
  }
};

module.exports = {
  validarJwt,
};
