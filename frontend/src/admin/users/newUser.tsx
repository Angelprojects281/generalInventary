import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormUsers({ onAcept, onCancel }: formProps) {
  const [idusers, setIdusers] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const { t } = useTranslation();

  const newUser = async () => {
    if (!idusers || !password || !rol) {
      mostrarAlerta(
        "error",
        "No se pudo crear el usuario",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    const res = await fetch("http://localhost:3000/newUser", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idusers,
        password,
        rol,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo crear el usuario", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Usuario creado",
      `El usuario ${idusers} se creó correctamente con el rol ${rol}.`,
    );
  };

  return (
    <div className="formContainer">
      <p className="listInfo">{t("Nuevo usuario")}</p>
      <input
        className="userInput"
        placeholder={t("usuario")}
        type="text"
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("contraseña")}
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <select
        className="userInput"
        onChange={(e) => {
          setRol(e.target.value);
        }}
      >
        <option value="">{t("seleccione un rol")}</option>
        <option value="admin">{t("administrador")}</option>
        <option value="regular">{t("regular")}</option>
      </select>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newUser}>
          {t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormUsers;
