const express = require("express");
const app = express();
app.use(express.json())

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'razan',
    port: 5432
});

app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    })
    })
    //////////////////////////////////////////////////////////////
    app.get("/orders", function(req, res) {
        pool.query('SELECT * FROM orders', (error, result) => {
            res.json(result.rows);
        })
        })
        /////////////////////////////////////////////////////////////
    app.get("/products", function(req, res) {
        pool.query('SELECT * FROM products', (error, result) => {
            res.json(result.rows);
        })
        })
        ///////////////////////////////////////////////////////////
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    })
})
///////If you don't have it already, add a new GET endpoint /products to load all the product names along with their supplier names.///////
    app.get("/products", function(req, res) {
        pool.query( 'SELECT products.product_name, supplier_name FROM products ' +
            ' INNER JOIN suppliers ON products.supplier_id = suppliers.id ', (error, result) => {
            res.json(result.rows);
 
})
})
//////Update the previous GET endpoint /products to filter the list of products by name using a query parameter, for example /products?name=Cup. This endpoint should still work even if you don't use the name query parameter!////////
app.get("/products", function(req, res) {
console.log(req.query.name);
    const name = req.query.name
  
let query1= "SELECT products.product_name, supplier_name FROM products INNER JOIN suppliers ON products.supplier_id = suppliers.id" 
let query2 = "SELECT products.product_name, supplier_name FROM products INNER JOIN suppliers ON products.supplier_id = suppliers.id where name  like $1" 

   if(name){  /////////there is problem in this one it return undefined from the postman ////// 
pool
.query(query2, [`%${name.toLowerCase()}%`])
.then((result) => res.json(result.rows))
.catch((e) => console.error(e))

}
else{
    pool.query(query1, (error, result)=>{

 res.json(result.rows)
    }
    )
    }
})

//////Add a new GET endpoint /customers/:customerId to load a single customer by ID.////////
app.get("/customers/:customerId", function (req, res) {
    const custId =Number(req.params.customerId);

    if(custId<0){
        return res.status(400).send(" please enter positive number")
    }
  
    pool
      .query("SELECT * FROM customers WHERE id=$1", [custId])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
  });
  //////////// get order by orders id //////////////////////////////////////////////////
  app.get("/orders/:order_id", function (req, res) {
    const orderId =Number(req.params.order_id);

    if(orderId<0){
        return res.status(400).send(" please enter positive number")
    }
  
    pool
      .query("SELECT * FROM orders WHERE id=$1", [orderId])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
  });
////Add a new POST endpoint /customers to create a new customer.///////
  app.post("/customers", function (req, res) {
    console.log(req.body);
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;

    pool
    .query("SELECT * FROM customers WHERE name=$1", [newName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An customers with the same name already exists!");
      } else {
    const query =
      "INSERT INTO customers (name, address, city,  country) VALUES ($1, $2, $3, $4)";
  
    pool
      .query(query, [newName, newAddress, newCity,newCountry ])
      .then(() => res.send("Customer created!"))
      .catch((e) => console.error(e));
    }
          });
      });
      //////// Add a new POST endpoint /products to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.///////
      app.post("/products", function (req, res) {
        console.log(req.body);
        const newName = req.body.product_name ;
        const newPrice = req.body.unit_price ;
        const newId  = req.body.supplier_id ;

        if(!Number.isInteger(newPrice) || newPrice <= 0){
        return res.status(400).send(" please enter positive number")
    
        }
        pool
        .query("SELECT * FROM products WHERE supplier_id=$1", [newId])
        .then((result) => {
          if (result.rows.length < 0) {
            return res
              .status(400)
              .send("An supplier doesn't exists!");
          } else {
        const query =
          "INSERT INTO products(product_name, unit_price, supplier_id) VALUES ($1, $2, $3)";
      
        pool
          .query(query, [newName, newPrice, newId ])
          .then(() => res.send("Customer created!"))
          .catch((e) => console.error(e));
        }
              });
          });
          ////////Add a new POST endpoint /customers/:customerId/orders to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error/////////
          app.post("/customers/:customerId/orders", function (req, res) {
            console.log(req.body);
            const custId = req.params.customer_id ;
            const newDate = req.body.order_date  ;
            const newRef = req.body.order_reference ;
            
    
            pool
            .query("SELECT * FROM orders WHERE customer_id =$1", [custId])
            .then((result) => {
              if (result.rows.length < 0) {
                return res
                  .status(400)
                  .send("An  customers doesn't exists!");
              } else {
                   //////////////////HOW TO KEEP THE ORIGINAL VALUE FOR CUSTOMER_ID///////////////
            const query =
              "INSERT INTO orders (order_date, order_reference ,customer_id ) VALUES ($1, $2,$3 )";
          
            pool
              .query(query, [newDate, newRef, custId ])
              .then(() => res.send("Order created!"))
              .catch((e) => console.error(e));
            }
                  });
              });
              ///////////////Add a new PUT endpoint /customers/:customerId to update an existing customer (name, address, city and country)./////////////////
              app.put("/customers/:customerId", function (req, res) {
                const custId = req.params.customerId;
                const newName = req.body.name;
                const newAddress = req.body.address;
                const newCity = req.body.city;
                const newCountry = req.body.country;
      
                pool
                  .query("UPDATE customers SET name=$2 , address =$3, city= $4, country= $5 WHERE id=$1  ", [ custId,newName, newAddress, newCity, newCountry])
                  .then((result) => res.json(result.rows))
                  .catch((e) => console.error(e));
              });
              /////////Add a new DELETE endpoint /orders/:orderId to delete an existing order along all the associated order items./////////////////////
              app.delete("/orders/:order_id", function (req, res) {
                const orderId = req.params.order_id;
              
                pool
                  .query("DELETE FROM order_items WHERE order_id =$1", [orderId])
                  .then(() => {
                    pool
                      .query("DELETE FROM orders WHERE id=$1", [orderId])
                      .then(() => res.send(`Customer ${orderId} deleted!`))
                      .catch((e) => console.error(e));
                  })
                  .catch((e) => console.error(e));
              });




              ////////Add a new DELETE endpoint /customers/:customerId to delete an existing customer only if this customer doesn't have orders.///
              app.delete("/customers/:customer_id", function (req, res) {
                const customerId = req.params.customer_id;

                
                pool
                 .query("SELECT * FROM orders WHERE customer_id =$1", [customerId])
  
                .then((result) => {
                    if (result.rows.length > 0) {
                      return res
                        .status(400)
                        .send("This customer has order!");
                    } else {

                       pool 
                        .query("DELETE FROM customers WHERE id =$1", [customerId])
                        .then(() => res.send(`Customer ${customerId} deleted!`))
                        .catch((e) => console.error(e));
                    }
                  });
              });
////Add a new GET endpoint /customers/:customerId/orders to load all the orders along the items in the orders of a specific customer. Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities.////
              app.get("/customers/:customer_id/orders", function (req, res) {
                console.log(req.body);
                const custId = req.params.customer_id ;
                
                pool
                .query("SELECT orders.order_reference,  orders.order_date, products.product_name, products.unit_price, suppliers.supplier_name , order_items.quantity  FROM orders   INNER JOIN order_items ON order_items.order_id = orders.id INNER JOIN products    ON order_items.product_id = products.id INNER JOIN suppliers   ON products.supplier_id = suppliers.id where customer_id=$1", [custId])
                .then((result) => res.json(result.rows))
                .catch((e) => console.error(e));
              })
app.listen(3000, ()=> {
    console.log("Server is listening on port 3000.");
})
            