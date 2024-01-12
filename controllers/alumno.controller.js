const Alumno = require("../models/alumno");

// Controlador para obtener todos los alumno con paginación y ordenamiento
const obtenerEntidad = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "asc";

    const skip = (page - 1) * perPage;

    const sortOption = { [sortBy]: sortOrder };

    const alumno = await Alumno.find({ deleted: false })
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      alumno,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener las alumno",
    });
  }
};

// Controlador para crear una nueva alumno, las validaciones se hacen en db-validator
const crearEntidad = async (req, res) => {
  const { nombre, apellidoMaterno, apellidoPaterno, matricula } = req.body;

  try {
    const nuevoAlumno = new Alumno({
      nombre,
      apellidoMaterno,
      apellidoPaterno,
      matricula,
      createdAt : new Date(),
    });

    await nuevoAlumno.save();

    res.status(201).json({
      alumno: nuevoAlumno,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al crear la entidad",
    });
  }
};

// Controlador para actualizar un alumno
const actualizarEntidad = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidoMaterno, apellidoPaterno, matricula } = req.body;

  try {
    const alumno = await Alumno.findById(id);

    if (!alumno) {
      return res.status(404).json({
        msg: "Alumno no encontrada",
      });
    }

    alumno.nombre = nombre;
    alumno.apellidoMaterno = apellidoMaterno;
    alumno.apellidoPaterno = apellidoPaterno;
    alumno.matricula = matricula;
    alumno.updatedAt = new Date();

    await alumno.save();

    res.status(200).json({
      msg: "Alumno actualizado correctamente",
      alumno,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar alumno",
    });
  }
};


// Controlador para eliminar físicamente una alumno
const eliminarAlumnoFisico = async (req, res) => {
  const id = req.params.id;

  try {
    const alumno = await Alumno.findById(id);

    if (!alumno) {
      return res.status(404).json({
        msg: "Alumno no encontrada",
      });
    }

    // Eliminación física (borrado permanente)
    await Alumno.deleteOne({ _id: id });

    return res.status(200).json({
      msg: "Alumno eliminada físicamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al eliminar alumno físicamente",
    });
  }
};

const obtenerAlumnoPorId = async (req, res) => {
  const id = req.params.id;

  try {
    const alumno = await Alumno.findById(id);

    if (!alumno) {
      return res.status(404).json({
        msg: "Alumno no encontrado",
      });
    }

    res.status(200).json({
      msg: "Alumno obtenido correctamente",
      alumno,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener alumno",
    });
  }
};

const actualizarEntidadPatch = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidoMaterno, apellidoPaterno, matricula } = req.body;

  try {
    const alumno = await Alumno.findById(id);

    if (!alumno) {
      return res.status(404).json({
        msg: "Alumno no encontrado",
      });
    }

    if (nombre) {
      alumno.nombre = nombre;
    }

    if (apellidoMaterno) {
      alumno.apellidoMaterno = apellidoMaterno;
    }

    if (apellidoPaterno) {
      alumno.apellidoPaterno = apellidoPaterno;
    }

    if (matricula) {
      alumno.matricula = matricula;
    }

    alumno.updatedAt = new Date();

    await alumno.save();

    res.status(200).json({
      msg: "Alumno actualizado correctamente",
      alumno,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar alumno",
    });
  }
};


module.exports = {
  obtenerEntidad,
  crearEntidad,
  actualizarEntidad,
  eliminarEntidad: eliminarAlumnoFisico,
  obtenerAlumnoPorId,
  actualizarEntidadPatch
};
