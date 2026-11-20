// Cliente de correo propio contra la API HTTP de Brevo (plan gratuito,
// 300 correos/dia). Usa el fetch global de Node (>= 18): no hay SDK ni
// librerias de SMTP. La clave API solo vive en secretKey.env y nunca se
// escribe en los registros.

require("dotenv").config({
  path: __dirname + "/../secretKey.env",
});

const {
  plantillaVerificacion,
  plantillaRecuperacion,
} = require("./emailTemplates");

// Envia el codigo de 6 digitos al correo indicado. Devuelve true si
// Brevo acepto el envio y false en cualquier otro caso (configuracion
// ausente, rechazo de Brevo o fallo de red); los errores se registran
// con el status y el mensaje de Brevo, sin secretos.
async function enviarCodigo(email, codigo, purpose) {
  const plantilla =
    purpose === "recuperacion"
      ? plantillaRecuperacion(codigo)
      : plantillaVerificacion(codigo);

  try {
    const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER,
          name: process.env.BREVO_SENDER_NAME,
        },
        to: [{ email }],
        subject: plantilla.subject,
        htmlContent: plantilla.htmlContent,
        textContent: plantilla.textContent,
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => "");
      console.error(
        "Brevo rechazo el correo (status " + respuesta.status + "):",
        detalle,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("No se pudo contactar con Brevo:", err.message);
    return false;
  }
}

module.exports = { enviarCodigo };
