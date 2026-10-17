// =====================================================
// Script de datos de prueba (NO forma parte del backend).
// Crea 3 empresas de ejemplo, cada una con 5 proveedores,
// 5 categorías y 10 productos, aisladas por idusers.
// Uso: node scripts/seedTest.js
// =====================================================

const db = require("../db/db");
const bcrypt = require("bcrypt");

const PASSWORD = "AhoraSi.com";

const companies = [
  {
    user: "angel1",
    company: "Ferreteria El Yunque",
    categories: [
      "Herramientas",
      "Pinturas",
      "Electricidad",
      "Fontaneria",
      "Materiales",
    ],
    providers: [
      { name: "Distribuidora Tornillos del Norte", contact: 3001234567 },
      { name: "Pinturas y Barnices La Colina", contact: 3107654321 },
      { name: "Electricidad El Rayo", contact: 3201122334 },
      { name: "Fontaneria Los Tuberos", contact: 3159988776 },
      { name: "Construcciones El Roble", contact: 6014455667 },
    ],
    products: [
      {
        code: "FER-001",
        name: "Martillo de una 16 oz",
        category: "Herramientas",
        provider: "Distribuidora Tornillos del Norte",
        amount: 45,
        description: "Martillo de una con mango de fibra de vidrio",
      },
      {
        code: "FER-002",
        name: "Taladro percutor 650W",
        category: "Herramientas",
        provider: "Distribuidora Tornillos del Norte",
        amount: 12,
        description: "Taladro percutor con maletin y juego de brocas",
      },
      {
        code: "FER-003",
        name: "Pintura vinilica blanca 1 galon",
        category: "Pinturas",
        provider: "Pinturas y Barnices La Colina",
        amount: 30,
        description: "Pintura vinilica para interior y exterior",
      },
      {
        code: "FER-004",
        name: "Pincel cerda natural 2 pulgadas",
        category: "Pinturas",
        provider: "Pinturas y Barnices La Colina",
        amount: 60,
        description: "Pincel de cerda natural con mango de madera",
      },
      {
        code: "FER-005",
        name: "Bombillo LED 9W frio",
        category: "Electricidad",
        provider: "Electricidad El Rayo",
        amount: 120,
        description: "Bombillo LED 9W luz fria, casquillo E27",
      },
      {
        code: "FER-006",
        name: "Cable THW 12 AWG rollo 100 m",
        category: "Electricidad",
        provider: "Electricidad El Rayo",
        amount: 18,
        description: "Cable THW 12 AWG de cobre, rollo de 100 metros",
      },
      {
        code: "FER-007",
        name: "Tubo PVC 1/2 pulgada barra 6 m",
        category: "Fontaneria",
        provider: "Fontaneria Los Tuberos",
        amount: 40,
        description: "Tubo PVC hidraulico de media pulgada",
      },
      {
        code: "FER-008",
        name: "Llave de agua 1/2 pulgada",
        category: "Fontaneria",
        provider: "Fontaneria Los Tuberos",
        amount: 25,
        description: "Llave de paso cromada para tuberia",
      },
      {
        code: "FER-009",
        name: "Cemento gris 50 kg",
        category: "Materiales",
        provider: "Construcciones El Roble",
        amount: 80,
        description: "Cemento gris de alta resistencia para estructuras",
      },
      {
        code: "FER-010",
        name: "Arena fina bulto 25 kg",
        category: "Materiales",
        provider: "Construcciones El Roble",
        amount: 55,
        description: "Arena fina lavada para mezcla y acabados",
      },
    ],
  },
  {
    user: "angel2",
    company: "Panaderia La Espiga Dorada",
    categories: ["Panes", "Pasteles", "Bebidas", "Snacks", "Ingredientes"],
    providers: [
      { name: "Molinos La Estrella", contact: 3205566778 },
      { name: "Lacteos San Miguel", contact: 3102233445 },
      { name: "Endulzantes La Miel", contact: 3158899001 },
      { name: "Distribuidora El Rio", contact: 3007766554 },
      { name: "Empaques Desechables Ltda", contact: 6025544332 },
    ],
    products: [
      {
        code: "PAN-001",
        name: "Pan campesino unidad",
        category: "Panes",
        provider: "Molinos La Estrella",
        amount: 150,
        description: "Pan campesino tradicional de 500 g",
      },
      {
        code: "PAN-002",
        name: "Croissant de mantequilla",
        category: "Panes",
        provider: "Molinos La Estrella",
        amount: 60,
        description: "Croissant hojaldrado relleno de mantequilla",
      },
      {
        code: "PAN-003",
        name: "Torta de chocolate por porcion",
        category: "Pasteles",
        provider: "Lacteos San Miguel",
        amount: 40,
        description: "Porcion de torta de chocolate humedo",
      },
      {
        code: "PAN-004",
        name: "Milhoja individual",
        category: "Pasteles",
        provider: "Endulzantes La Miel",
        amount: 35,
        description: "Milhoja con crema pastelera y hojaldre",
      },
      {
        code: "PAN-005",
        name: "Jugo de naranja 12 oz",
        category: "Bebidas",
        provider: "Distribuidora El Rio",
        amount: 48,
        description: "Jugo de naranja natural exprimido el mismo dia",
      },
      {
        code: "PAN-006",
        name: "Cafe americano 8 oz",
        category: "Bebidas",
        provider: "Distribuidora El Rio",
        amount: 90,
        description: "Cafe americano preparado con grano tostado",
      },
      {
        code: "PAN-007",
        name: "Galleta de avena con miel",
        category: "Snacks",
        provider: "Endulzantes La Miel",
        amount: 70,
        description: "Galleta de avena endulzada con miel natural",
      },
      {
        code: "PAN-008",
        name: "Pan de queso unidad",
        category: "Snacks",
        provider: "Molinos La Estrella",
        amount: 85,
        description: "Pan relleno de queso derretido",
      },
      {
        code: "PAN-009",
        name: "Harina de trigo 1 kg",
        category: "Ingredientes",
        provider: "Molinos La Estrella",
        amount: 50,
        description: "Harina de trigo para panificacion",
      },
      {
        code: "PAN-010",
        name: "Leche entera 1 litro",
        category: "Ingredientes",
        provider: "Lacteos San Miguel",
        amount: 45,
        description: "Leche entera pasteurizada",
      },
    ],
  },
  {
    user: "angel3",
    company: "Supermercado La Economica",
    categories: ["Bebidas", "Lacteos", "Abarrotes", "Limpieza", "Snacks"],
    providers: [
      { name: "Bebidas El Paraiso Mayorista", contact: 3001100200 },
      { name: "Lacteos Del Valle", contact: 3112233445 },
      { name: "Abarrotes El Central", contact: 3203344556 },
      { name: "Detergentes Brillante S.A.", contact: 3154455667 },
      { name: "Snacks y Dulces Importados", contact: 3015566778 },
    ],
    products: [
      {
        code: "SUP-001",
        name: "Gaseosa cola 400 ml",
        category: "Bebidas",
        provider: "Bebidas El Paraiso Mayorista",
        amount: 144,
        description: "Gaseosa sabor cola en botella de 400 ml",
      },
      {
        code: "SUP-002",
        name: "Agua pura 600 ml",
        category: "Bebidas",
        provider: "Bebidas El Paraiso Mayorista",
        amount: 96,
        description: "Agua pura sin gas en botella de 600 ml",
      },
      {
        code: "SUP-003",
        name: "Leche entera 1 litro",
        category: "Lacteos",
        provider: "Lacteos Del Valle",
        amount: 60,
        description: "Leche entera empacada de 1 litro",
      },
      {
        code: "SUP-004",
        name: "Queso fresco 500 g",
        category: "Lacteos",
        provider: "Lacteos Del Valle",
        amount: 25,
        description: "Queso fresco artesanal en porcion de 500 g",
      },
      {
        code: "SUP-005",
        name: "Arroz blanco 1 kg",
        category: "Abarrotes",
        provider: "Abarrotes El Central",
        amount: 80,
        description: "Arroz blanco grado extra",
      },
      {
        code: "SUP-006",
        name: "Aceite vegetal 1 litro",
        category: "Abarrotes",
        provider: "Abarrotes El Central",
        amount: 40,
        description: "Aceite vegetal de soya de 1 litro",
      },
      {
        code: "SUP-007",
        name: "Detergente liquido 1 litro",
        category: "Limpieza",
        provider: "Detergentes Brillante S.A.",
        amount: 30,
        description: "Detergente liquido concentrado para ropa",
      },
      {
        code: "SUP-008",
        name: "Papel higienico 4 rollos",
        category: "Limpieza",
        provider: "Detergentes Brillante S.A.",
        amount: 50,
        description: "Papel higienico doble hoja, paquete de 4 rollos",
      },
      {
        code: "SUP-009",
        name: "Papas fritas 150 g",
        category: "Snacks",
        provider: "Snacks y Dulces Importados",
        amount: 65,
        description: "Papas fritas sabor natural",
      },
      {
        code: "SUP-010",
        name: "Chocolate en barra 100 g",
        category: "Snacks",
        provider: "Snacks y Dulces Importados",
        amount: 44,
        description: "Chocolate con leche en barra de 100 g",
      },
    ],
  },
];

async function seedCompany(c) {
  const [existing] = await db
    .promise()
    .query("SELECT idusers FROM users WHERE BINARY idusers = ?", [c.user]);

  if (existing.length > 0) {
    console.log(`[omitido] ${c.user}: ya existe la cuenta.`);
    return;
  }

  const hash = bcrypt.hashSync(PASSWORD, 10);

  await db
    .promise()
    .query(
      "INSERT INTO users (idusers, company_name, password) VALUES (?, ?, ?)",
      [c.user, c.company, hash],
    );

  const categoryIds = {};

  for (const category of c.categories) {
    const [result] = await db
      .promise()
      .query("INSERT INTO categories (idusers, category) VALUES (?, ?)", [
        c.user,
        category,
      ]);
    categoryIds[category] = result.insertId;
  }

  const providerIds = {};

  for (const provider of c.providers) {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO providers (idusers, provider_name, contact) VALUES (?, ?, ?)",
        [c.user, provider.name, provider.contact],
      );
    providerIds[provider.name] = result.insertId;
  }

  for (const product of c.products) {
    await db.promise().query(
      `INSERT INTO products
        (idusers, product_code, product_name, amount, description, idcategoria, idprovider)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        c.user,
        product.code,
        product.name,
        product.amount,
        product.description,
        categoryIds[product.category],
        providerIds[product.provider],
      ],
    );
  }

  console.log(
    `[ok] ${c.user} (${c.company}): ${c.categories.length} categorias, ` +
      `${c.providers.length} proveedores, ${c.products.length} productos.`,
  );
}

async function main() {
  for (const company of companies) {
    try {
      await seedCompany(company);
    } catch (error) {
      console.error(`[error] ${company.user}:`, error.code, error.sqlMessage);
      process.exit(1);
    }
  }

  const [rows] = await db.promise().query(
    `SELECT u.idusers, u.company_name,
            (SELECT COUNT(*) FROM categories c WHERE c.idusers = u.idusers) AS categorias,
            (SELECT COUNT(*) FROM providers p WHERE p.idusers = u.idusers) AS proveedores,
            (SELECT COUNT(*) FROM products pr WHERE pr.idusers = u.idusers) AS productos
     FROM users u
     WHERE u.idusers IN ('angel1', 'angel2', 'angel3')
     ORDER BY u.idusers`,
  );

  console.table(rows);
  process.exit(0);
}

main();
