const express = require("express");
const app = express();
// const bodyParser = require("body-parser")
// app.use(express.json)
const bodyParser = require("body-parser");
app.use(bodyParser.json());
// const db = require("./password")

const { Pool } = require('pg');

const db = new Pool({
    user: 'Altom',        // replace with your userName
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '123',
    port: 5432
});

//Home work of week-2 and week-3
//Add a new GET endpoint /customers to return all the customers from the database
app.get("/customers", function(req, res) {
    db.query('SELECT * FROM customers',
               (error, results) => {
                    res.json(results.rows);
    });
});

//Homework of week-3
//If you don't have it already, add a new GET endpoint /products to load all the product names along with their prices and supplier names.
app.get("/products", (req, res)=>{
  let name = req.query.name;
  let queryName = " ";
  let query = `SELECT p.product_name, pa.unit_price, s.supplier_name  FROM products p 
  join product_availability pa on (p.id=pa.prod_id) 
  join suppliers s on (s.id=pa.supp_id) `;
  let sqlParameter = [];
  if(name !== undefined){
    queryName = " where p.product_name like '%'|| $1 ||'%'";
    query = query + queryName;
    sqlParameter = [name]
  }
  db.query(query, sqlParameter, (error, results)=>{
      if(!error){
          res.json(results.rows)
          return;
      }
  })

})

//Update the previous GET endpoint /products to filter the list of products by name using a query parameter, for example products?name=Cup. This endpoint should still work even if you don't use the name query parameter!



//Add a new GET endpoint /customers/:customerId to load a single customer by ID.

app.get("/customers/:custId", (req, res)=>{
    let custId = Number(req.params.custId);
    let query = "Select * from customers where id = $1";
    db.query(query, [custId], (error, results)=>{
        if(!error){
            res.json(results.rows[0])
        }else{
            console.log(error)
        }
    })
})
//Add a new POST endpoint /customers to create a new customer with name, address, city and country.
app.post("/customers", (req, res)=>{
        let newName = req.body.name;
        let newAddress = req.body.address;
        let newCity = req.body.city;
        let newCountry = req.body.country;
        let query = "insert into customers (name, address, city, country) values($1, $2, $3, $4)";
    db.query(query, [newName, newAddress, newCity, newCountry], (error)=>{
       if(!error){
       res.json("congratulations the data has been instered successfully!");
       }
})
})
//Add a new POST endpoint /products to create a new product.
app.post("/products", (req, res)=>{
     let productName = req.body.productName;
     let query = "insert into products (product_name) values($1)"
     db.query(query, [productName], (error, results)=>{
         if(!error){
             res.json("The data has been inserted!")
         }
     })
})
//Add a new POST endpoint /availability to create a new product availability (with a price and a supplier id). Check that the price is a positive integer and that both the product and supplier ID's exist in the database, otherwise return an error.



app.post("/products/:id/availability", function (req, res) {
    const productId = Number(req.params.id);
    const price = req.body.unit_price;
    const supplierId = req.body.supp_id;
    if (!Number.isInteger(price) || price <= 0) {
      res.status(400).send("The price is invalid. Please enter a correct price");
      return;
    }
    db.query(
      "select * from products where id = $1",
      [productId],
      (err, results) => {
        if (!err) {
          if (results.rowCount == 0) {
            res.send("we didn't find your product");
         
          }
        }
      }
    );
    db.query(
      "select * from suppliers where id = $1",
      [supplierId],
      (err, results) => {
        if (!err) {
          if (results.rowCount == 0) {
            res.send("we didn't find your supplier");
           
          }
        }
      }
    );
    db.query(
      "insert into product_availability (prod_id, supp_id, unit_price)" +
        "values ($1, $2, $3)",
      [productId, supplierId, price],
      (err) => {
        if (!err) {
          res.json("insert ok");
        }
      }
    );
  });

//Add a new POST endpoint /customers/:customerId/orders to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.

app.post("/customers/:customerId/orders", (req, res)=>{
  let customerId = Number(req.params.customerId);
  let orderDate = req.body.order_date;
  let orderReFerence = req.body.oder_reference;

   db.query("select * from customers where id = $1", [customerId], (error, results)=>{
     if(!error){
       if(results.rowCount ==0){
        console.log(results.rows)
        res.json("Please enter a valid customer Id")
       }
      
     }
   })
   db.query("insert into orders (customer_id, order_date, order_reference) values($1, $2, $3)", [customerId,orderDate,orderReFerence], (err)=>{
     if(!err){
       res.json("inserted cool mate!")
     }
   })

})
//Add a new PUT endpoint /customers/:customerId to update an existing customer (name, address, city and country).
app.put("/customers/:customerId", (req, res)=>{
  let customerId = Number(req.params.customerId);
  let name = req.body.name;
  let address = req.body.address;
  let city = req.body.city;
  let country = req.body.country;
   db.query("select * from customers where id = $1", [customerId], (err, results)=>{
     if(!err){
       if(results.rowCount == 0){
         res.json("This id has no corresponding customer!")
       }
     }
   })

  db.query("update customers set name= $1, address = $2, city= $3, country= $4 where id = $5",[name, address, city, country, customerId], (err)=>{
    if(!err){
      res.json("updated ok!")
    }
  } )
})

//Add a new DELETE endpoint /orders/:orderId to delete an existing order along with all the associated order items.
app.delete("/orders/:orderId", (req, res)=>{
      let orderId = Number(req.params.orderId);
      db.query("select * from orders where id = $1", [orderId], (error, results)=>{
        if(!error){
          if(results.rowCount == 0){
            req.json("We did not find this order!")
          }
        }
      })
     db.query("delete from order_items where order_id= $1", [orderId], (error)=>{
       if(!error){
         db.query("delete from orders where id=$1", [orderId], (err)=>{
           if(!err){
             res.json("Order has been deleted!")
           }
         })
       }
     })   
     

})

//Add a new DELETE endpoint /customers/:customerId to delete an existing customer only if this customer doesn't have orders.

app.delete("/customers/:customerId", (req, res)=>{
  let customerId = Number(req.params.customerId);
    db.query("select * from orders where customer_id = $1", [customerId], (err, results)=>{
          if(!err){
            if(results.rowCount> 0){
              res.json("This customer has an order!")
            }
          }
        })
   
    db.query("delete from customers where id = $1", [customerId], (err, result)=>{
          if(!err){
            if(result.rowCount ==0){
              res.json("We did not find this cusmter, sorry mate!")
            }else{
              res.json("This customer has been deleted!")
            }
          }
        }) 

})



app.get("/customers/:customerId/orders", (req, res)=>{
  let customerId = Number(req.params.customerId);

  let query = `SELECT o.order_date, o.order_reference, p.product_name, pa.unit_price, s.supplier_name, oi.quantity from orders o join order_items oi on (o.id=oi.order_id)
  join product_availability pa on (oi.product_id=pa.prod_id and oi.supplier_id=pa.supp_id)
  join products p on (p.id=oi.order_id) join suppliers s on (s.id=oi.supplier_id) where o.customer_id = $1`

  db.query(query, [customerId], (error, result)=>{
    if(!error){
      res.json(result.rows)
    }
  })
})



app.listen(3005, function() {
    console.log("Server is listening on port 3005. Ready to accept requests!");
});