const express = require('express')
const app = express()
app.use(express.json())

const { Pool } = require('pg')

const db = new Pool({
    user: 'ORHAN',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '*****',
    port: 5432
})


app.get("/products", (req, res) => {
    const searchName = req.query.name
    searchName && searchName.toLowerCase()

    const attributes = [searchName]
    const sql1 = "select p.product_name, pa.unit_price, s.supplier_name from product_availability pa join products p on pa.prod_id = p.id join suppliers s on pa.supp_id = s.id  where Lower(p.product_name) like '%'|| $1 ||'%'";
    const sql2 = 'select p.product_name, pa.unit_price, s.supplier_name from product_availability pa join products p on pa.prod_id = p.id join suppliers s on pa.supp_id = s.id';

    attributes.some(i => i != undefined) ? db.query(sql1, attributes,
        (err, result) => {
            !err && res.json(result.rows)
        }) : db.query(sql2,
            (err, result) => {
                !err && res.json(result.rows);
            });
})

app.get('/customers', (req, res) => {
    const searchName = req.query.name
    const searchAddress = req.query.address
    const searchCity = req.query.city
    const searchCountry = req.query.country

    const attributes = [searchName, searchCountry, searchCity, searchAddress]
    const sql = "select * from customers where (name like '%'|| $1 ||'%' or ($1 is null and 1=1)) and (country like '%'|| $2 ||'%' or ($2 is null and 1=1)) and (city like '%'|| $3 ||'%' or ($3 is null and 1=1)) and (address like '%'|| $4 ||'%' or ($4 is null and 1=1))";

    attributes.some(i => i != undefined) ? db.query(sql, attributes,
        (err, result) => {
            console.log(err)
            res.json(result.rows)
        }) : db.query('select * from customers',
            (err, result) => {
                res.json(result.rows)
            })
});

app.get('/customers/:id/orders', (req, res) => {
    const id = req.params.id
    const sql = "select o.order_reference, o.order_date, p.product_name, s.supplier_name, pa.unit_price, oi.quantity from order_items oi join products p on p.id=oi.product_id join suppliers s on s.id=oi.supplier_id join orders o on o.id=oi.order_id join product_availability pa on oi.product_id=pa.prod_id and oi.supplier_id=pa.supp_id where o.customer_id=$1"
    db.query(sql, [id],
        (err, result) => {
            err ? res.status(500).send(err)
                : res.json(result.rows[0])
        })
})

app.get('/customers/:id', (req, res) => {
    const id = req.params.id
    db.query('select * from customers where id=$1', [id],
        (err, result) => {
            !err && res.json(result.rows[0])

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


app.post('/customers', (req, res) => {
    const name = req.body.name;
    const city = req.body.city;
    const address = req.body.address;
    const country = req.body.country;

    const sql = "insert into customers (name, city, address, country) values ($1, $2, $3, $4) returning id"
    const attributes = [name, city, address, country]
    db.query(sql, attributes, (err, result) => {
        err ? res.status(500).send(err)
            : res.json(`New customer created with ${result.rows[0].id}`);
    })
})

app.post('/products', (req, res) => {
    const name = req.body.product_name;
    const sql = "insert into products (product_name) values ($1) returning id"
    db.query(sql, [name], (err, result) => {
        err ? res.status(500).send(err)
            : res.json(`New product created with ${result.rows[0].id}`);
    })
})

app.post('/availability', (req, res) => {
    const prod_id = req.body.prod_id;
    const supp_id = req.body.supp_id;
    const price = req.body.unit_price;
    if (price < 0) {
        res.status(404).send('Price hast to be greter than 0');
        return
    }
    const sql_prod = "select * from product_availability where prod_id = $1"
    db.query(sql_prod, [prod_id], (err, result) => {
        if (err || result.rows.length == 0) {
            res.status(500).send(err, "Didnt match foreign key prod_id")
            return;
        }
    })
    const sql_supp = "select * from product_availability where supp_id = $1"
    db.query(sql_supp, [supp_id], (err, result) => {
        if (err || result.rows.length == 0) {
            res.status(500).send(err, "Didnt match foreign key supp_id")
            return;
        }
    })
    const sql = "insert into product_availability (prod_id, supp_id, unit_price) values ($1, $2, $3)"
    db.query(sql, [prod_id, supp_id, price], (err) => {
        console.log(err)
        err ? res.status(500).send(err)
            : res.send('Product added to available list')
    })
})

app.post('/customers/:id/orders', (req, res) => {
    const id = req.params.id
    const date = req.body.order_date;
    const reference = req.body.order_reference;

    db.query('select * from customers where id=$1', [id],
        (err, result) => {
            console.log(result)
            if (err || result.rows == 0) {
                res.status(500).send(err, 'There isn`t such a customer')
                return;
            }
        })

    const sql = "insert into orders (order_date, order_reference, customer_id) values ($1, $2, $3) returning id"
    db.query(sql, [date, reference, id], (err, result) => {
        console.log('errrr', err, result)
        err ? res.status(500).send(err)
            : res.send(`Order recorded on ${result.rows[0].id}`)
    })
})

app.put('/customers/:id', (req, res) => {
    const id = req.params.id
    const name = req.body.name;
    const city = req.body.city;
    const address = req.body.address;
    const country = req.body.country;
    const sql = "update customers set name = $1, address = $2, city = $3,country = $4 where id = $5"
    db.query(sql, [name, address, city, country, id],
        (err) => {
            err ? res.status(500).send(err)
                : res.send(`Customer ${id} info updated`)
        })
})

app.delete('/orders/:id', (req, res) => {
    const id = req.params.id
    db.query('delete from order_items where order_id=$1', [id],
        (err, result) => {
            if (err) {
                res.status(500).send(err)
                return
            } else {
                db.query('delete from orders where id=$1', [id],
                    (err) => {
                        if (err) {
                            res.status(500).send(err)
                            return
                        } else { res.send(`Order with id ${id} is deleted`) }
                    })
            }
        })
})

app.delete('/customers/:id', (req, res) => {
    const id = req.params.id
    db.query('select * from orders where customer_id=$1', [id],
        (err, result) => {
            if (!err && result.rows.length == 0) {
                db.query('delete from customers where id=$1', [id],
                    (err) => {
                        if (err) {
                            res.status(500).send(err)
                            return
                        } else { res.send(`Customer with id ${id} is deleted`) }
                    })
            } else {
                res.send("Cannot remove a customer that ordered before")
            }
        })
})

app.listen(5000, () => console.log(`Server is listening on 5000`))