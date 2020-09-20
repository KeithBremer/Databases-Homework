const express = require("express");
const app = express();
const { Pool } = require("pg");

const db = new Pool({
  user: "44788",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "*********",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Hello Wellcome to CYF ecommerce App ");
});

app.get("/customers", function (req, res) {
  db.query(`SELECT * FROM customers`, (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  });
});

app.get("/suppliers", function (req, res) {
  db.query(`SELECT * FROM suppliers`, (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  });
});

app.get("/products", function (req, res) {
  db.query(
    `SELECT products.product_name, pa.unit_price price, sup.supplier_name
    FROM products JOIN product_availability pa ON products.id=pa.prod_id
    JOIN suppliers sup ON (pa.supp_id=sup.id)`,
    (error, result) => {
      if (error) throw error;
      res.json(result.rows);
    }
  );
});

const PORT = 6060;

app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
