import { useEffect, useState } from "react";
import listProviders, { type ProviderInterface } from "./listProviders";
import FormProvider from "./newProvider";
import deleteProvider from "./deleteProvider";

export default function AdminProviders() {
  const [providers, setProviders] = useState<ProviderInterface[]>([]);
  const [showForm, setShowForm] = useState(false);

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
        <h3 className="tittle">Administrador de proveedores</h3>
        <section className="actionButton" onClick={() => setShowForm(true)}>
          <p>Nuevo proveedor +</p>
        </section>
      </header>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">Numero</p>
            <p className="listInfo">Proveedor</p>
            <p className="listInfo">Contacto</p>
            <p className="listInfo">Eliminar proveedor</p>
          </li>
          {providers.map((provider, index) => (
            <li key={provider.idprovider} className="lineList">
              <p className="listInfo lastInfo" data-label="Número">
                {index + 1}
              </p>
              <p className="listInfo lastInfo" data-label="Proveedor">
                {provider.provider_name}
              </p>
              <p className="listInfo lastInfo" data-label="Contacto">
                {provider.contact}
              </p>
              {provider.idprovider === 0 ? (
                <p className="listInfo lastInfo" data-label="Estado">
                  Proveedor protegido
                </p>
              ) : (
                <p
                  className="listInfo lastInfo Delete"
                  data-label="Acción"
                  onClick={() => handleDelete(provider.provider_name)}
                >
                  Eliminar proveedor
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
