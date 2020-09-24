const express = require('express')
const app = express()

const { Pool } = require('pg')

const db = new Pool({
    user: 'ORHAN',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '****',
    port: 5432
})


app.get("/products", (req, res) => {
    const sql = 'SELECT p.product_name, pa.unit_price, s.supplier_name from product_availability pa join products p on pa.prod_id = p.id join suppliers s on pa.supp_id = s.id';
    db.query(sql, [],
        (error, result) => {
            res.json(result.rows);
        });
})

app.get('/customers', (req, res) => {
    const searchName = req.query.name
    const searchAddress = req.query.address
    const searchCity = req.query.city
    const searchCountry = req.query.country
    console.log(searchName)
    const attributes = [searchName, searchCountry, searchCity, searchAddress]
    const sql = 'select * from customers where (name = $1 or ($1 is null and 1=1)) and (country = $2 or ($2 is null and 1=1)) and (city = $3 or ($3 is null and 1=1)) and (address = $4 or ($4 is null and 1=1));';

    attributes.some(i => i != undefined) ? db.query(sql, attributes,
        (err, result) => {
            res.json(result.rows)
        }) : db.query('select * from customers',
            (err, result) => {
                res.json(result.rows)
            })
});

app.get('/customers/:id', (req, res) => {
    const id = req.params.id
    db.query('select * from customers where id=$1', [id],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json(result.rows)
            }
        })
})

app.get('/suppliers', (req, res) => {
    const searchName = req.query.name
    const searchCountry = req.query.country

    const attributes = [searchName, searchCountry]
    const sql = 'select * from suppliers where (supplier_name = $1 or ($1 is null and 1=1)) or (country = $2 or ($2 is null and 1=1));';

    attributes.some(i => i != undefined) ? db.query(sql, attributes,
        (err, result) => {
            res.json(result.rows)
        }) : db.query('select * from suppliers',
            (err, result) => {
                res.json(result.rows)
            })
});

app.listen(5000, () => console.log(`Server is listening on 5000`))