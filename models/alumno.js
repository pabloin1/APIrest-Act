const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

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
  password: {
    type: String,
    required: true,
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

// Antes de guardar, hashear la contraseña
alumnoSchema.pre("save", async function (next) {
  const alumno = this;

  if (!alumno.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(alumno.password, salt);
  alumno.password = hash;

  next();
});

module.exports = model("alumno", alumnoSchema);
