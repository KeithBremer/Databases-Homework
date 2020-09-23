const express = require("express");
const app = express();
const { Pool } = require("pg");

const db = new Pool({
  user: "laetitianode",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "123",
  port: 5432,
});

app.get("/suppliers", function (req, res) {
  db.query("Select * from suppliers", (error, results) => {
    console.log(results);
    res.json(results);
  });
});

app.get("/products", function (req, res) {
  db.query(
    "Select pa.unit_price, s.supplier_name, product_name from products p join product_availability pa on p.id = pa.prod_id join suppliers s on s.id = supp_id",
    (error, results) => {
      console.log(results);
      res.json(results);
    }
  );
});

app.get("/customers", function (req, res) {
  db.query("Select * from customers", (error, results) => {
    console.log(results);
    res.json(results);
  });
});

app.listen(3009, function () {
  console.log("Server is listening on port 3009.");
});
