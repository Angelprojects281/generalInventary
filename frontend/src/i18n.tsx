import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "es" | "en";

const translations: Record<string, string> = {
  "Panel de administrador": "Administrator Dashboard",
  "Bienvenido al panel de administrador, que vas a hacer hoy?":
    "Welcome to the administrator dashboard. What would you like to do today?",
  "Administrar usuarios": "Manage Users",
  "Administrar categorias": "Manage Categories",
  "Administrar proveedores": "Manage Providers",
  "Administrar movimientos": "Manage Movements",
  "Cerrar sesion": "Log Out",
  "Panel regular": "Staff Dashboard",
  "Bienvenido al panel regular, que vas a hacer hoy?":
    "Welcome to the staff dashboard. What would you like to do today?",
  "Administrar productos": "Manage Products",
  "Inicio de sesion": "Log In",
  "Introduce tu usuario y contraseña:": "Enter your username and password:",
  usuario: "username",
  contraseña: "password",
  "INICIAR SESION": "LOG IN",
  "Cambiar idioma": "Change language",
  "Cambiar a tema": "Switch to",
  claro: "light",
  oscuro: "dark",
  Accion: "Action",
  Estado: "Status",
  "Administrador de categorias": "Category Manager",
  "Nueva categoria +": "New Category +",
  Numero: "Number",
  Categoría: "Category",
  Categoria: "Category",
  "Eliminar categoria": "Delete Category",
  "Administrador de proveedores": "Provider Manager",
  "Nuevo proveedor +": "New Provider +",
  Proveedor: "Provider",
  Contacto: "Contact",
  "Eliminar proveedor": "Delete Provider",
  "Proveedor protegido": "Protected Provider",
  "Administrador de usuarios": "User Manager",
  "Nuevo usuario +": "New User +",
  Filtros: "Filters",
  "Ocultar −": "Hide −",
  "Mostrar +": "Show +",
  "seleccione un rol": "Select a role",
  administrador: "administrator",
  regular: "staff",
  Usuario: "User",
  Rol: "Role",
  "Cambiar contraseña": "Change Password",
  "Eliminar usuario": "Delete User",
  "Administrador de movimientos": "Movement Manager",
  "seleccione un tipo": "Select a type",
  entrada: "inbound",
  salida: "outbound",
  "seleccione una categoria:": "Select a category:",
  "seleccione un producto:": "Select a product:",
  "código único": "unique code",
  "Filtros de fecha (Desde, Hasta):": "Date filters (From, To):",
  "Fecha inicial": "Start date",
  "Fecha final": "End date",
  "Limpiar filtros": "Clear filters",
  Tipo: "Type",
  Fecha: "Date",
  Cantidad: "Quantity",
  Producto: "Product",
  "Administrador de productos": "Product Manager",
  "Nuevo producto +": "New Product +",
  "Todos los proveedores": "All providers",
  "cantidad menor que": "quantity less than",
  Nombre: "Name",
  Descripcion: "Description",
  Descripción: "Description",
  "Nuevo movimiento": "New Movement",
  "Eliminar producto": "Delete Product",
  "Nuevo usuario": "New User",
  Crear: "Create",
  Cancelar: "Cancel",
  "Nuevo proveedor": "New Provider",
  proveedor: "provider",
  contacto: "contact",
  "Actualizando contraseña para el usuario":
    "Updating password for user",
  "contraseña nueva": "new password",
  "confirmar contraseña": "confirm password",
  "Nueva categoria": "New Category",
  categoria: "category",
  "Nuevo producto": "New Product",
  producto: "product",
  cantidad: "quantity",
  descripcion: "description",
  "Seleccione un proveedor:": "Select a provider:",
  "Nuevo Movimiento para el producto": "New Movement for product",
  "seleccione el tipo:": "Select a movement type:",
  Entrada: "Inbound",
  Salida: "Outbound",
  "No se pudo iniciar sesión": "Could not log in",
  "No se pudo iniciar sesión. Inténtelo de nuevo.":
    "Could not log in. Please try again.",
  "El usuario o la contraseña son incorrectos.":
    "The username or password is incorrect.",
  "Inicio de sesión exitoso.": "Logged in successfully.",
  "Ingrese su usuario y contraseña.": "Enter your username and password.",
  "No se pudo crear el usuario": "Could not create user",
  "Complete todos los campos obligatorios.":
    "Complete all required fields.",
  "Usuario creado": "User created",
  "No se pudo crear el proveedor": "Could not create provider",
  "Ingrese un nombre y un número de contacto válido.":
    "Enter a name and a valid contact number.",
  "Proveedor creado": "Provider created",
  "El proveedor {0} se creó correctamente.":
    "Provider {0} was created successfully.",
  "No se pudo cambiar la contraseña": "Could not change password",
  "Complete ambos campos.": "Complete both fields.",
  "Las contraseñas no coinciden.": "Passwords do not match.",
  "Contraseña actualizada": "Password updated",
  "No se pudo crear la categoría": "Could not create category",
  "Ingrese el nombre de la categoría.": "Enter a category name.",
  "Categoría creada": "Category created",
  "No se pudo crear el producto": "Could not create product",
  "Producto creado": "Product created",
  "No se pudo registrar el movimiento": "Could not record movement",
  "Ingrese una cantidad y seleccione el tipo de movimiento.":
    "Enter a quantity and select a movement type.",
  "Movimiento registrado": "Movement recorded",
  "No se pudieron cargar los productos": "Could not load products",
  "No se pudieron cargar los movimientos": "Could not load movements",
  "No se pudieron cargar los usuarios": "Could not load users",
  "No se pudieron cargar las categorías": "Could not load categories",
  "No se pudieron cargar los proveedores": "Could not load providers",
  "No se pudo eliminar el producto": "Could not delete product",
  "Producto eliminado": "Product deleted",
  "No se pudo eliminar la categoría": "Could not delete category",
  "Categoría eliminada": "Category deleted",
  "No se pudo eliminar el proveedor": "Could not delete provider",
  "Proveedor eliminado": "Provider deleted",
  "No se pudo eliminar el usuario": "Could not delete user",
  "Usuario eliminado": "User deleted",
  "¿Deseas eliminar este usuario?": "Do you want to delete this user?",
  "¿Deseas eliminar esta categoría?":
    "Do you want to delete this category?",
  "¿Deseas eliminar este proveedor?": "Do you want to delete this provider?",
  "¿Deseas eliminar este producto?": "Do you want to delete this product?",
  "Revisa la información antes de continuar. Esta acción no se puede deshacer.":
    "Review the information before continuing. This action cannot be undone.",
  "También se eliminarán los productos asociados. Esta acción no se puede deshacer.":
    "Associated products will also be deleted. This action cannot be undone.",
  "El proveedor {0} y sus productos asociados se eliminaron.":
    "Provider {0} and its associated products were deleted.",
  "No fue posible completar la solicitud. Inténtelo de nuevo.":
    "The request could not be completed. Please try again.",
  Aceptar: "OK",
  aceptar: "OK",
  cancelar: "Cancel",
  "El nombre de la categoría es obligatorio.":
    "A category name is required.",
  "No se pudo verificar la categoría. Inténtelo de nuevo.":
    "Could not verify the category. Please try again.",
  "Ya existe una categoría con ese nombre.":
    "A category with that name already exists.",
  "No se pudo crear la categoría. Inténtelo de nuevo.":
    "Could not create the category. Please try again.",
  "No se pudo consultar la categoría. Inténtelo de nuevo.":
    "Could not retrieve the category. Please try again.",
  "La categoría no existe o ya fue eliminada.":
    "The category does not exist or was already deleted.",
  "No se pudieron eliminar los productos asociados. Inténtelo de nuevo.":
    "Could not delete the associated products. Please try again.",
  "No se pudo eliminar la categoría. Inténtelo de nuevo.":
    "Could not delete the category. Please try again.",
  "La categoría y sus productos relacionados se eliminaron correctamente.":
    "The category and its associated products were deleted successfully.",
  "El nombre y el número de contacto son obligatorios.":
    "A name and contact number are required.",
  "No se pudo verificar el proveedor. Inténtelo de nuevo.":
    "Could not verify the provider. Please try again.",
  "Ya existe un proveedor con ese nombre.":
    "A provider with that name already exists.",
  "El nombre del proveedor es obligatorio.": "A provider name is required.",
  "No se pudo consultar el proveedor. Inténtelo de nuevo.":
    "Could not retrieve the provider. Please try again.",
  "El proveedor no existe o ya fue eliminado.":
    "The provider does not exist or was already deleted.",
  "No se puede eliminar el proveedor predeterminado.":
    "The default provider cannot be deleted.",
  "No se pudo eliminar el proveedor. Inténtelo de nuevo.":
    "Could not delete the provider. Please try again.",
  "El proveedor y sus productos relacionados se eliminaron correctamente.":
    "The provider and its associated products were deleted successfully.",
  "El nombre del producto es obligatorio.": "A product name is required.",
  "No se pudo verificar el producto. Inténtelo de nuevo.":
    "Could not verify the product. Please try again.",
  "El producto no existe o ya fue eliminado.":
    "The product does not exist or was already deleted.",
  "No se pudo eliminar el producto. Inténtelo de nuevo.":
    "Could not delete the product. Please try again.",
  "Producto eliminado correctamente.": "Product deleted successfully.",
  "Ingrese el código único, el nombre del producto, la categoría y el proveedor.":
    "Enter the unique code, product name, category, and provider.",
  "El código único no puede superar los 50 caracteres.":
    "The unique code cannot exceed 50 characters.",
  "No se pudo verificar el código único. Inténtelo de nuevo.":
    "Could not verify the unique code. Please try again.",
  "Ya existe un producto con ese código único.":
    "A product with that unique code already exists.",
  "Ya existe un producto con ese nombre.":
    "A product with that name already exists.",
  "La categoría seleccionada no existe.": "The selected category does not exist.",
  "El proveedor seleccionado no existe.": "The selected provider does not exist.",
  "No se pudo crear el producto. Inténtelo de nuevo.":
    "Could not create the product. Please try again.",
  "Producto creado correctamente.": "Product created successfully.",
  "No se pudieron cargar los productos. Inténtelo de nuevo.":
    "Could not load products. Please try again.",
  "Complete los datos obligatorios del movimiento.":
    "Complete all required movement details.",
  "Ingrese una cantidad mayor que cero.": "Enter a quantity greater than zero.",
  "El producto no existe en el inventario.": "The product is not in inventory.",
  "No hay existencias suficientes para registrar la salida.":
    "There is not enough stock to record this outbound movement.",
  "No se pudo actualizar el inventario. Inténtelo de nuevo.":
    "Could not update inventory. Please try again.",
  "No se pudo registrar el movimiento. Inténtelo de nuevo.":
    "Could not record the movement. Please try again.",
  "Movimiento registrado correctamente.": "Movement recorded successfully.",
  "El movimiento se registró correctamente.":
    "The movement was recorded successfully.",
  "No se pudieron cargar los movimientos. Inténtelo de nuevo.":
    "Could not load movements. Please try again.",
  "No se pudieron cargar las categorías. Inténtelo de nuevo.":
    "Could not load categories. Please try again.",
  "No se pudieron cargar los proveedores. Inténtelo de nuevo.":
    "Could not load providers. Please try again.",
  "No se pudieron cargar los usuarios. Inténtelo de nuevo.":
    "Could not load users. Please try again.",
  "El usuario no existe o ya fue eliminado.":
    "The user does not exist or was already deleted.",
  "No se pudo identificar al usuario que desea eliminar.":
    "Could not identify the user you want to delete.",
  "No puede eliminar su propia cuenta.": "You cannot delete your own account.",
  "No se pudo eliminar el usuario. Inténtelo de nuevo.":
    "Could not delete the user. Please try again.",
  "Ingrese el usuario y la contraseña.": "Enter a username and password.",
  "El usuario ya existe.": "The user already exists.",
  "Ya existe una cuenta con ese usuario.":
    "An account with that username already exists.",
  "No se pudo verificar si el usuario ya existe.":
    "Could not check whether the user already exists.",
  "No se pudo crear el usuario. Inténtelo de nuevo.":
    "Could not create the user. Please try again.",
  "No se pudo actualizar la contraseña. Inténtelo de nuevo.":
    "Could not update the password. Please try again.",
  "No se encontró el usuario.": "The user was not found.",
  "La contraseña no cumple los requisitos de seguridad.":
    "The password does not meet the security requirements.",
  "Usuario creado correctamente.": "User created successfully.",
  "Usuario eliminado correctamente.": "User deleted successfully.",
  "Contraseña actualizada correctamente.": "Password updated successfully.",
  "Editar usuario": "Edit User",
  "Editar categoria": "Edit Category",
  "Editar proveedor": "Edit Provider",
  "Editar producto": "Edit Product",
  Guardar: "Save",
  "¿Deseas guardar los cambios?": "Do you want to save the changes?",
  "Verifica los datos antes de guardar.": "Check the data before saving.",
  "Cambios guardados": "Changes saved",
  "No se pudieron guardar los cambios": "Changes could not be saved",
  "Usuario actualizado correctamente.": "User updated successfully.",
  "Categoría actualizada correctamente.": "Category updated successfully.",
  "Proveedor actualizado correctamente.": "Provider updated successfully.",
  "Producto actualizado correctamente.": "Product updated successfully.",
  "No se pudo verificar el usuario. Inténtelo de nuevo.":
    "Could not verify the user. Please try again.",
  "No se pudo actualizar el usuario. Inténtelo de nuevo.":
    "Could not update the user. Please try again.",
  "No se pudo actualizar la categoría. Inténtelo de nuevo.":
    "Could not update the category. Please try again.",
  "No se pudo actualizar el proveedor. Inténtelo de nuevo.":
    "Could not update the provider. Please try again.",
  "No se pudo actualizar el producto. Inténtelo de nuevo.":
    "Could not update the product. Please try again.",
  "No se puede editar el proveedor predeterminado.":
    "The default provider cannot be edited.",
  "El nombre de la categoría no puede superar los 50 caracteres.":
    "The category name cannot exceed 50 characters.",
  "¿Deseas cerrar sesión?": "Do you want to log out?",
  "Tendrás que iniciar sesión de nuevo para acceder.":
    "You will have to log in again to access.",
  "Sesión cerrada por inactividad": "Session closed due to inactivity",
  "La sesión se cerró automáticamente después de 20 minutos de inactividad.":
    "The session was automatically closed after 20 minutes of inactivity.",
};

const dynamicTranslations: [RegExp, string][] = [
  [/^El usuario (.+) se creó correctamente con el rol (.+)\.$/, "User $1 was created successfully with the role $2."],
  [/^La contraseña del usuario (.+) se actualizó correctamente\.$/, "The password for user $1 was updated successfully."],
  [/^La categoría (.+) se creó correctamente\.$/, "Category $1 was created successfully."],
  [/^La categoría (.+) se eliminó correctamente\.$/, "Category $1 was deleted successfully."],
  [/^El producto (.+) se creó correctamente\.$/, "Product $1 was created successfully."],
  [/^El usuario (.+) se eliminó correctamente\.$/, "User $1 was deleted successfully."],
  [/^El proveedor (.+) se creó correctamente\.$/, "Provider $1 was created successfully."],
  [/^El proveedor (.+) y sus productos asociados se eliminaron\.$/, "Provider $1 and its associated products were deleted."],
  [/^El usuario (.+) se actualizó correctamente\.$/, "User $1 was updated successfully."],
  [/^La categoría (.+) se actualizó correctamente\.$/, "Category $1 was updated successfully."],
  [/^El proveedor (.+) se actualizó correctamente\.$/, "Provider $1 was updated successfully."],
  [/^El producto (.+) se actualizó correctamente\.$/, "Product $1 was updated successfully."],
];

function getStoredLanguage(): Language {
  try {
    return localStorage.getItem("inventario-language") === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

// This shared function is used by non-component alert helpers.
// eslint-disable-next-line react-refresh/only-export-components
export function translateText(text: string, language = getStoredLanguage()) {
  if (language === "es") return text;
  const translated = translations[text];
  if (translated) return translated;
  for (const [pattern, replacement] of dynamicTranslations) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return text;
}

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "es" ? "Inventario" : "Inventory";
  }, [language]);

  const toggleLanguage = () => {
    const nextLanguage = language === "es" ? "en" : "es";
    setLanguage(nextLanguage);
    try {
      localStorage.setItem("inventario-language", nextLanguage);
    } catch {
      // Keep the selected language for this session when storage is unavailable.
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        t: (text) => translateText(text, language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Context consumers share the provider through this hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used inside LanguageProvider");
  }
  return context;
}
