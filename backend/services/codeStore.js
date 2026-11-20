const db = require("../db/db");
const mailer = require("./mailer");
const {
  generarCodigo6,
  hashCodigo,
  compararCodigo,
  CODIGO_TTL_MINUTOS,
  CODIGO_COOLDOWN_SEGUNDOS,
  CODIGO_MAX_INTENTOS,
} = require("./codes");

// Las dos funciones reciben un callback (err, estado) con el mismo
// patron que los controladores. El guard "terminado" evita responder dos
// veces si algo falla justo despues de contestar.

// Emite (o reemite) el codigo de un usuario para un proposito. Aplica el
// cooldown de 60 segundos sobre la fila vigente: si el codigo actual se
// emitio hace menos de ese tiempo no se envia nada (callback con false)
// sin tocar su caducidad. Si no, genera un codigo nuevo, lo guarda con
// created_at = NOW() (y attempts = 0) y lo envia por correo.
function emitirCodigo(idusers, purpose, email, callback) {
  let terminado = false;
  const finalizar = (err, enviado) => {
    if (terminado) return;
    terminado = true;
    callback(err, enviado);
  };

  const consultarCooldown =
    "SELECT idcode FROM verification_codes " +
    "WHERE BINARY idusers = ? AND purpose = ? " +
    "AND created_at > DATE_SUB(NOW(), INTERVAL " +
    CODIGO_COOLDOWN_SEGUNDOS +
    " SECOND)";

  db.promise()
    .query(consultarCooldown, [idusers, purpose])
    .then(([rows]) => {
      if (rows.length > 0) {
        finalizar(null, false);
        return null;
      }

      const codigo = generarCodigo6();

      const guardarCodigo =
        "INSERT INTO verification_codes " +
        "(idusers, purpose, code_hash, created_at) VALUES (?, ?, ?, NOW()) " +
        "ON DUPLICATE KEY UPDATE code_hash = VALUES(code_hash), " +
        "created_at = NOW(), attempts = 0";

      return db
        .promise()
        .query(guardarCodigo, [idusers, purpose, hashCodigo(codigo)])
        .then(() => mailer.enviarCodigo(email, codigo, purpose))
        .then((enviado) => {
          if (!enviado) {
            finalizar(new Error("No se pudo enviar el correo de codigo."));
            return null;
          }

          finalizar(null, true);
          return null;
        });
    })
    .catch((err) => finalizar(err));
}

// Valida un codigo vigente y borra la fila (un solo uso). Estados:
// "ok", "sin_codigo", "caducado", "demasiados" o "incorrecto". Los
// errores de base de datos llegan como err. El intento fallido se
// incrementa de forma atomica solo mientras queden intentos; al llegar
// al maximo se borra la fila.
function validarCodigo(idusers, purpose, code, callback) {
  let terminado = false;
  const finalizar = (err, estado) => {
    if (terminado) return;
    terminado = true;
    callback(err, estado);
  };

  const borrarFila = () =>
    db
      .promise()
      .query(
        "DELETE FROM verification_codes WHERE BINARY idusers = ? AND purpose = ?",
        [idusers, purpose],
      );

  const consultarFila =
    "SELECT idcode, code_hash, attempts, " +
    "(created_at > DATE_SUB(NOW(), INTERVAL " +
    CODIGO_TTL_MINUTOS +
    " MINUTE)) AS vigente " +
    "FROM verification_codes WHERE BINARY idusers = ? AND purpose = ?";

  db.promise()
    .query(consultarFila, [idusers, purpose])
    .then(([rows]) => {
      if (rows.length === 0) {
        finalizar(null, "sin_codigo");
        return null;
      }

      const fila = rows[0];

      if (!fila.vigente) {
        return borrarFila().then(() => {
          finalizar(null, "caducado");
          return null;
        });
      }

      if (compararCodigo(fila.code_hash, code)) {
        return borrarFila().then(() => {
          finalizar(null, "ok");
          return null;
        });
      }

      const incrementarIntentos =
        "UPDATE verification_codes SET attempts = attempts + 1 " +
        "WHERE BINARY idusers = ? AND purpose = ? AND attempts < " +
        CODIGO_MAX_INTENTOS;

      return db
        .promise()
        .query(incrementarIntentos, [idusers, purpose])
        .then(([resultado]) => {
          if (resultado.affectedRows === 0) {
            finalizar(null, "sin_codigo");
            return null;
          }

          return db
            .promise()
            .query(
              "SELECT attempts FROM verification_codes " +
                "WHERE BINARY idusers = ? AND purpose = ?",
              [idusers, purpose],
            )
            .then(([filas]) => {
              if (filas.length === 0) {
                finalizar(null, "sin_codigo");
                return null;
              }

              if (filas[0].attempts >= CODIGO_MAX_INTENTOS) {
                return borrarFila().then(() => {
                  finalizar(null, "demasiados");
                  return null;
                });
              }

              finalizar(null, "incorrecto");
              return null;
            });
        });
    })
    .catch((err) => finalizar(err));
}

module.exports = { emitirCodigo, validarCodigo };
