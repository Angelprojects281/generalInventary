const db = require("../db/db");
const bcrypt = require("bcrypt");

const users = ["angel1", "angel2", "angel3"];

(async () => {
  for (const u of users) {
    const [p] = await db
      .promise()
      .query(
        "SELECT * FROM providers WHERE BINARY idusers = ? ORDER BY provider_name",
        [u],
      );
    const [c] = await db
      .promise()
      .query(
        "SELECT * FROM categories WHERE BINARY idusers = ? ORDER BY category",
        [u],
      );
    const [pr] = await db
      .promise()
      .query(
        "SELECT * FROM products WHERE BINARY idusers = ? ORDER BY product_name",
        [u],
      );
    const noProv = pr.filter((x) => x.idprovider === 0).length;
    const centVisible = p.some((x) => x.idprovider === 0);
    console.log(
      `${u} -> proveedores: ${p.length} (centinela visible: ${centVisible}) | ` +
        `categorias: ${c.length} | productos: ${pr.length} | sin proveedor: ${noProv}`,
    );
  }

  const [rows] = await db
    .promise()
    .query("SELECT idusers, password FROM users WHERE idusers IN (?,?,?)", users);

  for (const r of rows) {
    const ok = bcrypt.compareSync("AhoraSi.com", r.password);
    console.log(`login ${r.idusers} con "AhoraSi.com": ${ok ? "OK" : "FALLA"}`);
  }

  process.exit(0);
})();
