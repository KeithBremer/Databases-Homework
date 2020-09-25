const express = require("express");
const app = express();

app.listen(3000, function(){
    console.log("Server is listening on port 3000. Ready to accept requests! ")
});

const {Pool} = require ('pg');

const db = new Pool({
    user: 'farhana',
    host:'localhost',
    database: 'cyf_ecommerce',
    pasword: '',
    port: 5432
});

//get all customers

app.get("/customers", function(req, res){
    db.query('SELECT id, name, address,city, country FROM  customers',
         (error, result) => {
             res.json(result.rows);
         });
});

//get all suppliers

app.get("/suppliers", function(re,res){
    db.query('SELECT id, supplier_name, country FROM suppliers',
       (error, result) => {
           res.json(result.rows);
       });
});

// get product names, their prices and suppliers
app.get("/products", function(req, res){
    db.query('SELECT p.product_name, pa.unit_price, s.supplier_name FROM products p JOIN product_availability pa ON (p.id = pa.prod_id) JOIN suppliers s ON(pa.supp_id = s.id)',
    (error, result) => {
        res.json(result.rows);
    });
});

