const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const {Pool} = require('pg');
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cyf_ecommerce',
  password: 'Loveyouta55u',
  port: 5432,
});

// app.get('/products', function (req, res) {
//   db.query('select * from products', (error, result) => {
//     if (error == undefined) {
//       res.json(result.rows);
//     }
//     else {
//       res.json({ err: error });
//     }
//   });
// });

app.get('/products', function (req, res) {
  const productName = req.query.name;
  if (productName != undefined) {
    db.query(
      "select * from products where product_name like $1 || '%'",
      [productName],
      (error, result) => {
        if (error == undefined) {
          res.send(result.rows);
        }
      }
    );
  } else {
    db.query('select * from products', (error, result) => {
      if (error == undefined) {
        res.send(result.rows);
      }
    });
  }
});

//Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.
app.get('/customers/:customerId', (req, res) => {
  const newId = parseInt(req.params.customerId);
  if (!Number.isInteger(newId) || newId <= 0) {
    return res.status(400).send('customer Id should be a positive number');
  }

  db.query('select * from customers where id=$1', [newId], (error, result) => {
    if (error == undefined) {
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.send('customer with the provided id does not exist in database');
        console.log(error);
      }
    } else {
      res.status(500).json({error: error});
    }
  });
});

//Add a new POST endpoint `/customers` to create a new customer with name, address, city and country.
app.post('/customers', (req, res) => {
  const newName = req.body.name;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newCountry = req.body.country;
  const query =
    'INSERT INTO customers (name, address, city, country) ' +
    'VALUES ($1, $2, $3, $4)';
  db.query(query, [newName, newAddress, newCity, newCountry], (err, result) => {
    if (err == undefined) {
      res.json('inserted ok');
    } else {
      res.status(500).json({error: err});
    }
  });
});

// Add a new POST endpoint `/products` to create a new product.
app.post('/products', (req, res) => {
  const newProductName = req.body.product_name;
  if (newProductName.length < 2) {
    res.json('product name cannot be less than 3 characters');
  }

  db.query('select * from  products where product_name= $1', [
    newProductName,
  ]).then((result) => {
    if (result.rows.length > 0) {
      return res
        .status(400)
        .send('An hotel with the same name already exists!');
    } else {
      const query = 'Insert into products(product_name) values ($1)';
      db.query(query, [newProductName])
        .then(() => res.send('hotel created'))
        .catch((e) => res.send(e));
    }
  });
});

app.listen(6000, function (req, res) {
  console.log('server is listening on port 6000 ready to accept request');
});
