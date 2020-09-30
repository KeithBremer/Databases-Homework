const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



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
       res.send("Customer doesnt exist");       
       
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


    if(newUnitPrice > 0){
        db.query("SELECT 1 FROM products WHERE id = $1",[newProdId], (error, result)=>{
        if(result.rowCount < 0){
            res.status(400).send("Product doesn't exist");
            
        } else{
            
            db.query("INSERT INTO product_availability (prod_id, unit_price) VALUES ($2,$3)",[newProdId, newUnitPrice], (error)=>{
                db.query("SELECT 1 FROM suppliers WHERE id = $4",[newSuppId], (error,result)=>{
                    if(result.rowCount < 0){
                        res.status(400).send("Supplier doesn't exist");
                    }else{
                        db.query("INSERT INTO product_availability (supp_id) VALUES ($5)",[newSuppId], (error)=>{
                            res.send("Product info added");
                        })
                    }
                })
            });
        }
    });
    }else{
        res.send("Enter a positive value");
    }
});

//customers/:customerId/orders
app.post("/customers/:id/orders", function(req,res){
    const customerId = req.params.id;
    const orderDate = req.body.orderDate;
    const orderReference = req.body.orderReference;

    db.query("SELECT 1 FROM customers WHERE id = $1",[customerId], (error, result)=>{
        if(error == undefined){
            if(result.rowCount < 0){
                res.send("Customer doesn't exist");
            } else{
                db.query("INSERT INTO orders (order_date, order_reference, customer_id)"+
                "VALUES ($2,$3,$1)",[orderDate, orderReference, customerId],(error)=>{
                    if(error === undefined){
                        res.send("New order added");
                    }else{
                        res.status(400).send("Bad request" + error);
                        console.log(error);
                    }
                    
                });
            }
        }else{
            res.status(400).send("Bad request" + error);
            console.log(error);
        }
    })

})

app.put("/customers/:id", function (req, res){
    const customerId = req.params.id;
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;

    db.query("UPDATE customers SET name=$2, address = $3, city = $4, country = $5 WHERE id=$1",
            [customerId, newName, newAddress, newCity, newCountry], (error)=>{
                if(error == undefined){
                    res.send(`Customer ${customerId} updated!`);
                } else{
                    console.log(error);
                    res.status(500).send("Bad Request");

                }
            });

});

app.delete("/orders/:orderId", function(req,res){
    const orderId = req.params.orderId;

    db.query("DELETE FROM orders WHERE id = $1",[orderId], (error)=>{
        if(error==undefined){
            res.send(`Order ${orderId} is deleted!`);
        }else{
            res.status(400).send("Bad Request " + error);
        }
    });
});

//delete an existing customer only if this customer doesn't have orders.
app.delete("/customers/:id", function(req,res){
    const customerId = req.params.id;
    db.query("SELECT 1 from orders WHERE customer_id = $1",[customerId], (error, result)=>{
        if(error == undefined){
            if(result.rowCount === 0){
                db.query("DELETE from customers WHERE id = $1",[customerId], (error)=>{
                    if(error == undefined){
                        res.send(`Customer ${customerId} deleted`)
                    }else{
                        res.status(400).send("Bad request " + error);
                        console.log(error)
                    }
                })
            }else{
                res.send(`Customer ${customerId} has order pending`);
            }
        }else{
            res.status(400).send("Bad Request " + error);
            console.log(error);
        }
    });
});

