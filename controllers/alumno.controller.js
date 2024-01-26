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
  const { nombre, apellidoMaterno, apellidoPaterno, matricula,password } = req.body;

  try {
    const nuevoAlumno = new Alumno({
      nombre,
      apellidoMaterno,
      apellidoPaterno,
      matricula,
      password,
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
        msg: "Alumno no encontrado",
      });
    }

    // Guardar el estado anterior del alumno
    const estadoAnterior = { ...alumno.toObject() };

    alumno.nombre = nombre;
    alumno.apellidoMaterno = apellidoMaterno;
    alumno.apellidoPaterno = apellidoPaterno;
    alumno.matricula = matricula;
    alumno.updatedAt = new Date();

    await alumno.save();

    // Enviar notificación a través de WebSocket
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          tipo: 'actualizacion',
          mensaje: `Alumno actualizado: ${alumno.nombre} ${alumno.apellidoPaterno}`,
          estadoAnterior,
          nuevoEstado: alumno.toObject(),
        }));
      }
    });

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



// Controlador para eliminar físicamente un alumno
const eliminarAlumnoFisico = async (req, res,notificador) => {
  const id = req.params.id;

  try {
    const alumno = await Alumno.findByIdAndDelete(id);
  
    if (!alumno) {
      return res.status(404).json({
        msg: "Alumno no encontrado",z00
      });
    }

    // Guardar el estado del alumno antes de eliminar
    const estadoAnterior = { ...alumno.toObject() };

   
    notificador.responderClientes("eliminado exitosamente");
    return res.status(200).json({
      msg: "Alumno eliminado físicamente",
    });
  } catch (error) {
    notificador.responderClientes("eliminado exitosamente");
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


const alumnoConectados = [];

const alumnosConectados = (socket) => {

  alumnoConectados.push(socket);

  // Handle disconnection
  socket.on('disconnect', () => {
  
    const index = alumnoConectados.indexOf(socket);
    if (index !== -1) {
      alumnoConectados.splice(index, 1);
    }
  });
};

const contarAlumnosConectados = (req, res) => {
  const conectados = alumnosConectados.length;
  res.status(200).json({ conectados });
}




module.exports = {
  obtenerEntidad,
  crearEntidad,
  actualizarEntidad,
  eliminarEntidad: eliminarAlumnoFisico,
  obtenerAlumnoPorId,
  actualizarEntidadPatch,
  contarAlumnosConectados,
  alumnosConectados
};
