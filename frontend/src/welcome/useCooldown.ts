import { useEffect, useState } from "react";

// Contador de espera para reenviar un codigo de 6 digitos (60 segundos).
// El valor inicial se fija en useState (nunca en el cuerpo de un efecto)
// y el intervalo se limpia al desmontar o al llegar a cero.
export default function useCooldown(inicial: number) {
  const [cooldown, setCooldown] = useState(inicial);

  useEffect(() => {
    if (cooldown <= 0) return;

    const intervalo = window.setInterval(() => {
      setCooldown((valor) => (valor > 0 ? valor - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [cooldown]);

  const reiniciar = () => {
    setCooldown(60);
  };

  return [cooldown, reiniciar] as const;
}
