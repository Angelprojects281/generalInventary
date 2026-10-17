import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import listProviders, { type ProviderInterface } from "./listProviders";
import FormProvider from "./formProvider";
import deleteProvider from "./deleteProvider";
import RowActions from "./rowActions";
import { useTranslation } from "../i18n";

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<ProviderInterface[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [providerToEdit, setProviderToEdit] =
    useState<ProviderInterface | null>(null);
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
    setProviderToEdit(null);
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
        <section
          className="actionButton"
          onClick={() => {
            setProviderToEdit(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} aria-hidden="true" />
          <p>{t("Nuevo proveedor +")}</p>
        </section>
      </header>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Numero")}</p>
            <p className="listInfo">{t("Proveedor")}</p>
            <p className="listInfo">{t("Contacto")}</p>
            <p className="listInfo listInfoActions">{t("Accion")}</p>
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
                <div
                  className="lastInfo rowActionsSlot"
                  data-label={t("Accion")}
                >
                  <RowActions
                    actions={[
                      {
                        label: "Editar proveedor",
                        icon: Pencil,
                        onClick: () => {
                          setProviderToEdit(provider);
                          setShowForm(true);
                        },
                      },
                      {
                        label: "Eliminar proveedor",
                        icon: Trash2,
                        danger: true,
                        onClick: () =>
                          handleDelete(provider.provider_name),
                      },
                    ]}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <AnimatePresence>
        {showForm && (
          <FormProvider
            key="provider"
            onAcept={handleCreate}
            onCancel={() => {
              setShowForm(false);
              setProviderToEdit(null);
            }}
            provider={providerToEdit ?? undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
