const express = require("express");
const app = express();
const port = process.env.PORT || 3010;
const { Pool } = require("pg");

const db = new Pool({
  user: "Hafsa",
  host: "localhost",
  database: "ecommerace",
  password: "**********",
  port: 5432,
});

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customers", (error, result) => {
    console.log(result);
    res.json(result.rows);
  });
});

app.get("/suppliers", (req, res) => {
  db.query("SELECT * FROM suppliers", (error, result) => {
    console.log(result);
    res.json(result.rows);
  });
});
app.get("/products", (req, res) => {
  db.query(
    "SELECT p.product_name, pa.unit_price, s.supplier_name FROM products p JOIN product_availability pa ON (p.id = pa.prod_id) JOIN suppliers s ON (s.id = pa.supp_id )",
    (error, result) => {
      console.log(result);
      res.json(result.rows);
    }
  );
});
app.listener = app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});
