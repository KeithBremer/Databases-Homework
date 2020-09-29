const express = require("express");
const app = express();


const { Pool } = require('pg');

const db = new Pool({
    user: 'Altom',        // replace with you username
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '123',
    port: 5432
});


//Add a new GET endpoint /customers to return all the customers from the database
app.get("/customers", function(req, res) {
    db.query('SELECT * FROM customers',
               (error, results) => {
                    res.json(results.rows);
    });
});

//Add a new GET endpoint /suppliers to return all the suppliers from the database
app.get("/suppliers", (req, res)=>{
    db.query("SELECT * FROM suppliers", (error, result)=>{
        res.json(result.rows)
    })
})

//(STRETCH GOAL) Add a new GET endpoint /products to return all the product names along with their prices and supplier names.
app.get("/products", (req, res)=>{
    db.query("SELECT p.product_name, pa.unit_price, s.supplier_name from products p join product_availability pa on (p.id=pa.prod_id) join suppliers s on (s.id=pa.supp_id);", (error, result)=>{
        res.json(result.rows)
    })
})
//Return all  orders, order date, refence,  and their IDs, supplier name and country s where their suppliers based China

app.get("/orderSuppplier", (req, res)=>{
    db.query("SELECT o.id, o.order_date, order_reference, S.supplier_name, S.country from orders o join order_items oi on(o.id=oi.order_id) join suppliers s on (s.id=oi.supplier_id) WHERE UPPER(s.country) = 'CHINA';", (error, result)=>{
        console.log(result)
        res.json(result.rows)
    })
})

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});