const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const uri2sql = require('./uri2sql.js');

app.listen(3000, function(){
    console.log("Server is listening on port 3000. Ready to accept requests!");
} );

const {Pool} = require ('pg');

const db = new Pool({
    user: 'farhana',
    host:'localhost',
    database: 'cyf_ecommerce',
    pasword: '',
    port: 5432
});

// // get product names, their prices and suppliers + query paramaters
app.get("/products", function(req, res){
    let name = req.query.name;
    
      if(name === undefined){
        db.query('SELECT p.product_name, pa.unit_price, s.supplier_name FROM products p JOIN product_availability pa ON (p.id = pa.prod_id) JOIN suppliers s ON(pa.supp_id = s.id)',
        (error, result) => {
            if(error === undefined){
                res.json(result.rows);
            } else{
                res.status(400).send("Bad request "+ error);
            }
            
        });
      } else{
        let newName = name.toLowerCase();
          db.query("SELECT * FROM products WHERE Lower(product_name) LIKE '%'||$1||'%'",[newName], (error, result)=>{
              if(error === undefined){
                res.json(result.rows);
              } else{
                  res.status(400).send("Bad request " + error);
              }
              
          });
      }
    
});

//get customer by ID
app.get("/customers/:customerid", function(req,res){
    const customerId = parseInt(req.params.customerid);
    if(customerId !== undefined){
        db.query("SELECT * from customers WHERE id =$1",[customerId], (error, result) =>{
            if(error === undefined){
                res.json(result.rows);
            } else{
                res.status(400).send("Bad Request " + error );
            }
            
        });
        

    } else{
        

        
    }
    
});

    //get all customers

app.get("/customers", function(req, res){
    db.query('SELECT id, name, address,city, country FROM  customers',
         (error, result) => {
             if(error === undefined){
                res.json(result.rows);
             } else{
                 res.status(400).send("Bad Request "+ error);
             }
             
         });
});

//POST new customer

app.post("/customers", function(req,res){
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city
    const newCountry = req.body.country;

    db.query("INSERT INTO customers (name,address,city,country) VALUES ($1,$2,$3,$4) returning id",
     [newName,newAddress,newCity,newCountry], (error, result)=>{
         if(error == undefined){
             res.send("New Customer Added" + result.rows[0].id);
         }else {
             res.status(400).send("Bad request" + error);
             console.log(error);
         }
         

     });
});    


//add new product

app.post("/products", function(req,res){
    const newName = req.body.name;

    db.query("INSERT INTO products (product_name) VALUES ($1) returning id",
     [newName], (error, result)=>{
         if(error == undefined){
             res.send("New Product Added" + result.rows[0].id);
         }else {
             res.status(400).send("Bad request" + error);
             console.log(error);
         }         

     });
});    


//Post product availability
app.post("/availability", function(req,res){
    const newProdId = req.body.prodId;
    const newSuppId = req.body.suppId;
    const newUnitPrice = req.body.unitPrice;

    db.query("SELECT 1 FROM products WHERE id = $1",[newProdId], (error, result)=>{
        if(result.rowCount >0){
            db.query("INSERT INTO product_availability (prod_id) VALUES ($2)",[newProdId]);
        } else{
            res.status(400).send("Prod id doesn't exist");
        }
    });

    db.query("SELECT 1 FROM suppliers WHERE id = $3", [newSuppId], (error, result)=>{
        if(result.rowCount > 0){
            db.query("INSERT INTO product_availability (supp_id) VALUES($4)",[newSuppId]);
        }else{
            res.status(400).send("Supplier doesn't exist");
        }
    })
    if(newUnitPrice <= 0){
        res.send("Please enter a valid value");
    }else{
        db.query("INSERT INTO product_availability (unit_price) VALUES ($5)",[newUnitPrice]);
    }
})