const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());


const db = new Pool({
    user: 'nawal',
	host: 'localhost',
	database: 'cyf_ecommerce',
	password: 'open123',
	port: 5432
});


app.get("/",  (req, res) => {
    res.send("ecommerce server.  Ask for /customers, /suppliers, /products etc.");
  });

//endpoint /customers to return all the customers from the database

app.get("/customers",(req, res)=>{

      db
      .query("SELECT * FROM customers order by name", [])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
})

app.get("/suppliers",(req, res)=>{
   
          db
          .query("SELECT * FROM suppliers", [])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));

      
    })


    app.get("/products",(req, res)=>{
   //const prodName = req.query.name;
   //const query = `SELECT product_name from products where name = $1`
    const sql = `SELECT p.product_name, pa.unit_price, s.supplier_name 
   from product_availability pa join products p on pa.prod_id = p.id 
   join suppliers s on pa.supp_id = s.id`;
        db
          .query(sql, [])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));
      
    })

    //endpoint /customers/:customerId to load a single customer by ID

     app.get("/customers/:id", function (req, res) {
        const custId = parseInt(req.params.id);
         
       
      
        db
          .query("SELECT * FROM customers WHERE id=$1", [custId])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));
     })

     app.post("/customers", function(req,res){
        const name = req.body.name;
        const address = req.body.address;
        const city = req.body.city; 
        const country = req.body.country
        db.query(`insert into customers (name, address, city, country) 
        values ($1,$2,$3,$4) returning id`, [name, address, city, country],
        function(err, result){ res.json({"message":`New customer created with ${result.rows[0].id}` })
      }) 
    })
     



app.listen(3000, function() {
	console.log("Server is listening on port 3000.");
})