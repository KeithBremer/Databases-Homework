const express = require('express');
const app = express();
const {Pool} = require('pg');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const db = new Pool({
  user: 'postgres', // replace with your username
  host: 'localhost',
  database: 'postgres',
  password: 'Loveyouta55u',
  port: 5432,
});

app.get('/customers', function (req, res) {
  db.query('select * FROM customers', (error, result) => {
    res.json(result.rows);
  });
});

// app.get('/customers/:id', function (req, res) {
//   const custId = parseInt(req.params.id);
//   db.query(
//     'SELECT * FROM customers WHERE id = $1',
//     [custId],
//     (error, result) => {
//       res.json(result.rows[0]);
//     }
//   );
// });

app.get('/customers/:id', function (req, res) {
  const custId = parseInt(req.params.id);
  db.query('select * from customers where id =$1', [custId], (error) => {
    res.json(result.rows[0]);
  });
});

// app.post('/customers', function (req, res) {
//   const newnName = req.body.name;
//   const newEmail = req.body.email;
//   const newPhone = req.body.phone;
//   const query =
//     'insert into customers (name,email,phone)' + 'values ($1,$2,$3)';
//   db.query(query, [newnName, newEmail, newPhone], (err) => {
//     res.send('customer created');
//   });
// });



app.post('/customers', function (req, res) {
  const newName = req.body.name;
  const newEmail = req.body.email;
  const newPhone = req.body.phone;
  const query =
    'Insert into customers (name,email,phone)' + 'values ($1,$2,$3)';
  db.query(query, [newName, newEmail, newPhone], (err, result) => {
    if (err == undefined) {
      res.send('inserted ok');
    } else {
      res.status(500).json({error: err});
    }
  });
});

app.get('/customers/name/:name', function (req, res) {
  const custName = req.params.name;
  db.query(
    "SELECT * FROM customers WHERE name LIKE $1 || '%'",
    [custName],
    (error, result) => {
      res.json(result.rows);
    }
  );
});

app.listen(3001, function () {
  console.log('Server is listening on port 3001. Ready to accept requests!');
});
