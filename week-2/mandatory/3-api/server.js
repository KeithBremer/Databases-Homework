const express = require ('express');
const app = express ();
const {Pool} = require ('pg');

const db = new Pool ({
  user: 'postgres', // replace with you username
  host: 'localhost',
  database: 'cyf_ecommerce',
  password: 'Loveyouta55u',
  port: 5432,
});

app.get ('/customers', function (req, res) {
  db.query ('select * FROM customers', (error, result) => {
    res.json (result.rows);
  });
});

app.listen (3000, function () {
  console.log ('Server is listening on port 3000. Ready to accept requests!');
});
