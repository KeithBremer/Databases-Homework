const express = require("express");
const app = express();
const { Pool } = require("pg");
const db = new Pool({
  user: "iman_",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "iman1364",
  port: "5432",
});

app.get("/customers", (req, res) => {
  db.query("select * from Customers", (err, result) => {
    if (err == undefined) {
      console.log(result);
    }
  });
});

app.get("/suppliers", (req, res) => {
  db.query("select * from suppliers", (err, result) => {
    if (err == undefined) {
      console.log(result);
    }
  });
});

app.get("/products", (req, res) => {
  db.query(
    "select p.product_name, pa.unit_price, s.supplier_name " +
      "from products p join product_availability pa on(p.id = pa.prod_id) " +
      "join suppliers s on(s.id = pa.supp_id)",
    (err, result) => {
      if (err == undefined) {
        console.log(result);
      }
    }
  );
});

app.listen(3000, () => {
  console.log("port in listening");
});
