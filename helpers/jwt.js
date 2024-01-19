const jwt = require("jsonwebtoken");

const generarJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("no se pudo generar token");
        } else {
          resolve(token);
        }
      }
    );
  });
};


module.exports = {
  generarJWT,
};
