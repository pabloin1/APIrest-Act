const Alumno = require("../models/alumno")

const existeMatricula = async(matricula="") =>{

   const matriculaExiste = await Alumno.findOne({matricula});

    if (matriculaExiste) {
        throw new Error(`La matricula ${matricula}, ya existe`)
    }
}

const existeId = async(id='')=>{
    const idExiste = await Alumno.findById(id)

    if (!idExiste) {
        throw new Error(`El id ${id} no existe`)
    }

}

module.exports ={
    existeMatricula,
    existeId
}