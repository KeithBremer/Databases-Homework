const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 3011;
const { Pool } = require("pg");

const db = new Pool({
  user: "*****",
  host: "localhost",
  database: "ecommerace",
  password: "******",
  port: 5432,
});

// filter lists of products
app.get("/products", (req, res) => {
  let name = req.query.name;
  db.query(
    "SELECT p.product_name, pa.unit_price, s.supplier_name FROM products p JOIN product_availability pa ON (p.id = pa.prod_id) JOIN suppliers s ON (s.id = pa.supp_id ) WHERE lower(p.product_name) LIKE '%' || $1 || '%'",
    [name.toLowerCase()],
    (error, result) => {
      console.log(result);
      res.json(result.rows);
    }
  );
});

// retrieve a single customer by ID
app.get("/customers/:id", (req, res) => {
  let customerId = Number(req.params.id);
  db.query(
    "SELECT * FROM customers WHERE id =$1",
    [customerId],
    (error, result) => {
      console.log(result);
      res.json(result.rows[0]);
    }
  );
});

//create a new customer
app.post("/customers", (req, res) => {
  let newName = req.body.name;
  let newAddress = req.body.address;
  let newCity = req.body.city;
  let newCountry = req.body.country;

  const query =
    "INSERT INTO customers (name, address, city, country) " +
    "VALUES ($1, $2, $3, $4)";
  db.query(query, [newName, newAddress, newCity, newCountry], (err) => {
    res.send("New Customer was added");
  });
});

// create a new product
app.post("/products", (req, res) => {
  let newProduct = req.body.product_name;

  const query = "INSERT INTO products (product_name) " + "VALUES($1)";
  db.query(query, [newProduct], (err) => {
    res.send("New product is added");
  });
});

// create a new product availability
app.post("/availability", (req, res) => {
  let productSupplier = Number(req.body.supp_id);
  let productPrice = Number(req.body.unit_price);
  if (productPrice > 0) {
    const query =
      "INSERT INTO product_availability (supp_id, unit_price) " +
      "VALUES ($1,$2) RSTURNING id AND supp_id and id IS NOT NULL";
    db.query(query, [productSupplier, productPrice], (err) => {
      res.send("Product Availability added");
    });
  }
});

// create a new order

app.post("/customers/:customerId/orders", (req, res) => {
  let customerId = Number(req.params.customer_id);
  let date = req.body.order_date;
  let reference = req.body.order_reference;

  db.query(
    "SELECT * FROM customers WHERE id = $1",
    [customerId],
    (err, result) => {
      if (result.rowsCount === 0) {
        res.send("No Customer with such an id");
      }
    }
  );
  db.query(
    "INSERT INTO orders (order_date, order_reference, customer_id) " +
      "VALUES ($1, $2, $3)",
    [date, reference, customerId],
    (err) => {
      res.send("Order added");
    }
  );
});

// update a customer details
app.put("/customers/:id", (req, res) => {
  const custId = Number(req.params.id);
  const changedName = req.body.name;
  const changedAddress = req.body.address;
  const changedCity = req.body.city;
  const changedCountry = req.body.country;
  db.query(
    "UPDATE customers SET name=$2, address=$3, city=$4, country=$5 WHERE id $1",
    [custId, changedName, changedAddress, changedCity, changedCountry],
    (error) => {
      // if (!error) {
      res.send(`Customer ${custId} updated`);
      // } else {
      //   res.status(500).json({ error: error });
      // }
    }
  );
});

// delete order
app.delete("/orders/:orderId", (req, res) => {
  let orderId = Number(req.params.orderId);
  db.query(
    "DELETE FROM order_items WHERE order_id = $1",
    [orderId],
    (error) => {
      res.send(`Customers ${orderId} deleted!`);
    }
  );
});

// delete customer with no order
app.delete("customers/:customerId", (req, res) => {
  let customerId = Number(req.params.customerId);
  db.query(
    "DELETE o.* FROM orders o JOIN customers c ON (o.customer_id = c.id WHERE c.id = £1",
    [customerId],
    (error, result) => {
      if (result.rows) {
        res.send(`Customer ${customerId} has been deleted`);
      }
    }
  );
});

app.listener = app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});
