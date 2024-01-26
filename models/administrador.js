const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const administradorSchema = new Schema({
  correo: {
    type: String,
    required: true,
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
administradorSchema.pre("save", async function (next) {
  const administrador = this;

  if (!administrador.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(administrador.password, salt);
  administrador.password = hash;

  next();
});

module.exports = model("administradore", administradorSchema);
