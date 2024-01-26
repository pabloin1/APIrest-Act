const Administrador = require("../models/administrador");
// Controlador para crear un nuevo administrador
exports.createAdministrador = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const newAdministrador = new Administrador({
      correo,
      password,
    });

    await newAdministrador.save();

    res.status(201).json({ message: "Administrador creado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};