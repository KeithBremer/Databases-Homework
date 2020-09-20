const express = require("express");
const app = express();

const { Pool } = require('pg');

const db = new Pool({
    user: 'sulaiman',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '12133405',
    port: 5432
});

app.get("/customers", function(req, res) {
    db.query("SELECT * FROM customers",
               (error, result) => {
                   res.json(result.rows);
    });
});

app.get("/suppliers", function(req, res) {
    db.query("SELECT * FROM suppliers",
               (error, result) => {
                   res.json(result.rows);
    });
});


app.get("/products", function(req, res) {
    db.query("select pro.product_name, pro_avai.unit_price , supp.supplier_name from products pro join product_availability pro_avai on (pro.id = pro_avai.prod_id) join suppliers supp on (supp.id = pro_avai.supp_id)",
               (error, result) => {
                   res.json(result.rows);
    });
});

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});