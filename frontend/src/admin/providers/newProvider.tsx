import { useState } from "react";
import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";
import { useTranslation } from "../../i18n";

interface FormProps {
  onAcept: () => void;
  onCancel: () => void;
  provider?: { idprovider: number; provider_name: string; contact: number };
}

function FormProvider({ onAcept, onCancel, provider }: FormProps) {
  const [providerName, setProviderName] = useState(
    provider?.provider_name ?? "",
  );
  const [contact, setContact] = useState(String(provider?.contact ?? ""));
  const { t } = useTranslation();
  const esEdicion = Boolean(provider);

  const createProvider = async () => {
    const normalizedName = providerName.trim();
    const parsedContact = Number(contact);

    if (
      !normalizedName ||
      !contact ||
      !Number.isInteger(parsedContact) ||
      parsedContact <= 0
    ) {
      mostrarAlerta(
        "error",
        "No se pudo crear el proveedor",
        "Ingrese un nombre y un número de contacto válido.",
      );
      return;
    }

    const res = await fetch("http://localhost:3000/newProvider", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        provider_name: normalizedName,
        contact: parsedContact,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo crear el proveedor", data.error);
      return;
    }

    onAcept();
    mostrarAlerta(
      "success",
      "Proveedor creado",
      `El proveedor ${normalizedName} se creó correctamente.`,
    );
  };

  const editProvider = async () => {
    const normalizedName = providerName.trim();
    const parsedContact = Number(contact);

    if (
      !provider ||
      !normalizedName ||
      !contact ||
      !Number.isInteger(parsedContact) ||
      parsedContact <= 0
    ) {
      mostrarAlerta(
        "error",
        "No se pudieron guardar los cambios",
        "Ingrese un nombre y un número de contacto válido.",
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

    const res = await fetch("http://localhost:3000/updateProvider", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idprovider: provider.idprovider,
        provider_name: normalizedName,
        contact: parsedContact,
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
      `El proveedor ${normalizedName} se actualizó correctamente.`,
    );
  };

  return (
    <div className="formContainer">
      <p className="listInfo">
        {esEdicion ? t("Editar proveedor") : t("Nuevo proveedor")}
      </p>
      <input
        className="userInput"
        placeholder={t("proveedor")}
        type="text"
        value={providerName}
        onChange={(e) => setProviderName(e.target.value)}
      />
      <input
        className="userInput"
        placeholder={t("contacto")}
        type="number"
        min="1"
        step="1"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <section className="buttonsSection">
        <button
          className="optionButton"
          onClick={esEdicion ? editProvider : createProvider}
        >
          {esEdicion ? t("Guardar") : t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormProvider;
