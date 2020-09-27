const express = require("express");
const app = express();
const db = require("./db");
app.use(express.json());

// ---- Welcome Page-----

app.get("/", (req, res) => {
  res.send(`<h1>Wellcome to CYF Ecommerce API<h1>
  <h3>You can query ...</h3>
  <h4>all customers:  '/customers' <br>
  with id:  '/customers/id_no' <br>
  with string search in names:  '/customers/by_name/str' <h4> 
  <h4>You can also query suppliers '/suppliers' or products '/products'</h4> `);
});

// ------ Get All Customers-----------

app.get("/customers", function (req, res) {
  db.query(`SELECT * FROM customers`)
    .then((result) => {
      if (result) res.json(result.rows);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// --------- Get All Suppliers -----------

app.get("/suppliers", function (req, res) {
  db.query(`SELECT * FROM suppliers`, (error, result) => {
    if (!error) res.json(result.rows);
  });
});

// -----------Get Customers by ID-------------

app.get("/customers/:id", function (req, res) {
  let custId = Number(req.params.id);
  db.query("SELECT * FROM customers WHERE id = $1", [custId], function (
    error,
    result
  ) {
    if (!error) res.json(result.rows[0]);
  });
});

// ------------Filter Customers by Name search--------

app.get("/customers/by_name/:name", (req, res) => {
  let custName = req.params.name.toLowerCase();
  db.query(
    "SELECT * FROM customers WHERE LOWER(name) LIKE '%'||$1||'%'",
    [custName],
    (err, result) => {
      if (err == undefined) {
        res.status(200).json({ customers: result.rows });
      } else {
        console.log(err);
        res.status(400).json(err);
      }
    }
  );
});

// Get Products & filtered Products --- !! Tried 2 dif ver but couldnt figure it out !!---

// ---- Solution 1------------

app.get("/products", function (req, res) {
  const name = req.query.name;

  let allProducts = `SELECT products.product_name, pa.unit_price price, sup.supplier_name
  FROM products JOIN product_availability pa ON products.id=pa.prod_id
  JOIN suppliers sup ON (pa.supp_id=sup.id)`;

  let filteredProducts =
    allProducts + " WHERE LOWER(products.product_name) LIKE '%'||$1||'%'";

  !name
    ? db.query(allProducts, [], (error, result) => {
        if (!error) res.json(result.rows);
      })
    : db.query(filteredProducts, [name], (error, result) => {
        if (!error) res.json(result.rows);
      });
});

// ---- Solution 2------------

app.get("/products/name", function (req, res) {
  const name = req.query.name;

  let query = `SELECT products.product_name, pa.unit_price price, sup.supplier_name
  FROM products JOIN product_availability pa ON products.id=pa.prod_id
  JOIN suppliers sup ON (pa.supp_id=sup.id)`;

  let param = [];

  if (name !== undefined) {
    query = `SELECT products.product_name, pa.unit_price price, sup.supplier_name
  FROM products JOIN product_availability pa ON products.id=pa.prod_id
  JOIN suppliers sup ON (pa.supp_id=sup.id) WHERE LOWER(products.product_name) LIKE '%'||$1||'%'`;

    param = [name];
  }

  db.query(query, param)
    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});

// ------ Create New Cust -----------

app.post("/customers", (req, res) => {
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
      if (err === undefined) {
        res.send("New customer added");
      } else {
        console.log(err);
        res.status(500).json({ error: err });
      }
    }
  );
});

// --------- Create New Product ---------

app.post("/products", (req, res) => {
  const productName = req.body.product_name;

  db.query(
    "INSERT INTO products (product_name) VALUES ($1) RETURNING id",
    [productName],
    (err) => {
      if (!err) res.send("New Producted Added");
      res.status(500).json({ error: err });
      console.log(err);
    }
  );
});

// ----------Create New Availability -----

app.post("/availability", (req, res) => {
  const suppId = req.body.supp_id;
  const price = req.body.unit_price;

  db.query(`INSERT INTO product_availability (supp_id, unit_price) VALUES ($1, $2) RETURNING id
  WHERE (unit_price typeof int AND unit_price > 0) AND supp_id and id IS NOT NULL`);
});

const PORT = 6060;

app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
