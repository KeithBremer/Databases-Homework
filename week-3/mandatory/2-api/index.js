const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const {Pool} = require('pg');
const {query} = require('express');
const e = require('express');
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cyf_ecommerce',
  password: 'Loveyouta55u',
  port: 5432,
});

app.get('/products', function (req, res) {
  db.query(
    'SELECT p.*, s.supplier_name ' +
      'FROM products p JOIN ' +
      'product_availability a ON (a.prod_id = p.id) JOIN ' +
      'suppliers s ON (a.supp_id = s.id)',
    (error, result) => {
      if (error == undefined) {
        res.json(result.rows);
      } else {
        res.json({err: error});
      }
    }
  );
});

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

//Add a new POST endpoint`/availability` to create a new product
//availability(with a price and a supplier id).
//Check that the price is a positive integer and that both the product and
//supplier ID's exist in the database, otherwise return an error.

app.post('/availability/:prod_id', (req, res) => {
  const newProductId = parseInt(req.params.prod_id);
  const newSupplierId = req.body.supp_id;
  const newUnitPrice = req.body.unit_price;
  if (newUnitPrice <= 0) {
    return res.status(400).send('unit price should be a positive number');
  }
  db.query(
    'select * from product_availability where prod_id=$1 or supp_id=$2',
    [newProductId, newSupplierId]
  ).then((result) => {
    if (result.rows.length < 1) {
      return res
        .status(400)
        .send(
          'You can not enter new product for which supplier id and product id does not exit'
        );
    } else {
      const query =
        'insert into product_availability  (prod_id,supp_id,unit_price)' +
        'VALUES ($1,$2,$3)';

      db.query(query, [newProductId, newSupplierId, newUnitPrice])
        .then(() => res.send('row added'))
        .catch((e) => res.send(e));
    }
  });
});

// Add a new POST endpoint `/customers/:customerId/orders` to create a
//new order(including an order date, and an order reference)
//for a customer.Check that the customerId corresponds to an existing customer
//or return an error.

app.post('/customers/:customerId/orders', (req, res) => {
  const newCustomerId = parseInt(req.params.customerId);
  const newOrderDate = req.body.order_date;
  const newOrderReference = req.body.order_reference;

  db.query(
    'select c.* ,o.* from customers c join orders o on c.id=o.customer_id where o.customer_id=$1',
    [newCustomerId]
  ).then((result) => {
    if (result.rows.length < 1) {
      return res
        .status(400)
        .send('You can not enter an order for a customer that doesnt exist');
    } else {
      const query =
        'insert into orders  (order_date,order_reference,customer_id) VALUES ($1,$2,$3)';

      db.query(query, [newOrderDate, newOrderReference, newCustomerId])
        .then(() => res.send('order added'))
        .catch((e) => res.send(e));
    }
  });
});

// Add a new PUT endpoint `/customers/:customerId` to update an
//existing customer(name, address, city and country).

app.put('/customers/:customerId', (req, res) => {
  const newCustomerId = parseInt(req.params.customerId);
  const newName = req.body.name;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newCountry = req.body.country;
  db.query(
    'update customers set name =$2 ,address=$3 ,city=$4 ,country=$5 where id=$1 ',
    [newCustomerId, newName, newAddress, newCity, newCountry]
  )
    .then(() => res.send(`Customer ${newCustomerId} updated sucessfully`))
    .catch((error) => console.log(error));
});

//Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along with all
//the associated order items.

app.delete('/orders/:orderId', (req, res) => {
  const newOrderId = parseInt(req.params.orderId);
  db.query('delete from order_items where order_id=$1', [newOrderId])
    .then(() => {
      db.query('delete from orders where id =$1 ', [newOrderId])
        .then(() => res.send(`order ${newOrderId} has been deleted`))
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

//Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer
//doesn't have orders.

app.delete('/customers/:customerId', (req, res) => {
  const newCustomerId = parseInt(req.params.customerId);
  db.query(
    'select o.* ,c.* from  orders o join customers c on o.customer_id=c.id where c.id=$1',
    [newCustomerId]
  ).then((result) => {
    if (result.rows.length >= 1) {
      return res
        .status(400)
        .send('A customer can not be deleted whose orders already exist');
    } else {
      db.query('delete from customers where id=$1', [newCustomerId])
        .then(() =>
          res.send(`customers ${newCustomerId} has successfully deleted`)
        )
        .catch((error) => console.log(error));
    }
  });
});

//Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along with
//the items in the orders of a specific customer.Especially,
//the following information should be returned: order references, order dates, product names, unit prices,
//suppliers and quantities.

app.get('/customers/:customerId/orders', (req, res) => {
  const newCustomerId = parseInt(req.params.customerId);
  db.query(
    `select o.order_reference, o.order_date, p.product_name,
   pa.unit_price, s.supplier_name, oi.quantity
 from orders o 
join order_items oi on o.id = oi.order_id 
join product_availability pa on oi.supplier_id = pa.supp_id and
oi.product_id = pa.prod_id 
join products p on p.id = pa.prod_id
join suppliers s on s.id = pa.supp_id
where o.customer_id =$1`,
    [newCustomerId]
  ).then((result) => {
    if (result.rows.length < 1) {
      return res
        .status(400)
        .send('no information exist for this customer in database!');
    } else {
      res.json(result.rows).catch((e) => console.log(e));
    }
  });
});

app.listen(4000, function (req, res) {
  console.log('server is listening on port 4000 ready to accept request');
});
