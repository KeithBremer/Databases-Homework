const express = require("express");
const app = express();

const { Pool } = require("pg");

const db = new Pool({
  user: "admin", // replace with you username
  host: "localhost",
  database: "cyf_ecommerce",
  password: "password",
  port: 5432,
});

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/suppliers", (req, res) => {
    db.query("SELECT * FROM suppliers", (error, result) => {
        res.json(result.rows);
      });
});

app.get("/products", (req, res) => {
    db.query("SELECT p.product_name, a.unit_price , s.supplier_name from products p join product_availability a on p.id = a.prod_id join suppliers s on s.id = a.supp_id", (error, result) => {
        res.json(result.rows);
      });
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000.");
});
