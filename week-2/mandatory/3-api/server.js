//**Note** I created the NodeJS application  on a separate directory
// and then copied and pasted server.js file here. I hope this is fine.
// It works as expected :)

const express = require("express");
const app = express();

const { Pool } = require("pg");

const db = new Pool({
  user: "leida",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "*******",
  port: 5432,
});

app.get("/customers", function (req, res) {
  db.query(`select * from customers`, function (err, result) {
    if (err) {
      res.status(500).json("Could not retrive data from the database.");
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.get("/suppliers", function (req, res) {
  db.query(`select * from suppliers`, function (err, result) {
    if (err) {
      res.status(500).json("Could not retrive data from the database.");
    } else {
      res.json(result.rows);
    }
  });
});

//  Return all the product names along with their prices and supplier names.

app.get("/products", function (req, res) {
  db.query(
    `select p.product_name, a.unit_price, s.supplier_name 
    from products p join product_availability a on(p.id=a.prod_id) join
    suppliers s on (a.supp_id=s.id)`,
    function (err, result) {
      if (err) {
        res.status(500).json("Could not retrive data from the database.");
      } else {
        res.json(result.rows);
      }
    }
  );
});

const PORT = 3004;
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
