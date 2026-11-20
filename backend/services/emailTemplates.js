// Plantillas de correo en espanol. Solo el codigo numerico se pinta tal
// cual (es un dato propio del mensaje); no se usa ningun otro dato del
// usuario. Cada funcion es pura y devuelve subject, htmlContent y
// textContent para la API de Brevo.

const pie =
  "Si no solicitaste este correo, ignoralo. No compartas este codigo con nadie.";

function plantillaVerificacion(codigo) {
  const intro =
    "Hemos recibido una solicitud para verificar tu cuenta en Inventario. " +
    "Introduce el siguiente codigo de 6 digitos en la pantalla de verificacion:";

  return {
    subject: "Código de verificación de tu cuenta",
    htmlContent:
      "<p>" +
      intro +
      "</p>" +
      '<p style="font-size:32px;font-weight:700;letter-spacing:6px;text-align:center;">' +
      codigo +
      "</p>" +
      "<p>El codigo caduca a los 15 minutos. Si ya no lo necesitas, no hagas nada.</p>" +
      "<p>" +
      pie +
      "</p>",
    textContent:
      intro +
      "\n\n" +
      codigo +
      "\n\nEl codigo caduca a los 15 minutos.\n" +
      pie,
  };
}

function plantillaRecuperacion(codigo) {
  const intro =
    "Hemos recibido una solicitud para restablecer tu contraseña de Inventario. " +
    "Introduce el siguiente codigo de 6 digitos en la pantalla de recuperacion:";

  return {
    subject: "Código para restablecer tu contraseña",
    htmlContent:
      "<p>" +
      intro +
      "</p>" +
      '<p style="font-size:32px;font-weight:700;letter-spacing:6px;text-align:center;">' +
      codigo +
      "</p>" +
      "<p>El codigo caduca a los 15 minutos. Si no fuiste tu, no hagas nada.</p>" +
      "<p>" +
      pie +
      "</p>",
    textContent:
      intro +
      "\n\n" +
      codigo +
      "\n\nEl codigo caduca a los 15 minutos.\n" +
      pie,
  };
}

module.exports = { plantillaVerificacion, plantillaRecuperacion };
