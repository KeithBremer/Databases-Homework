const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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
    const query = "select prod.*, supp.supplier_name " +
                  "FROM products prod join " +
                  "product_availability a on (a.prod_id = prod.id) join" +
                  "suppliers supp on (a.supp_id = supp.id)";
    db.query(query, (err, result) => {
      if (err == undefined) {
        res.json(result.rows);
      } else {
        res.status(400).json(err);
      }
    });
  });



app.get("/customers/:id", function (req, res){
    let custId = Number(req.params.id)
    db.query("SELECT * FROM customers WHERE id = $1", [custId],
    function(err, result) {
        res.json(result.rows);
    });
})


app.post("/customers", function(req,res){
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;

    const query =
    "INSERT INTO customers (name, address, city, country) " +
      "VALUES ($1, $2, $3, $4)";

  db.query(query, [newName, newAddress,newCity, newCountry], (err) => {
    res.send("Customer created.");
})

});

app.post("/products", function(req,res){
    const newProduct = req.body.product;
    const query =
    "INSERT INTO products (product_name) " +
      "VALUES ($1)";

      db.query(query, [newProduct], (err) => {
        res.send("product added.");
    })
})


app.post("/availability", function(req,res){
    const prodId = Number(req.body.prod_id)
    const suppId = Number(req.body.supp_id);
    const unitPrice = Number(req.body.unit_price);
  
    const query = 
    "INSERT INTO product_availability (prod_id, supp_id, unit_price) VALUES ($1, $2, $3)";

      db.query(query, [prodId, suppId, unitPrice], (err) => {
          if( unitPrice > 0){
            res.send("new product is available.");
          } else {
             res.send("cant add product with price less than 1!")
          }
    })
})



app.post("/customers/:id/orders", function(req,res){
  const custId = Number(req.params.id);
  const ordRef = req.body.orderRef;

  const query = "INSERT INTO orders (order_date, order_reference, customer_id) " +
  "  VALUES (current_date, $1, $2) ";
db.query(query, [ ordRef, custId], (err, result) => {
if (err == undefined) {
res.json("new order added");
} else {
res.json(err);
}
});
})

app.put("/customer/:id", function(req, res) {
  const custId = Number(req.params.id);
  const custName = req.body.name;
  const custAddr = req.body.address;
  const custCity = req.body.city;
  const custCountry = req.body.country;
      db.query("UPDATE customers SET name = $1, address = $2, city = $3, country = $4  WHERE id = $5", 
              [custName, custAddr, custCity, custCountry, custId],
        (err) => {
          if (err == undefined) {
            res.send("Customer updated successfully!!!");
          } else {
            res.status(500).json(err);
          }
      });
  });

  app.delete("/orders/:id", function(req, res) {
    const orderId = Number(req.params.id);
    db.query("DELETE FROM order_items WHERE order_id = $1", [orderId], (err, result) => {
      if (err == undefined) {
        db.query("DELETE FROM orders WHERE id = $1", [orderId], (err, result) => {
          if (err == undefined) {
            if (result.rowCount == 0) {
              res.status(400).send("No order with that id found.");
            } else  {
              res.status(200).send(`Order number ${orderId} is deleted along with its items`);
            } 
          }
        });
      } else {
        res.json(err);
      }
    
    });
  });

  app.delete("/customers/:id", function(req, res) {
    const custId = Number(req.params.id);
    db.query("SELECT 1 FROM orders WHERE customer_id = $1", [custId], (err, result) => {
      if (err == undefined) {
        if (result.rowCount > 0) {
          res.status(400).send(`Cannot delete customer (${custId}) : orders exist for that customer.`);
        } else {
          db.query("DELETE FROM customers WHERE id = $1", [custId], (err, result) => {
            if (err == undefined) {
                res.status(200).send(`Customer (${custId}) deleted!`);
              } else {
                res.status(404).send(`Customer (${custId}) not found.`)
              }
             
          });
        }
      } else {
        res.status(500).json(err);
      }
    });
  });


  app.get("/customers/:id/orders", function(req, res) {
    const custId =Number(req.params.id);
    db.query("SELECT o.order_reference, o.order_date, p.product_name, a.unit_price, s.supplier_name, i.quantity " +
             "FROM orders o JOIN " +
             "order_items i ON (i.order_id = o.id) JOIN " +
             "product_availability a ON (a.prod_id = i.product_id AND a.supp_id = i.supplier_id) JOIN " +
             "products p ON (p.id = a.prod_id) JOIN " +
             "suppliers s ON (s.id = a.supp_id) " +
             "WHERE o.customer_id = $1 " +
             "ORDER BY o.order_reference", [custId], (err, result) => {
      if (err == undefined) {
        res.status(200).json(result.rows);
      } else {
        res.status(500).json(err);
      }
    });
  });


app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});
