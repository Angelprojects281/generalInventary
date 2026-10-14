import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  category_name: string;
  product_name: string;
}

interface tokenPayload {
  idusers: string;
  rol: string;
  iat: number;
  exp: number;
}

function FormMovement({
  onAcept,
  onCancel,
  category_name,
  product_name,
}: formProps) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const { t } = useTranslation();

  const tokenLocal = localStorage.getItem("token");

  if (tokenLocal === null) {
    return;
  }

  const decodeToken = jwtDecode<tokenPayload>(tokenLocal);

  const userName = decodeToken.idusers;

  const newMovement = async () => {
    if (!amount || !type) {
      mostrarAlerta(
        "error",
        "No se pudo registrar el movimiento",
        "Ingrese una cantidad y seleccione el tipo de movimiento.",
      );
      return;
    }
    const res = await fetch("http://localhost:3000/newMovement", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        type,
        amount,
        category_name,
        product_name,
        userName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo registrar el movimiento", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Movimiento registrado",
      `El movimiento se registró correctamente.`,
    );
  };

  return (
    <div className="formContainer">
      <p className="listInfo">
        {t("Nuevo Movimiento para el producto")} {product_name}
      </p>
      <input
        className="userInput"
        placeholder={t("cantidad")}
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      ></input>

      <select className="userInput" onChange={(e) => setType(e.target.value)}>
        <option value="">{t("seleccione el tipo:")}</option>
        <option value="entrada">{t("Entrada")}</option>
        <option value="salida">{t("Salida")}</option>
      </select>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newMovement}>
          {t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormMovement;
