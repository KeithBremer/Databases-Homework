const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Pool } = require("pg");
const { request } = require("express");

const db = new Pool({
  user: "leida",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "******",
  port: 5432,
});

app.get("/customers", function (req, res) {
  db.query(`select * from customers`, function (err, result) {
    if (err) {
      res.status(500).json("Could not retrive data from the database.");
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.get("/suppliers", function (req, res) {
  db.query(`select * from suppliers`, function (err, result) {
    if (err) {
      res.status(500).json("Could not retrive data from the database.");
    } else {
      res.json(result.rows);
    }
  });
});

//  Return all the product names along with their prices and supplier names.

app.get("/products", function (req, res) {
  db.query(
    `select p.product_name, a.unit_price, s.supplier_name
    from products p join product_availability a on(p.id=a.prod_id) join
    suppliers s on (a.supp_id=s.id)`,
    function (err, result) {
      if (err == undefined) {
        res.json(result.rows);
      } else {
        res.status(500).json("Could not retrive data from the database.");
      }
    }
  );
});

// list of products by name using a query parameter,This endpoint should still
// work even if you don't use the `name` query parameter!

app.get("/products/:name", function (req, res) {
  let prodName = req.params.name;

  db.query(
    `select p.product_name, a.unit_price, s.supplier_name
    from products p join product_availability a on(p.id=a.prod_id) join
    suppliers s on (a.supp_id=s.id) where p.product_name like '%'||$1||'%'`,
    [prodName],
    function (err, result) {
      if (err) {
        res.status(500).json("Could not retrive data from the database.");
      } else {
        res.status(200).json(result.rows);
      }
    }
  );
  app.get("/customers", function (req, res) {
    db.query("Select * from customers", (err, result) => {
      if (err == undefined) {
        res.json(result.rows);
      } else {
        res.status(500).json("Could not retrive data from the database.");
      }
    });
  });
});

//  Load a single customer by ID.

app.get("/customers/:id", function (req, res) {
  let custId = Number(req.params.id);
  db.query("SELECT * FROM customers WHERE id=$1", [custId], (err, result) => {
    if (err == undefined) {
      res.status(200).json({ customer: result.rows });
    } else {
      console.log(err);
      res.status(400).json(err);
    }
  });
});

// Add a new POST endpoint `/customers` to create a new customer with name, address, city and country.

app.post("/customers", function (req, res) {
  const custName = req.body.name;
  const custAddress = req.body.address;
  const custCity = req.body.city;
  const custCountry = req.body.country;

  db.query(
    "INSERT INTO customers (name, address, city, country) " +
      "VALUES ($1, $2, $3, $4) " +
      "RETURNING id",
    [custName, custAddress, custCity, custCountry],
    (err) => {
      if (err == undefined) {
        res.send("New customer added.");
      }
    }
  );
});

// Add a new POST endpoint `/products` to create a new product.

app.post("/products", (req, res) => {
  let newProduct = req.body.product_name;

  const query = "INSERT INTO products (product_name) " + "VALUES($1)";
  db.query(query, [newProduct], (err) => {
    if (err == undefined) {
      res.send("New product is added");
    } else {
      res.status(400).send(`An error has occured`);
    }
  });
});

//  create a new order (including an order date, and an order reference) for a customer.
//  Check that the customerId corresponds to an existing customer or return an error.

app.post("/customers/:customerId/orders", (req, res) => {
  const customerId = Number(req.params.customerId);
  const orderDate = req.body.order_date;
  const orderReference = req.body.order_reference;
  db.query(
    "select * from customers where id = $1",
    [customerId],
    (err, result) => {
      if (err == undefined) {
        if (result.rowCount == 0) {
          res.send("Customer not found!");
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
      if (err == undefined) {
        res.send("New order added.");
      }
    }
  );
});

//   Update an existing customer (name, address, city and country).

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
      if (err == undefined) {
        if (results.rowCount == 0) {
          res.send(`No customer with the id of ${customerId} found!`);
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
      if (err == undefined) {
        res.send("Client details was updated sucessfully!");
      }
    }
  );
});

//  Add a new DELETE endpoint `/customers/:customerId` to delete an existing
//  customer only if this customer doesn't have orders.

app.delete("/customers/:customerId", (req, res) => {
  let customerId = Number(req.params.customerId);
  db.query(
    "select * from orders where customer_id = $1",
    [customerId],
    (err, result) => {
      if (err == undefined) {
        if (result.rowCount > 0) {
          res.send("There are orders form this customer");
          return;
        }
      }
    }
  );
  db.query(
    "delete from customers where id = $1",
    [customerId],
    (err, results) => {
      if (err == undefined) {
        if (results.rowCount == 0) {
          res.send("We couldn't find this customer");
        } else {
          res.send("Customer details has been deleted");
        }
      }
    }
  );
});

// Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along with
// the items in the orders of a specific customer. Especially, the following information should be
//  returned: order references, order dates, product names, unit prices, suppliers and quantities.

app.get("/customers/:customerId/orders", (req, res) => {
  const custId = Number(req.params.customerId);
  let query = `select o.order_reference, o.order_date, p.product_name, a.unit_price, s.supplier_name, i.quantity
from orders o 
join order_items i on (o.id = i.order_id)
join product_availability a on (i.supplier_id = a.supp_id) and
(i.product_id = a.prod_id)
join products p on (a.prod_id = p.id)
join suppliers s on (a.supp_id = s.id)
where o.customer_id = $1")`;
  db.query(query, [custId], (err, result) => {
    if (err == undefined) {
      if (result.rowCount == 0) {
        res.status(400).send("No order was found");
      } else {
        res.json(result.rows);
      }
    }
  });
});

const PORT = 3015;
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
