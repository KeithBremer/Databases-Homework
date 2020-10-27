const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});
const { Pool } = require('pg');

const db = new Pool({
    user: 'razan',        // replace with you username
    host: 'localhost',
    database: 'cyf_hotel',
    password: '123',
    port: 5432

});

app.get("/customers", function (req, res) {
    var sql = "select * from customers";
    db.query(sql, function (err, result) {
        res.json({			// return rows to browser
            customers: result.rows
        });
    });
});