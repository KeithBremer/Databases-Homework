const express = require("express");
const pool = require("./db");
const app = express();
const PORT = process.env.PORT || 3009;

// Query to get all products and thier corresponding prices and suppliers
const productsQuery = `select product_name ,s.supplier_name ,pa.unit_price from products p ,
                    product_availability pa ,suppliers s  
                    where p.id =pa.prod_id     
                      and pa.supp_id =s.id`;

// api End point to return all customers
app.get("/customers", (req, res) => {
  pool.query("select * from customers", (err, result) => {
    if (err) return console.log(err);

    res.json({ customers: result.rows });
  });
});

// api End point to return all suppliers
app.get("/suppliers", (req, res) => {
  pool.query("select * from suppliers", (err, result) => {
    if (err) return console.log(err);

    res.json({ suppliers: result.rows });
  });
});

// api End point to return all products
app.get("/products", (req, res) => {
  pool.query(productsQuery, (err, result) => {
    if (err) return console.log(err);

    res.json({ products: result.rows });
  });
});

app.listen(PORT, () => `Express server running on port ${PORT}`);
