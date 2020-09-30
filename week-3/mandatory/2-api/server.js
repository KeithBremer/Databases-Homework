const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());


const db = new Pool({
    user: 'nawal',
	host: 'localhost',
	database: 'cyf_ecommerce',
	password: 'open123',
	port: 5432
});


app.get("/",  (req, res) => {
    res.send("ecommerce server.  Ask for /customers, /suppliers, /products etc.");
  });

//endpoint /customers to return all the customers from the database

app.get("/customers",(req, res)=>{

      db
      .query("SELECT * FROM customers order by name", [])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
})

app.get("/suppliers",(req, res)=>{
   
          db
          .query("SELECT * FROM suppliers", [])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));

      
    })


    app.get("/products",(req, res)=>{
   //const prodName = req.query.name;
   //const query = `SELECT product_name from products where name = $1`
    const sql = `SELECT p.product_name, pa.unit_price, s.supplier_name 
   from product_availability pa join products p on pa.prod_id = p.id 
   join suppliers s on pa.supp_id = s.id`;
        db
          .query(sql, [])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));
      
    })

    //endpoint /customers/:customerId to load a single customer by ID

     app.get("/customers/:id", function (req, res) {
        const custId = parseInt(req.params.id);
         
       
      
        db
          .query("SELECT * FROM customers WHERE id=$1", [custId])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));
     })

     app.post("/customers", (req,res)=>{
        const name = req.body.name;
        const address = req.body.address;
        const city = req.body.city; 
        const country = req.body.country
        const sqlQuery = `insert into customers (name, address, city, country) 
        values ($1,$2,$3,$4) returning name, address, city, country`
        db.query(sqlQuery, [name, address, city, country],
        (err)=>{ 
          if (!err) {  
          res.status(200).json({"message":`New customer created ` })
        }
      }) 
    })
     
    app.post("/products", (req,res)=>{
      const newProduct = req.body.product_name
      const sqlQuery = `insert into products (product_name) values ($1)`
      
      db.query(sqlQuery, [newProduct],
      (err)=>{ 
        if (!err) {  
        res.status(200).json({"message":`Added new Product` })
      }
    }) 
  })

  app.post("/products/:id/availability", function (req, res) {
    const productId = Number(req.params.id);
    const price = Number(req.body.unit_price);
    const supplierId = Number(req.body.supp_id);
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
            res.send("No product found");
            return;
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
            res.send("No Supplier found");
            return;
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
          res.json("Updated");
        }
      }
    );
  });


  app.post("/customers/:customerId/orders", (req, res) => {
    const customerId = Number(req.params.customerId);
    const orderDate = req.body.order_date;
    const orderReference = req.body.order_reference;
    db.query(
      "select * from customers where id = $1",
      [customerId],
      (err, result) => {
        if (!err) {
          if (result.rowCount == 0) {
            res.send("No customer found");
            return;
          }
        }
      }
    );
    db.query(
      `insert into orders (order_date, order_reference, customer_id)
        values ($1, $2, $3)`,
      [orderDate, orderReference, customerId],
      (err) => {
        if (!err) {
          res.send("New order added to customer account");
        }
      }
    );
  });

//update an existing customer
app.put("/customers/:customerId", (req, res) => {
  const customerId = Number(req.params.customerId);
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;
  const country = req.body.country;
  db.query(
    "select * from customers where id = $1",
    [customerId],
    (err, results) => {
      if (!err) {
        if (results.rowCount == 0) {
          res.send("No customer found");
          return;
        }
      }
    }
  );
  db.query(
    `update customers set name = $1, address = $2, city = $3, country = $4
      where id = $5`,
    [name, address, city, country, customerId],
    (err) => {
      if (!err) {
        res.send("record updated");
      }
    }
  );
});

//delete an existing order
app.delete("/orders/:orderId", (req, res) => {
  let orderId = Number(req.params.orderId);
  db.query("select * from orders where id = $1", [orderId], (err, result) => {
    if (!err) {
      if (result.rowCount == 0) {
        res.send("No order found");
      }
    }
  });
  db.query("delete from order_items where order_id = $1", [orderId], (err) => {
    if (!err) {
      db.query("delete from orders where id = $1", [orderId], (err) => {
        if (!err) {
          res.send("item deleted");
        }
      });
    }
  });
//   db.query("delete from order_items where order_id = $1", [orderId])
//     .then((result) => db.query("delete from orders where id = $1", [orderId]))
//     .then((result) => {
//       res.send("item deleted");
//       return;
//     })
//     .catch((error) => res.send("something went wrong"));
 });

 //delete an existing customer
app.delete("/customers/:customerId", (req, res) => {
  let customerId = Number(req.params.customerId);
  db.query(
    "select * from orders where customer_id = $1",
    [customerId],
    (err, result) => {
      if (!err) {
        if (result.rowCount > 0) {
          res.send("No order found for this Customer");
          return;
        }
      }
    }
  );
  db.query(
    "delete from customers where id = $1",
    [customerId],
    (err, results) => {
      if (!err) {
        if (results.rowCount == 0) {
          res.send("No customer found");
        } else {
          res.send("customer has been deleted");
        }
      }
    }
  );
});

//load all the orders along with the items in the orders of a specific customer

app.get("/customers/:customerId/orders", (req, res) => {
  const customerId = Number(req.params.customerId);
  let sqlQuery = `select o.order_reference, o.order_date, p.product_name, pa.unit_price, s.supplier_name, oi.quantity
 from orders o 
join order_items oi on o.id = oi.order_id 
join product_availability pa on oi.supplier_id = pa.supp_id and
oi.product_id = pa.prod_id 
join products p on p.id = pa.prod_id
join suppliers s on s.id = pa.supp_id
where o.customer_id = $1;`;
  db.query(sqlQuery, [customerId], (err, results) => {
    if (!err) {
      if (results.rowCount == 0) {
        res.status(403).send("no customer number found");
      } else {
        res.json(results.rows);
      }
    }
  });
});

app.listen(3001, function() {
	console.log("Server is listening on port 3001.");
})