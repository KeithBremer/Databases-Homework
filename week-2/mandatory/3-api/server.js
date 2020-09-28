const express = require("express");
const app = express();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'allatif977A',
    port: 5432
});

app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});
app.get("/products", function(req, res) {
    pool.query('select p.product_name,pa.unit_price,s.supplier_name'+
    ' from products p join product_availability pa on(p.id=pa.prod_id)'+
    'join suppliers s on (pa.supp_id=s.id) ;', (error, result) => {
        res.json(result.rows);
    });
});

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});