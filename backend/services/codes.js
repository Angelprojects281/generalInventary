const crypto = require("crypto");

// Constantes del ciclo de vida de un codigo: caducidad, espera entre
// reenvios y maximo de intentos fallidos antes de invalidarlo.
const CODIGO_TTL_MINUTOS = 15;
const CODIGO_COOLDOWN_SEGUNDOS = 60;
const CODIGO_MAX_INTENTOS = 5;

// Codigo aleatorio de 6 digitos. Se usa padStart para admitir ceros a la
// izquierda (000042), de modo que siempre mide 6 caracteres.
function generarCodigo6() {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

// En la base de datos solo se guarda el hash SHA-256 en hex: el codigo
// viaja por correo en claro pero nunca por la BD.
function hashCodigo(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

// Comparacion en tiempo constante. La guardia de longitud evita que
// timingSafeEqual lance si los buffers no miden lo mismo.
function compararCodigo(hashGuardado, code) {
  const guardado = Buffer.from(hashGuardado, "hex");
  const calculado = Buffer.from(hashCodigo(code), "hex");

  if (guardado.length !== calculado.length) {
    return false;
  }

  return crypto.timingSafeEqual(guardado, calculado);
}

module.exports = {
  generarCodigo6,
  hashCodigo,
  compararCodigo,
  CODIGO_TTL_MINUTOS,
  CODIGO_COOLDOWN_SEGUNDOS,
  CODIGO_MAX_INTENTOS,
};
