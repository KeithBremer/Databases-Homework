const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
app.use(express.json());
const { Pool } = require("pg");
const { response } = require("express");

const db = new Pool({
  user: "laetitianode",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "123",
  port: 5432,
});

app.get("/suppliers", function (req, res) {
  db.query("Select * from suppliers", (error, results) => {
    console.log(results);
    res.json(results);
  });
});

// load all products names, prices and supplier name
app.get("/products", function (req, res) {
  const name = req.query.name;
  let queryName = " ";
  let sqlQuery =
    "Select pa.unit_price, s.supplier_name, p.product_name from products p" +
    " join product_availability pa on p.id = pa.prod_id join suppliers s on s.id = pa.supp_id ";
  let sqlParameter = [];
  if (name !== undefined) {
    queryName = " where p.product_name like '%'|| $1 ||'%'";
    sqlQuery = sqlQuery + queryName;
    sqlParameter = [name];
  }
  db.query(sqlQuery, sqlParameter, (error, results) => {
    if (!error) {
      res.json(results.rows);
      return;
    }
  });
});

app.get("/customers", function (req, res) {
  db.query("Select * from customers", (error, results) => {
    console.log(results);
    res.json(results);
  });
});
//load a single customer by ID.
app.get("/customers/:id", function (req, res) {
  const id = parseInt(req.params.id);
  db.query("Select * from customers where id = $1", [id], function (
    err,
    results
  ) {
    res.json({ customer: results.rows[0] });
  });
});

// app.get("/customers/:id", function (req, res) {
//   db.query("Select * from customers ", (error, results) => {
//     console.log(results);
//     res.json(results);
//   });
// });

//to create a new customer with name, address, city and country.
app.post("/customers", function (req, res) {
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;
  const country = req.body.country;
  db.query(
    "insert into customers (name, address, city, country)" +
      // "values ($1, $2, $3, $4) returning name",
      "values ($1, $2, $3, $4) returning name, address, city, country",
    [name, address, city, country],
    (err, result) => {
      console.log(err);
      console.log({ customer: result.rows[0] });

      if (err == undefined) {
        // res.json("insert OK");
        res.json({ customer: result.rows[0] });
      }
    }
  );
});
//create a new product
app.post("/products", function (req, res) {
  let newProductName = req.body.product_name;
  db.query(
    "insert into products (product_name)" + "values ($1)",
    [newProductName],
    (err) => {
      if (!err) {
        res.json("insert ok");
      }
    }
  );
});
//see all products
app.get("/products", function (req, res) {
  db.query("Select * from products", (error, results) => {
    console.log(results);
    res.json(results);
  });
});

//create a new product availability
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
          res.send("we didn't find your product");
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
          res.send("we didn't find your supplier");
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
        res.json("insert ok");
      }
    }
  );
});

//create a new order for an existing customer
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
          res.send("We couldn't find this customer");
          return;
        }
      }
    }
  );
  db.query(
    "insert into orders (order_date, order_reference, customer_id)" +
      "values ($1, $2, $3)",
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
          res.send("we didn't find this customer");
          return;
        }
      }
    }
  );
  db.query(
    "update customers set name = $1, address = $2, city = $3, country = $4" +
      "where id = $5",
    [name, address, city, country, customerId],
    (err) => {
      if (!err) {
        res.send("succeeded");
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
        res.send("We couldn't find your order");
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
// });
//delete an existing customer
app.delete("/customers/:customerId", (req, res) => {
  let customerId = Number(req.params.customerId);
  db.query(
    "select * from orders where customer_id = $1",
    [customerId],
    (err, result) => {
      if (!err) {
        if (result.rowCount > 0) {
          res.send("There is an order attached to this customer");
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
          res.send("We couldn't find your customer");
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

app.listen(3012, function () {
  console.log("Server is listening on port 3012.");
});
