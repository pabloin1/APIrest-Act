const { Schema, model } = require("mongoose");

const alumnoSchema = new Schema({
  nombre: {
    type: String,
  },
  apellidoPaterno: {
    type: String,
  },
  apellidoMaterno: {
    type: String,
  },
  matricula: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
});

module.exports = model("alumno", alumnoSchema);
