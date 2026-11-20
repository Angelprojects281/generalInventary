# Sistema de inventario

Aplicación web multiempresa para administrar categorías, proveedores, productos, existencias y movimientos de inventario. Cada cuenta corresponde a una empresa con su inventario completamente aislado. El proyecto está dividido en un frontend construido con React + TypeScript y Vite, un backend construido con Node.js + Express y una base de datos MySQL.

## Contenido

- [Características](#características)
- [Interfaz y mensajes](#interfaz-y-mensajes)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Uso de la aplicación](#uso-de-la-aplicación)
- [Base de datos](#base-de-datos)
- [API REST](#api-rest)
- [Rutas del frontend](#rutas-del-frontend)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Problemas frecuentes](#problemas-frecuentes)
- [Scripts disponibles](#scripts-disponibles)

## Características

- Registro público de cuentas: usuario, nombre de empresa, correo electrónico y contraseña, con verificación de la cuenta por correo.
- Inicio de sesión con usuario y contraseña; una cuenta sin verificar no puede entrar hasta confirmar el código que recibió por correo.
- Verificación de cuenta por correo: al registrarse se envía un código aleatorio de 6 dígitos (caduca a los 15 minutos, reenvío cada 60 segundos) y, al introducirlo, la sesión se inicia automáticamente.
- Recuperación de contraseña por correo en dos pasos: solicitar código («¿Olvidaste tu contraseña?»), introducir el código y la contraseña nueva.
- Cada cuenta/empresa tiene su propio inventario: categorías, proveedores, productos y movimientos aislados.
- Sin roles: todas las cuentas tienen los mismos permisos sobre su propio inventario.
- Contraseñas almacenadas con `bcrypt` y validadas con `zxcvbn`.
- Tokens JWT con duración de una hora, verificados en el backend mediante middleware.
- Cuenta:
  - Cambiar el nombre de usuario y el nombre de la empresa (con verificación de contraseña actual implícita en la sesión y token nuevo tras el cambio).
  - Cambiar la contraseña exigiendo la contraseña actual.
  - Eliminar la cuenta exigiendo la contraseña; borra en cascada todo el inventario de la empresa.
- Administración de categorías: crear, listar, editar y eliminar (elimina también sus productos).
- Administración de proveedores: crear, listar, editar y eliminar (elimina también sus productos). El proveedor predeterminado "SIN PROVEEDOR" está protegido.
- Administración de productos: crear con cantidad, descripción y valores de compra y venta obligatorios (el valor de compra debe ser menor que el de venta), filtrar por categoría, proveedor y cantidad máxima, editar y eliminar.
- Registro de movimientos de entrada y salida con varios productos y cantidades distintas en una sola operación, con búsqueda de productos por código único o por nombre y comprobación de existencias antes de confirmar; el stock se actualiza automáticamente.
- Historial de movimientos en una fila por movimiento: tipo, cada producto con su valor (salida al valor de venta en verde, entrada al valor de compra en rojo), fecha y hora, y total gastado o ganado.
- Total del movimiento en vivo: al crear un movimiento, el importe que va a generar se muestra mientras se compone (valor de venta en salidas y de compra en entradas).
- Confirmación antes de registrar el movimiento: al pulsar "Crear" se muestra un resumen con el tipo, una fila por línea (producto, cantidad, valor e importe) y el total; si se cancela no se registra nada y el composer conserva sus datos.
- Atajo de teclado para añadir productos escaneados: con el foco en el campo de código o el de nombre, la tecla configurada (por defecto `F2`) añade el producto encontrado y deja el cursor listo para el siguiente escaneo. La tecla se cambia desde el icono de teclado junto al campo de código y se recuerda entre sesiones.
- Preguntas frecuentes: sección con las dudas más habituales sobre el funcionamiento del inventario, disponible desde el panel.
- Reportes de movimientos por rango de fechas (por defecto, el mes en curso): muestra el total de gastos, el total de ganancias y el gran total, y permite descargar el informe en PDF con los datos de la empresa en la cabecera de cada página.
- Filtrado de movimientos por tipo, categoría, producto, código y rango de fechas.
- Alertas visuales en el frontend mediante SweetAlert2, con mensajes de error consistentes.
- Interfaz en español e inglés, con botón para cambiar el idioma y preferencia guardada en el navegador.
- Selección de tema con 10 variantes (claro, oscuro y verde, morado, naranja y rosa en versión clara y oscura), con preferencia guardada en el navegador.

## Interfaz y mensajes

- La interfaz usa una paleta monocromática de grises con un acento de color (`--color-accent`) que depende del tema elegido; las acciones para editar usan el acento del tema y las de eliminar su acento rojo. Tipografía de sistema (`system-ui`, Segoe UI, Roboto) y tarjetas con radios y sombras amplios.
- La página de bienvenida es un héroe a dos columnas: titular y textos a la izquierda, composición ilustrativa (icono grande de `lucide-react` sobre formas flotantes) a la derecha, botones de crear cuenta e iniciar sesión en fila y una franja de tres tarjetas de características.
- Tras autenticarse se accede al panel (`/panel`), con saludo y botón de cerrar sesión a la derecha de la cabecera y una rejilla de tarjetas con icono y descripción por sección (Productos, Categorías, Proveedores, Movimientos, Reportes, Preguntas frecuentes y una tarjeta destacada de Mi cuenta). Cada sección tiene su propia pantalla; la pantalla de cuenta muestra una tarjeta de identidad con el monograma de la empresa y las acciones en fila.
- El fondo de la bienvenida y del panel lleva una malla 3D animada (efecto NET de Vanta sobre three.js) con la paleta del tema; el resto de la página usa un degradado radial fijo en `body`. Si el sistema pide movimiento reducido, Vanta no se monta y solo queda el degradado.
- La pantalla de reportes presenta el informe como un documento: cabecera con los datos de la empresa, resumen con los tres totales (gastos, ganancias y gran total) y tabla de movimientos. El PDF reproduce esa estructura con los datos de la empresa repetidos en la cabecera de cada página, la fila de cabecera de la tabla repetida en cada página, la paginación al pie ("Página X de Y") y los totales al final.
- Los formularios muestran sus campos en dos columnas cuando hay espacio y se adaptan a una columna en pantallas estrechas. Sus botones van en fila.
- Al abrir un formulario, el fondo se atenúa y desenfoca mientras el formulario permanece nítido; los formularios flotantes entran y salen animados con `motion` (`AnimatePresence`).
- Las pantallas, filas, tarjetas y controles tienen animaciones de entrada y hover definidas con `motion` y con `@keyframes` en `frontend/src/styles/styles.css`. Se respeta la preferencia del sistema por reducir el movimiento (`MotionConfig reducedMotion="user"` y consulta `prefers-reduced-motion`).
- Un botón fijo en la esquina inferior derecha abre un selector con 10 temas: `claro`, `oscuro` y verde, morado, naranja y rosa en versión clara y oscura (`verde-oscuro`, `morado-oscuro`, `naranja-oscuro`, `rosa-oscuro`). El menú muestra un círculo de color por tema, marca el activo y se cierra al elegir o al pulsar fuera. La preferencia se guarda en `localStorage` con la clave `inventario-theme`; los valores antiguos `light`/`dark` se migran a `claro`/`oscuro` al cargar.
- Junto al botón de tema hay un botón de idioma que alterna entre español e inglés y muestra `ES` o `EN` según el idioma activo.
- El idioma predeterminado es español y la selección se guarda en `localStorage` con la clave `inventario-language`.
- El sistema de traducciones vive en `frontend/src/i18n.tsx`. El texto visible se envuelve con la función `t()` del hook `useTranslation`, y las alertas usan `translateText`. Las claves se escriben en español; si una clave no tiene traducción, se muestra el texto original.
- Los errores de la API se devuelven en la propiedad `error`, con mensajes breves en español y sin detalles internos de la base de datos. Las operaciones exitosas que devuelven confirmación usan `message`.
- Las confirmaciones se muestran con SweetAlert2. Al registrar un movimiento se abre un diálogo con el resumen en tabla: tipo del movimiento, una fila por línea (producto con su código, cantidad, valor unitario e importe), el total y un aviso del efecto sobre el stock. "Registrar movimiento" es la acción por defecto y recibe el foco; "Cancelar" o `Esc` cierran el diálogo sin registrar nada y un clic fuera no lo cierra. Como SweetAlert2 interpreta el contenido como HTML, el nombre y el código del producto se escapan antes de mostrarse.

## Arquitectura

```text
Navegador
   |
   | React + TypeScript + Vite (http://localhost:4000)
   | Authorization: Bearer <JWT>
   | HTTP / JSON
   v
API Express (http://localhost:3000)
   | middleware auth: verifica el JWT y fija req.user.idusers
   |
   | mysql2
   v
MySQL - base de datos inventary
```

- El frontend guarda el JWT en `localStorage` con la clave `token` y lo adjunta a todas las llamadas mediante el helper `frontend/src/api.ts` (`apiFetch`). Si el backend responde `401`, se cierra la sesión y se vuelve a la bienvenida.
- El backend expone las rutas directamente desde `/`; no se utiliza un prefijo como `/api`.
- Todas las operaciones de inventario se filtran por `req.user.idusers`: una cuenta solo puede ver o modificar su propio inventario.

## Tecnologías

### Frontend

- React `19`.
- TypeScript `6`.
- Vite `8`.
- React Router.
- SweetAlert2 para mostrar mensajes.
- `lucide-react` para los iconos de la interfaz.
- `motion` para las animaciones de entrada, salida y hover.
- `vanta` con `three` para el fondo 3D animado de la bienvenida y el panel (carga diferida).
- `pdfmake` para generar el PDF de los reportes de movimientos (carga diferida: solo se descarga al pulsar "Descargar PDF").
- ESLint para validación de estilo y errores comunes.

### Backend

- Node.js.
- Express `4`.
- MySQL mediante `mysql2`.
- `bcrypt` para hash de contraseñas.
- `jsonwebtoken` para autenticación.
- `zxcvbn` para validar la fortaleza de contraseñas.
- `cors`, `cookie-parser`, `morgan` y `dotenv`.
- Envío de correo con la API HTTP de Brevo usando el `fetch` global de Node (sin SDK ni librerías de SMTP); cliente en `backend/services/mailer.js` y plantillas en `backend/services/emailTemplates.js`.

## Requisitos previos

Antes de instalar el proyecto se necesita:

- Node.js y npm instalados.
- MySQL Server en ejecución.
- Un cliente de MySQL, por ejemplo MySQL Workbench o el cliente `mysql`.
- Dos terminales para ejecutar frontend y backend al mismo tiempo.

Las versiones exactas de las dependencias se encuentran en:

- `backend/package.json`
- `frontend/package.json`

## Instalación

Desde la carpeta raíz del proyecto:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Después, configura MySQL siguiendo la sección [Base de datos](#base-de-datos) y crea el archivo de variables de entorno del backend siguiendo la sección [Configuración](#configuración).

## Configuración

### Variables del backend

El backend carga el secreto JWT desde `backend/secretKey.env` mediante `dotenv`:

```env
JWT_SECRET=coloca_aqui_un_secreto_largo_y_aleatorio
```

El archivo está incluido en `.gitignore`. No debe subirse al repositorio ni compartirse públicamente.

### Correo (Brevo)

El backend envía los códigos de verificación y de recuperación por la API HTTP de Brevo (plan gratuito: 300 correos al día, sin tarjeta). Las tres variables viven en el mismo `backend/secretKey.env`:

```env
BREVO_API_KEY=          # la genera el usuario en Brevo → Settings → API keys
BREVO_SENDER=tu_correo@ejemplo.com   # casilla personal que controles
BREVO_SENDER_NAME=Inventario
```

Pasos en Brevo (cuenta gratuita):

1. Crear la cuenta en Brevo.
2. En *Settings → Senders*, añadir la dirección que usará como remitente (`BREVO_SENDER`). Brevo le envía un código de 6 dígitos a esa misma casilla para verificarla; **no requiere verificar el dominio por DNS** para empezar a enviar.
3. En *Settings → API keys*, generar una clave y pegarla en `BREVO_API_KEY`.

Salvedades del plan gratuito: sin autenticación de dominio los correos pueden entregarse con el remitente reescrito (dominios `@brevosend.com`), añadir el pie «Sent with Brevo» o caer en la carpeta de spam. Para este proyecto es aceptable; conviene revisar spam al probar.

Si las variables están vacías o la clave no es válida, el registro responde `500` con «No se pudo enviar el correo de verificación. Inténtelo de nuevo.» y no se crea la cuenta (el INSERT se revierte para poder reintentar).

### Conexión MySQL

La conexión actual está definida en `backend/db/db.js` y utiliza estos valores por defecto:

| Parámetro     | Valor actual                         |
| ------------- | ------------------------------------ |
| Host          | `localhost`                          |
| Usuario       | `root`                               |
| Contraseña    | La configurada en `backend/db/db.js` |
| Base de datos | `inventary`                          |
| Zona horaria  | `local`                              |

Lo recomendable es migrar host, usuario, contraseña y nombre de base de datos a variables de entorno y evitar dejar credenciales reales escritas directamente en el código.

### URLs y puertos

- Backend: `http://localhost:3000`.
- Frontend: `http://localhost:4000`.
- CORS del backend: permite actualmente `http://localhost:4000`.

Si se cambia el puerto del frontend, también debe actualizarse el origen permitido en `backend/app.js` y la constante `API_URL` de `frontend/src/api.ts`.

## Ejecución

### Backend

En una terminal:

```bash
cd backend
npm start
```

El servidor escucha en el puerto `3000`, sal que el entorno defina `PORT`.

### Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:4000
```

Para generar la versión de producción:

```bash
cd frontend
npm run build
npm run preview
```

## Uso de la aplicación

1. Inicia MySQL.
2. Inicia el backend en el puerto `3000`.
3. Inicia el frontend en el puerto `4000`.
4. Abre `http://localhost:4000`: se muestra la página de bienvenida.
5. Crea una cuenta con "Crear una cuenta" (usuario, nombre de empresa, correo electrónico y contraseña) o inicia sesión con una existente. Ambas acciones abren un formulario flotante.
6. Al crear la cuenta recibirás un código de 6 dígitos por correo: introdúcelo en la pantalla de verificación y entrarás directamente al panel (también puedes reenviar el código desde ahí, con una espera de 60 segundos entre envíos). Si inicias sesión con una cuenta sin verificar, el sistema te lleva a esa misma pantalla pidiendo el código.
7. Si olvidas la contraseña, en el inicio de sesión pulsa «¿Olvidaste tu contraseña?», introduce tu correo y recibirás otro código de 6 dígitos; con él y la contraseña nueva podrás volver a entrar.
8. Tras autenticarse accedes al panel, con un botón por sección: Productos, Categorías, Proveedores, Movimientos, Reportes, Preguntas frecuentes y Mi cuenta.
9. Cada sección es una pantalla propia con su cabecera y su botón de creación ("Nuevo producto +", "Nueva categoria +", "Nuevo proveedor +"); se vuelve al panel con el botón "atrás" del navegador. En "Productos", el formulario de movimiento muestra el total en vivo mientras lo compones y, al pulsar "Crear", pide confirmación con un resumen del movimiento (tipo, productos, cantidades, importes y total); si se cancela, no se registra nada y el formulario sigue abierto con sus datos. En ese mismo formulario, el icono de teclado junto al campo de código permite elegir la tecla que añade el producto escaneado (`F2` por defecto): al escanear un código, esa tecla lo añade y limpia la búsqueda para el siguiente escaneo. En "Reportes" eliges un rango de fechas (por defecto, el mes en curso), pulsas "Generar reporte" para ver el informe con sus tres totales y "Descargar PDF" para guardarlo.
10. En la pantalla Mi cuenta puedes cambiar tu usuario y el nombre de la empresa, cambiar tu contraseña (pide la actual), eliminar tu cuenta (pide la contraseña y borra todo el inventario) o cerrar sesión. También puedes cerrar sesión desde el panel.

Al volver atrás en el historial del navegador desde cualquier pantalla hacia la bienvenida se pide confirmación antes de cerrar la sesión; las vueltas atrás dentro del panel navegan normalmente sin preguntar. El token solo se elimina al confirmar el cierre, al eliminar la cuenta, ante un `401` del backend o automáticamente a los 20 minutos de inactividad, momento en el que se muestra un aviso al usuario.

## Base de datos

La aplicación espera una base de datos MySQL llamada `inventary` con siete tablas. Cada tabla de inventario lleva una columna `idusers` que identifica a la empresa propietaria:

```text
users         1 ---- N categories
users         1 ---- N providers
users         1 ---- N products
users         1 ---- N movements
users         1 ---- N movement_items
users         1 ---- N verification_codes
categories    1 ---- N products
providers     1 ---- N products
movements     1 ---- N movement_items
```

El esquema consolidado del proyecto está disponible en [`database/schema.sql`](database/schema.sql). Este archivo crea la base de datos y las siete tablas, y elimina y recrea las tablas si ya existen: **ejecútalo manualmente en Workbench solo cuando quieras empezar de cero** (destruye y recrea las tablas). **Crea la base de datos vacía**: no incluye datos de prueba; el único `INSERT` es la fila centinela "SIN PROVEEDOR", requisito estructural de la clave foránea de los productos.

### Tablas esperadas

#### `users`

| Columna         | Uso                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `idusers`       | Identificador o nombre de usuario (PK). Se consulta de forma sensible a mayúsculas y minúsculas con `BINARY`.        |
| `company_name`  | Nombre de la empresa propietaria del inventario.                                                                    |
| `email`         | Correo electrónico; `NOT NULL` y único (colación `ci`, sin `BINARY` en las consultas).                               |
| `password`      | Hash generado con `bcrypt`.                                                                                         |
| `email_verified`| `0` hasta que el usuario confirma el código de verificación; sin verificar no puede iniciar sesión.                 |

No existe la columna `rol`: todas las cuentas tienen los mismos permisos sobre su propio inventario.

#### `verification_codes`

Un código activo por usuario y propósito (`verificacion` o `recuperacion`); el reenvío sobrescribe la fila:

| Columna      | Uso                                                                       |
| ------------ | ------------------------------------------------------------------------- |
| `idcode`     | Identificador del código (PK).                                            |
| `idusers`    | Cuenta propietaria (FK a `users` con `ON UPDATE/DELETE CASCADE`).         |
| `purpose`    | Propósito: `verificacion` o `recuperacion` (constraint `CHECK`).          |
| `code_hash`  | SHA-256 en hex del código de 6 dígitos; el código en claro nunca se guarda. |
| `attempts`   | Intentos fallidos; a los 5 se borra la fila.                              |
| `created_at` | Momento de emisión; el código caduca a los 15 minutos.                    |

La clave única `(idusers, purpose)` garantiza un solo código vigente. La fila se borra al validarse (un solo uso), se sustituye al reenviarse tras el cooldown de 60 segundos y cae en cascada al eliminar la cuenta; no hay tareas programadas de limpieza.

#### `categories`

| Columna       | Uso                                                             |
| ------------- | --------------------------------------------------------------- |
| `idcategoria` | Identificador de la categoría.                                  |
| `idusers`     | Empresa propietaria (FK a `users`, con `ON UPDATE/DELETE CASCADE`). |
| `category`    | Nombre de la categoría; único por empresa.                      |

#### `providers`

| Columna         | Uso                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `idprovider`    | Identificador del proveedor.                                        |
| `idusers`       | Empresa propietaria (nullable solo para la centinela global).        |
| `provider_name` | Nombre del proveedor; único por empresa.                            |
| `contact`       | Número de contacto del proveedor.                                   |

La fila `idprovider = 0` ("SIN PROVEEDOR", `idusers NULL`) es una centinela global que usan los productos sin proveedor; al listar por empresa nunca aparece y no se puede editar ni eliminar.

#### `products`

| Columna         | Uso                                                                              |
| --------------- | -------------------------------------------------------------------------------- |
| `idproducts`    | Identificador del producto.                                                      |
| `idusers`       | Empresa propietaria (FK con cascade).                                            |
| `product_code`  | Código único por empresa.                                                        |
| `product_name`  | Nombre único por empresa.                                                        |
| `amount`        | Cantidad disponible en inventario.                                               |
| `description`   | Descripción opcional; el esquema usa `SIN DESCRIPCION` por defecto.              |
| `purchase_value`| Valor de compra obligatorio, `DECIMAL(12,2)` no negativo.                        |
| `sale_value`    | Valor de venta obligatorio, `DECIMAL(12,2)`; debe ser mayor que el valor de compra (constraint `chk_products_values`). |
| `idcategoria`   | Referencia a `categories.idcategoria` (cascade al eliminar la categoría).        |
| `idprovider`    | Referencia a `providers.idprovider`; `0` representa la centinela predeterminada. |

#### `movements`

Cabecera de cada movimiento (una fila por movimiento, no por producto):

| Columna         | Uso                                                                   |
| --------------- | --------------------------------------------------------------------- |
| `idmovements`   | Identificador del movimiento.                                         |
| `idusers`       | Empresa propietaria (FK con cascade).                                 |
| `movement_type` | Tipo de movimiento: `entrada` o `salida`.                             |
| `date_movement` | Fecha y hora del movimiento (`DATETIME`).                             |

#### `movement_items`

Detalle de cada movimiento con los productos que lo componen:

| Columna            | Uso                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------- |
| `idmovement_item`  | Identificador de la línea.                                                              |
| `idmovements`      | Movimiento al que pertenece (FK con cascade).                                           |
| `idusers`          | Empresa propietaria (FK con cascade, convención multiempresa).                          |
| `idproducts`       | Referencia al producto **sin clave foránea**: el historial se conserva al borrar productos. |
| `product_name`     | Copia histórica del nombre en ese momento.                                              |
| `product_code`     | Copia histórica del código en ese momento.                                              |
| `category`         | Copia histórica de la categoría en ese momento.                                         |
| `amount`           | Cantidad movida (entero mayor o igual que 1).                                           |
| `unit_value`       | Precio aplicado en ese momento: `sale_value` en salida, `purchase_value` en entrada; no cambia si después se edita el producto. |

### Reglas de inventario

- Un producto requiere una categoría existente de la misma empresa y valores de compra y venta obligatorios, no negativos y con `compra < venta`.
- `amount` representa el stock actual del producto.
- Una `entrada` incrementa el stock; una `salida` lo disminuye.
- Un movimiento puede incluir varios productos con distintas cantidades; se valida la suma por producto antes de confirmar.
- No se permite una salida mayor que el stock disponible (ni en la composición ni al confirmar).
- El precio de cada línea se congela en el momento del movimiento: editar después el valor de un producto no altera el historial.
- Al eliminar una categoría o un proveedor, el backend elimina primero los productos asociados y después el registro; el historial de movimientos se conserva.
- Al renombrar el usuario de una cuenta, las claves foráneas con `ON UPDATE CASCADE` arrastran el inventario, el historial y los códigos de verificación al nuevo identificador.
- Al eliminar una cuenta se eliminan sus códigos de verificación, sus movimientos (detalle y cabecera), productos, proveedores, categorías y finalmente la cuenta.

## API REST

Todas las respuestas usan JSON. La URL base local es:

```text
http://localhost:3000
```

Salvo los endpoints públicos (`POST /register`, `POST /logIn`, `POST /verifyAccount`, `POST /requestVerificationCode`, `POST /requestPasswordReset` y `POST /resetPassword`), todos los demás exigen el header:

```text
Authorization: Bearer <token>
```

y operan siempre sobre el inventario de la cuenta autenticada. Cuando una solicitud falla, la API responde con un objeto JSON que contiene `error`. Las operaciones exitosas de escritura pueden incluir `message`; las consultas de listas devuelven arreglos.

### Autenticación y cuenta

#### `POST /register`

Crea una cuenta/empresa **sin iniciar sesión**: la respuesta no incluye token y la cuenta queda sin verificar. La contraseña debe alcanzar el nivel mínimo aceptado por `zxcvbn` y el correo debe ser válido y no estar ya registrado.

```json
{
  "idusers": "usuario1",
  "companyName": "Ferretería Central",
  "email": "cliente@ejemplo.com",
  "password": "UnaContraseñaSegura"
}
```

Respuesta exitosa (se envía el código de verificación **antes** de responder):

```json
{
  "message": "Cuenta creada correctamente. Hemos enviado un código de verificación a su correo."
}
```

Errores: `400` con «Ya existe una cuenta con ese usuario.», «Ya existe una cuenta con ese correo.» o validaciones; `500` con «No se pudo enviar el correo de verificación. Inténtelo de nuevo.» si el correo falla (en ese caso la cuenta recién creada se elimina para poder reintentar limpiamente).

#### `POST /logIn`

Inicia sesión y devuelve un JWT válido durante una hora.

```json
{
  "idusers": "usuario1",
  "password": "UnaContraseñaSegura"
}
```

Respuesta exitosa:

```json
{
  "message": "Inicio de sesión exitoso.",
  "token": "eyJ...",
  "companyName": "Ferretería Central"
}
```

Si la contraseña es correcta pero la cuenta **no está verificada** responde `403` sin token:

```json
{
  "error": "Su cuenta no está verificada. Revise su correo para introducir el código."
}
```

El `403` no lo intercepta `apiFetch` (solo el `401`), de modo que el frontend puede distinguirlo y abrir la pantalla de verificación.

#### `POST /verifyAccount`

Verifica la cuenta con el código de 6 dígitos recibido por correo y, si es correcto, **inicia sesión automáticamente** (devuelve token).

```json
{
  "idusers": "usuario1",
  "code": "123456"
}
```

Respuesta exitosa:

```json
{
  "message": "Cuenta verificada correctamente.",
  "token": "eyJ...",
  "companyName": "Ferretería Central"
}
```

El código se guarda como hash SHA-256, caduca a los 15 minutos, admite un máximo de 5 intentos y la fila se borra al usarse. Errores (`400`): «El código debe tener 6 dígitos.», «No hay ningún código pendiente para esa cuenta.», «El código ha caducado. Solicite uno nuevo.», «El código es incorrecto.» y «Demasiados intentos. Solicite un nuevo código.».

#### `POST /requestVerificationCode`

Reenvía el código de verificación. **Respuesta siempre genérica** (no revela si la cuenta existe): solo internamente se envía si el usuario y el correo coinciden, la cuenta no está verificada y ha pasado el cooldown de 60 segundos.

```json
{
  "idusers": "usuario1",
  "email": "cliente@ejemplo.com"
}
```

Respuesta:

```json
{
  "message": "Si el usuario y el correo coinciden, recibirás un código de verificación."
}
```

#### `POST /requestPasswordReset`

Solicita el código para restablecer la contraseña. **Respuesta siempre genérica** (anti-enumeración); internamente solo se envía si existe la cuenta con ese correo y no hay cooldown de 60 segundos. Funciona también en cuentas sin verificar.

```json
{
  "email": "cliente@ejemplo.com"
}
```

Respuesta:

```json
{
  "message": "Si existe una cuenta con ese correo, recibirás un código para restablecer tu contraseña."
}
```

#### `POST /resetPassword`

Restablece la contraseña con el código recibido. No devuelve token: el frontend vuelve al formulario de inicio de sesión.

```json
{
  "email": "cliente@ejemplo.com",
  "code": "123456",
  "newPassword": "NuevaContraseñaSegura",
  "confirmPassword": "NuevaContraseñaSegura"
}
```

Validaciones: campos obligatorios, contraseñas coincidentes y `zxcvbn >= 3`. Cualquier problema con el código (formato, caducidad o intentos) responde el mismo mensaje genérico `400` «El código es incorrecto o ha caducado.» para no revelar si el correo existe. Éxito:

```json
{
  "message": "Contraseña actualizada correctamente."
}
```

#### `GET /accountInfo`

Devuelve el usuario y el nombre de empresa de la cuenta autenticada.

```json
{
  "idusers": "usuario1",
  "companyName": "Ferretería Central"
}
```

#### `PUT /updateAccount`

Cambia el nombre de usuario, el nombre de la empresa o ambos. Devuelva un token nuevo porque el usuario puede haber cambiado.

```json
{
  "newIdusers": "usuario1",
  "companyName": "Ferretería Central 2"
}
```

Al menos uno de los dos campos es obligatorio.

#### `POST /changePassword`

Cambia la contraseña de la cuenta autenticada y exige la contraseña actual.

```json
{
  "currentPassword": "ContraseñaActual",
  "newPassword": "NuevaContraseñaSegura",
  "confirmPassword": "NuevaContraseñaSegura"
}
```

#### `DELETE /deleteAccount`

Elimina la cuenta autenticada y todo su inventario. Exige la contraseña.

```json
{
  "password": "UnaContraseñaSegura"
}
```

### Categorías

#### `GET /listCategories`

Devuelve las categorías de la empresa autenticada.

#### `POST /newCategory`

```json
{
  "categoryName": "Papelería"
}
```

#### `PUT /updateCategory`

```json
{
  "idcategoria": 1,
  "categoryName": "Papelería"
}
```

#### `DELETE /deleteCategory/:categoryName`

Elimina una categoría de la empresa y los productos asociados a ella.

### Proveedores

#### `GET /listProviders`

Devuelve los proveedores de la empresa (sin incluir la centinela predeterminada).

#### `POST /newProvider`

```json
{
  "provider_name": "Distribuidora Central",
  "contact": 555123456
}
```

#### `PUT /updateProvider`

```json
{
  "idprovider": 1,
  "provider_name": "Distribuidora Central",
  "contact": 555123456
}
```

El proveedor predeterminado (`idprovider = 0`) no se puede editar.

#### `DELETE /deleteProvider/:provider_name`

Elimina un proveedor de la empresa y los productos asociados. El proveedor predeterminado no se puede eliminar.

### Productos

#### `GET /filterProducts`

Lista los productos de la empresa y permite aplicar filtros opcionales:

```text
GET /filterProducts?categoryName=Papelería&provider_name=Distribuidora%20Central&amount=10
```

Parámetros:

- `product_code`: exacto.
- `product_name`: coincidencia parcial (`LIKE`), para buscar productos por nombre.
- `categoryName`
- `provider_name`
- `amount`: devuelve productos cuya cantidad sea menor o igual al valor indicado.

#### `POST /newProduct`

`product_code`, `product_name`, `categoryName`, `provider_name`, `purchase_value` y `sale_value` son obligatorios; `amount` y `description` son opcionales. La categoría y el proveedor deben pertenecer a la empresa. Los valores deben ser numéricos, no negativos y con `compra < venta`.

```json
{
  "product_code": "PAP-001",
  "product_name": "Cuaderno",
  "amount": 25,
  "description": "Cuaderno de 100 hojas",
  "purchase_value": 8.5,
  "sale_value": 12.5,
  "categoryName": "Papelería",
  "provider_name": "Distribuidora Central"
}
```

#### `PUT /updateProduct`

Mismos campos que `newProduct` más `idproducts`.

#### `DELETE /deleteProduct/:product_name`

Elimina un producto de la empresa por nombre. El historial de movimientos que lo menciona se conserva.

### Movimientos

#### `POST /newMovement`

Registra un movimiento con varios productos, actualiza el stock de cada uno y guarda el detalle con el precio vigente, todo en una transacción. El usuario que registra el movimiento se toma del token.

```json
{
  "type": "salida",
  "items": [
    { "idproducts": 1, "amount": 5 },
    { "idproducts": 3, "amount": 2 }
  ]
}
```

Valores válidos de `type`: `entrada` y `salida`. Cada `amount` debe ser un entero mayor o igual que 1 y cada `idproducts` debe pertenecer a la empresa. Las cantidades del mismo producto se fusionan antes de validar. Para una salida, la suma de cantidades por producto no puede superar el stock disponible.

#### `GET /filterMovements`

Lista los movimientos de la empresa ordenados del más reciente al más antiguo, con sus productos agrupados. Todos los parámetros son opcionales:

```text
GET /filterMovements?type=salida&category_name=Papelería&product_name=Cuaderno&product_code=PAP-001&initDate=2026-01-01&finalDate=2026-12-31
```

La respuesta agrupa cada movimiento con su detalle y total:

```json
[
  {
    "idmovements": 1,
    "movement_type": "salida",
    "date_movement": "2026-11-11T14:30:00.000Z",
    "total": 62.5,
    "items": [
      {
        "product_name": "Cuaderno",
        "product_code": "PAP-001",
        "category": "Papelería",
        "amount": 5,
        "unit_value": 12.5,
        "line_value": 62.5
      }
    ]
  }
]
```

`line_value` es `cantidad × valor unitario` y `total` es la suma de las líneas. El rango de fechas cubre el día final completo.

## Rutas del frontend

| Ruta         | Acceso  | Pantalla                                                     |
| ------------ | ------- | ------------------------------------------------------------ |
| `/`          | Público | Bienvenida: crear cuenta o iniciar sesión. También aloja los formularios flotantes de verificación de cuenta (código de 6 dígitos, con reenvío) y de recuperación de contraseña (solicitar código y restablecerla); no hay rutas nuevas: los pasos se encadenan dentro de `/`. |
| `/panel`     | Sesión  | Panel principal con acceso a cada sección                    |
| `/products`  | Sesión  | Administrador de productos                                   |
| `/categories`| Sesión  | Administrador de categorías                                  |
| `/providers` | Sesión  | Administrador de proveedores                                 |
| `/movements` | Sesión  | Administrador de movimientos                                 |
| `/reports`   | Sesión  | Reportes de movimientos por rango de fechas y descarga en PDF |
| `/faq`       | Sesión  | Preguntas frecuentes: dudas habituales sobre el uso           |
| `/account`   | Sesión  | Mi cuenta: usuario, empresa, contraseña y eliminación        |
| `*`          | Público | Redirige a la bienvenida                                     |

## Estructura del proyecto

```text
inventario/
├── backend/
│   ├── app.js                  # Configuración de Express, JSON, CORS y rutas
│   ├── package.json            # Dependencias y script de arranque
│   ├── secretKey.env           # Secreto JWT y credenciales Brevo, excluido de Git
│   ├── bin/www                  # Servidor HTTP y puerto
│   ├── db/db.js                # Conexión MySQL
│   ├── middleware/auth.js      # Verificación del JWT y req.user.idusers
│   ├── services/               # Códigos (hash y constantes), almacén de códigos, cliente de correo Brevo y plantillas
│   ├── controllers/            # Controladores de cuenta, categorías, productos y movimientos
│   └── routes/routes.js        # Registro de endpoints (auth en casi todos)
├── frontend/
│   ├── package.json            # Dependencias y scripts de Vite
│   ├── vite.config.ts          # Puerto 4000 y plugin React
│   └── src/
│       ├── App.tsx             # Router, guardia de navegación y botones de tema e idioma
│       ├── api.ts              # apiFetch: adjunta el JWT y maneja el 401
│       ├── main.tsx            # Punto de entrada React
│       ├── i18n.tsx            # Traducciones (es/en), proveedor e hook de idioma
│       ├── welcome/            # Bienvenida: héroe, tarjetas y formularios flotantes de registro, inicio de sesión, verificación de cuenta y recuperación de contraseña (multi-paso en `/`)
│       ├── panel/              # Pantallas del panel (productos, categorías, proveedores, movimientos, reportes, preguntas frecuentes, cuenta) y sus formularios
│       │   ├── faqScreen.tsx   # Pantalla de preguntas frecuentes (/faq)
│       │   ├── faqContent.ts   # Contenido estático de la FAQ: grupos, preguntas y respuestas
│       │   ├── reportsScreen.tsx # Pantalla de reportes de movimientos (/reports)
│       │   ├── reportBuilder.ts # Lógica pura del reporte: tipos, fechas y agregados
│       │   └── reportPdf.ts     # Generación del PDF (pdfmake, cargado bajo demanda)
│       ├── visual/             # Fondo animado Vanta (three.js, importación diferida)
│       ├── ruteProtection/      # Protección de rutas en el cliente
│       ├── session/            # Cierre de sesión y temporizador de inactividad
│       ├── alerts/             # Alertas de interfaz: avisos y confirmaciones
│       └── styles/             # Estilos globales
├── database/
│   └── schema.sql              # Esquema SQL multiempresa
├── .gitignore
└── README.md
```

## Seguridad

- El middleware `backend/middleware/auth.js` valida el JWT en todos los endpoints salvo los públicos: `POST /register`, `POST /logIn`, `POST /verifyAccount`, `POST /requestVerificationCode`, `POST /requestPasswordReset` y `POST /resetPassword`.
- Cada consulta de inventario filtra por `req.user.idusers`; los identificadores que llegan en la petición (producto, categoría, proveedor) se contrastan siempre con la cuenta autenticada.
- Los cambios de cuenta y la eliminación exigen la contraseña actual.
- Verificación de cuentas y recuperación de contraseña: los códigos son aleatorios de 6 dígitos (con ceros a la izquierda), se guardan como hash SHA-256 y se comparan con `crypto.timingSafeEqual` (tiempo constante); caducan a los 15 minutos, admiten un máximo de 5 intentos (al agotarlos se borra la fila), tienen un cooldown de 60 segundos entre reenvios y solo puede haber un código activo por usuario y propósito. Los endpoints de solicitud responden siempre el mismo mensaje genérico sin revelar si la cuenta o el correo existen (anti-enumeración) y la recuperación no exige cuenta verificada.
- Antes de usar el sistema en producción se recomienda además:
  - Cambiar el secreto JWT por uno largo, aleatorio y exclusivo del entorno.
  - No versionar `backend/secretKey.env` ni credenciales de MySQL.
  - Mover host, usuario, contraseña y nombre de base de datos a variables de entorno.
  - Usar HTTPS.
  - Configurar CORS con una lista de orígenes permitidos por entorno.
  - Rotar las credenciales si alguna contraseña o secreto ya fue expuesto.

## Problemas frecuentes

### El frontend no puede conectarse al backend

Comprueba que:

1. El backend esté ejecutándose en `http://localhost:3000`.
2. El frontend esté ejecutándose en `http://localhost:4000`.
3. MySQL esté iniciado.
4. La base de datos `inventary` exista con el esquema de `database/schema.sql`.
5. El origen del frontend coincida con la configuración CORS de `backend/app.js`.

### La aplicación vuelve sola a la página de bienvenida

El backend respondió `401`: la sesión no es válida o el token caducó (duración de una hora). Inicia sesión de nuevo.

### El usuario no puede iniciar sesión

Verifica que la cuenta exista (el registro es público desde la bienvenida), que la contraseña se haya almacenado mediante `bcrypt` y que `backend/secretKey.env` contenga `JWT_SECRET`. Si el mensaje indica que la cuenta no está verificada, introduce el código de 6 dígitos que llegó por correo (desde esa pantalla puedes reenviarlo).

### No me llega el correo de verificación ni el de recuperación

1. Revisa la carpeta de spam: sin autenticar dominio, Brevo puede entregarse como spam o con remitente reescrito.
2. Comprueba que `backend/secretKey.env` define `BREVO_API_KEY`, `BREVO_SENDER` y `BREVO_SENDER_NAME`, y que el backend se ha reiniciado después de editarlo.
3. Verifica que la dirección de `BREVO_SENDER` esté añadida y verificada en Brevo (*Settings → Senders*) y que la API key sea válida (*Settings → API keys*).
4. Entre reenvíos hay una espera de 60 segundos: el botón «Reenviar código» está deshabilitado durante ese tiempo y, si se fuerza la llamada antes, no se emite un correo nuevo.
5. Revisa la consola del backend: los fallos de Brevo se registran con el status y el mensaje de la respuesta (nunca con la clave).

### Error de conexión con MySQL

Revisa las credenciales en `backend/db/db.js`, el nombre `inventary`, el puerto de MySQL y que el servidor acepte conexiones locales.

## Scripts disponibles

### Backend

```bash
npm start
```

Inicia el servidor Express.

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `dev`: inicia Vite en modo desarrollo.
- `build`: ejecuta TypeScript y genera la compilación de producción.
- `lint`: ejecuta ESLint.
- `preview`: sirve localmente la compilación generada.

## Estado del proyecto

El proyecto está preparado para desarrollo local. Para un entorno productivo todavía deben completarse, como mínimo, la gestión de secretos por entorno y una estrategia de despliegue con HTTPS.
