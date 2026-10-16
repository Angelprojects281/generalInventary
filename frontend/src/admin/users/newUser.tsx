import { useState } from "react";
import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  user?: { idusers: string; rol: string };
}

function FormUsers({ onAcept, onCancel, user }: formProps) {
  const [idusers, setIdusers] = useState(user?.idusers ?? "");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(user?.rol ?? "");
  const { t } = useTranslation();
  const esEdicion = Boolean(user);

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

  const editUser = async () => {
    if (!user || !idusers || !rol) {
      mostrarAlerta(
        "error",
        "No se pudieron guardar los cambios",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    const result = await mostrarConfirmacion(
      "question",
      "¿Deseas guardar los cambios?",
      "Verifica los datos antes de guardar.",
    );

    if (!result.isConfirmed) {
      return;
    }

    const res = await fetch("http://localhost:3000/updateUser", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idusers: user.idusers,
        newIdusers: idusers,
        rol,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudieron guardar los cambios", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Cambios guardados",
      `El usuario ${idusers} se actualizó correctamente.`,
    );
  };

  return (
    <div className="formContainer">
      <p className="listInfo">
        {esEdicion ? t("Editar usuario") : t("Nuevo usuario")}
      </p>
      <input
        className="userInput"
        placeholder={t("usuario")}
        type="text"
        value={idusers}
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>
      {!esEdicion && (
        <input
          className="userInput"
          placeholder={t("contraseña")}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      )}
      <select
        className="userInput"
        value={rol}
        onChange={(e) => {
          setRol(e.target.value);
        }}
      >
        <option value="">{t("seleccione un rol")}</option>
        <option value="admin">{t("administrador")}</option>
        <option value="regular">{t("regular")}</option>
      </select>

      <section className="buttonsSection">
        <button className="optionButton" onClick={esEdicion ? editUser : newUser}>
          {esEdicion ? t("Guardar") : t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormUsers;
