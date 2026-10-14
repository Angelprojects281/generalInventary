import { useEffect, useState } from "react";
import listProviders, { type ProviderInterface } from "./listProviders";
import FormProvider from "./newProvider";
import deleteProvider from "./deleteProvider";
import { useTranslation } from "../../i18n";

export default function AdminProviders() {
  const [providers, setProviders] = useState<ProviderInterface[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  const fetchProviders = async () => {
    setProviders(await listProviders());
  };

  useEffect(() => {
    let isCurrent = true;

    listProviders().then((providerList) => {
      if (isCurrent) setProviders(providerList);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleCreate = () => {
    setShowForm(false);
    fetchProviders();
  };

  const handleDelete = async (providerName: string) => {
    if (await deleteProvider(providerName)) {
      await fetchProviders();
    }
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Administrador de proveedores")}</h3>
        <section className="actionButton" onClick={() => setShowForm(true)}>
          <p>{t("Nuevo proveedor +")}</p>
        </section>
      </header>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Numero")}</p>
            <p className="listInfo">{t("Proveedor")}</p>
            <p className="listInfo">{t("Contacto")}</p>
            <p className="listInfo">{t("Eliminar proveedor")}</p>
          </li>
          {providers.map((provider, index) => (
            <li key={provider.idprovider} className="lineList">
              <p className="listInfo lastInfo" data-label={t("Numero")}>
                {index + 1}
              </p>
              <p className="listInfo lastInfo" data-label={t("Proveedor")}>
                {provider.provider_name}
              </p>
              <p className="listInfo lastInfo" data-label={t("Contacto")}>
                {provider.contact}
              </p>
              {provider.idprovider === 0 ? (
                <p className="listInfo lastInfo" data-label={t("Estado")}>
                  {t("Proveedor protegido")}
                </p>
              ) : (
                <p
                  className="listInfo lastInfo Delete"
                  data-label={t("Accion")}
                  onClick={() => handleDelete(provider.provider_name)}
                >
                  {t("Eliminar proveedor")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
      {showForm && (
        <FormProvider
          onAcept={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
