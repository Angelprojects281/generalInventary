// Contenido estático de la pantalla de preguntas frecuentes.
// Solo datos y tipos (sin JSX ni componentes) para no activar la regla
// react-refresh/only-export-components. Los textos son las claves en
// español del diccionario de frontend/src/i18n.tsx: se pintan con t().
export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  entries: FaqEntry[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "account",
    title: "Cuenta y acceso",
    entries: [
      {
        question: "¿Cómo creo mi cuenta?",
        answer:
          "Desde la página de bienvenida, pulsa «Crear una cuenta» y completa el usuario, el nombre de la empresa y la contraseña. La contraseña debe ser segura; al crearla la sesión se inicia automáticamente.",
      },
      {
        question: "¿Cada empresa ve los datos de otra?",
        answer:
          "No. Cada cuenta es una empresa independiente y solo accede a sus propias categorías, proveedores, productos y movimientos. Para gestionar otra empresa necesitas otra cuenta.",
      },
      {
        question: "¿Cómo cierro la sesión?",
        answer:
          "Con el botón «Cerrar sesion» del panel o de la pantalla «Mi cuenta». La sesión también se cierra sola tras 20 minutos de inactividad y el botón «atrás» del navegador pide confirmación antes de salir de la aplicación.",
      },
      {
        question: "¿Qué pasa si olvido la contraseña?",
        answer:
          "No hay recuperación por correo. La contraseña se cambia en «Mi cuenta» indicando la actual. Si no recuerdas la actual, tendrás que registrar una cuenta nueva y cargar de nuevo el inventario.",
      },
    ],
  },
  {
    id: "catalog",
    title: "Categorías, proveedores y productos",
    entries: [
      {
        question: "¿Por qué un producto necesita categoría y proveedor?",
        answer:
          "Son datos obligatorios al dar de alta un producto y deben pertenecer a tu empresa. Si aún no tienes, créalos antes en sus respectivas secciones.",
      },
      {
        question: "¿Qué ocurre al borrar una categoría o un proveedor?",
        answer:
          "Se borran también los productos que tenía asignados. El historial de movimientos no se borra: conserva el nombre, el código y el valor con el que se registró cada movimiento.",
      },
      {
        question: "¿Qué es el proveedor «SIN PROVEEDOR»?",
        answer:
          "Es una fila interna reservada del sistema para los productos que no tienen proveedor. No pertenece a ninguna empresa, así que no aparece en ningún listado: ni en la pantalla de proveedores, ni en el formulario de producto, ni en los filtros. El servidor impide editarla o borrarla.",
      },
      {
        question: "¿Por qué el valor de compra debe ser menor que el de venta?",
        answer:
          "Es una regla del inventario: el sistema no admite un producto cuyo valor de compra sea igual o superior al de venta.",
      },
    ],
  },
  {
    id: "movements",
    title: "Movimientos y existencias",
    entries: [
      {
        question: "¿Cómo registro una entrada o una salida?",
        answer:
          "En «Productos», pulsa «Nuevo movimiento», elige el tipo, busca el producto por su código o por su nombre y pulsa «Añadir». Ajusta la cantidad de cada línea y pulsa «Crear».",
      },
      {
        question: "¿Puedo registrar varios productos en el mismo movimiento?",
        answer:
          "Sí. El formulario admite varias líneas, cada una con su producto y su cantidad, y todas se registran juntas en un único movimiento.",
      },
      {
        question: "¿Qué pasa si una salida supera las existencias?",
        answer:
          "El movimiento no se registra. El formulario avisa mientras la cantidad supera el stock y el servidor vuelve a validarlo antes de guardar, de modo que el stock nunca queda en negativo.",
      },
      {
        question: "¿Veo el total antes de registrar el movimiento?",
        answer:
          "Sí. Mientras compones el movimiento, la barra de total muestra en vivo la suma de cantidad por valor unitario: valor de venta en las salidas y valor de compra en las entradas.",
      },
      {
        question: "¿Se actualiza el stock al registrar un movimiento?",
        answer:
          "Sí. Una entrada suma las unidades al stock de cada producto y una salida las resta. El cambio se aplica al confirmar el movimiento.",
      },
      {
        question: "¿Puedo editar o borrar un movimiento ya registrado?",
        answer:
          "No. El historial es inmutable para que los totales de cada momento sean fiables. Si te has equivocado, registra el movimiento contrario que lo corrija.",
      },
    ],
  },
  {
    id: "values",
    title: "Valores de compra y venta",
    entries: [
      {
        question: "¿Qué diferencia hay entre el valor de compra y el de venta?",
        answer:
          "El valor de compra es lo que paga tu empresa por el producto y el de venta es lo que se cobra al cliente. En las salidas se aplica el valor de venta y en las entradas el de compra.",
      },
      {
        question: "¿Cambiar el valor de un producto altera el historial?",
        answer:
          "No. Cada movimiento guarda el valor que se aplicó en el momento de registrarlo, así que los totales antiguos no cambian aunque edites el producto.",
      },
    ],
  },
  {
    id: "history",
    title: "Filtros e historial",
    entries: [
      {
        question: "¿Cómo busco un producto?",
        answer:
          "En «Productos» puedes filtrar por código, categoría, proveedor o cantidad máxima. En el formulario de movimientos la búsqueda combina el código exacto con el nombre parcial.",
      },
      {
        question: "¿Cómo consulto el historial de movimientos?",
        answer:
          "En «Movimientos» puedes filtrar por tipo, categoría, producto, código y rango de fechas. Cada fila muestra los productos, la fecha y el total del movimiento.",
      },
    ],
  },
  {
    id: "app",
    title: "Navegación, idioma y temas",
    entries: [
      {
        question: "¿Cómo vuelvo al panel?",
        answer:
          "Con el botón «atrás» del navegador. Cada sección tiene su propia pantalla y, al volver atrás dentro del panel, la sesión se mantiene.",
      },
      {
        question: "¿Puedo cambiar el idioma o el tema?",
        answer:
          "Sí. El botón de idioma alterna entre español e inglés y el selector de temas ofrece diez variantes. Ambas preferencias se guardan en el navegador.",
      },
    ],
  },
];
