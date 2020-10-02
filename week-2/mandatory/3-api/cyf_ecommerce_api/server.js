const express = require("express")
const app=express()
app.use(express.json())
const {Pool}=require('pg')
const db= new Pool({
        user:'hedyeh',
        host:'localhost',
        database:'cyf_ecommerce',
        password:'hedyeh1365',
        port:'5432'
    }
);

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


app.get("/customers",function(req,res){
    db.query("select * from customers",function (err,result){
        if(err==undefined){
            console.log(result)
            res.status(200).json({result})
        }
    })
})

app.get("/customers/:id", (req,res)=>{
    const custId=parseInt(req.params.id)
    db.query("SELECT * FROM customers WHERE id = $1", [custId],(err,result)=>{
        if (err==undefined){
            res.status(200).json({customer:result.rows[0]})
        }
    })
})
// Add a new POST endpoint `/customers` to create a new customer with name, address, city and country.
app.post("/customers",(req,res)=>{
const NewName=req.body.name
const NewAddress=req.body.address
const NewCity=req.body.city
const NewCountry=req.body.country
const query="INSERT INTO customers (name, address, city, country) " +
"VALUES ($1, $2, $3, $4)";
db.query(query,[NewName,NewAddress,NewCity,NewCountry],(err,result) => {
    if(err==undefined)
    res.send("Customer created.");
    else{
        res.status(500).json({error: err});
    }
  })
})



app.get("/suppliers",function(req,res){
    db.query("select * from customers",function (err,result){
        if(err==undefined){
            console.log(result)
        }
    })
})
// Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!

app.get('/products', function (req, res) {
    const name = (req.query.name);
    if (name) {
      db.query(
        "select p.product_name, a.unit_price, s.supplier_name from"+
        " products p join product_availability a on(p.id=a.prod_id)"+
        " join suppliers s on (s.id=a.supp_id)"+
         " where product_name like '%'|| $1 || '%'",
        [capitalizeFirstLetter(name)],
        (error, result) => {
          if (error == undefined){
            res.status(200).send({products:result.rows});
          }
        }
      );
    } else {
      db.query("select p.product_name, a.unit_price, s.supplier_name from"+
      " products p join product_availability a on(p.id=a.prod_id)"+
      " join suppliers s on (s.id=a.supp_id)", (error, result) => {
        if (error == undefined) {
            res.status(200).json({products:result.rows})
        }
      });
    }
  });

//Add a new POST endpoint `/products` to create a new product.
app.post("/products",(req,res)=>{
    const NewProduct=req.body.product_name
   const query="INSERT INTO products (product_name) VALUES ($1)"
        db.query(query,[NewProduct],(err)=>{
        if(err==undefined){
            res.send("Product created."); 
        }else{
            res.status(500).json({error: err});
        }
    })
})

// Add a new POST endpoint `/availability` to create a new product availability (with a price and a supplier id). Check that the price is a positive integer and that both the product and supplier ID's exist in the database, otherwise return an error.
app.post("/availability/:prod_id",(req,res)=>{
    const prod_id=parseInt(req.params.prod_id)
    const NewPrice=req.body.unit_price
    const NewSupplierId=req.body.supp_id
const query="INSERT INTO product_availability (prod_id,unit_price,supp_id) VALUES ($1,$2,$3) "
if(NewPrice>0){
db.query(query,[prod_id,NewPrice,NewSupplierId],(err)=>{
    if(err==undefined){
        res.send("New price updated")
    }else{
        res.status(500).json({error: err});
    }})
}else{
    res.send("Please enter a valid Price")
}})


// Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.
app.post("/customers/:customerId/orders",(req,res)=>{
const customer_id=parseInt(req.params.customer_id)
const reference=req.body.order_reference
const query="INSERT INTO orders (order_date,order_reference,customer_id) VALUES (current_date,$1,$2,)"
db.query(query,[reference,customer_id],(err,result)=>{
        if(err==undefined){
            newCustomerId = result.rows[0].id;
            res.status(200).json({newCustomerId:newCustomerId})
        }else{
            console.log(err);
            res.status(500).json({error: err});
        }
})})

// Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).
app.put("/customers/:customerId",(req,res)=>{
    const NewName=req.body.name
    const NewAddress=req.body.address
    const NewCity=req.body.city
    const NewCountry=req.body.country
    db.query("UPDATE customers SET name=$1,address=$2,city=$3,country=$4",[NewName,NewAddress,NewCity,NewCountry],(err,result)=>{
        if(err==undefined){
            res.status(200).json("Customer Updated")
        }else{
            res.status(500).json({error:err})
        }
    })
})

//Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along with all the associated order items.
app.delete("/orders/:id",(req,res)=>{
    const orderId=Number(req.params.id)
    db.query("DELETE FROM order_items where order_id=$1",[orderId],(err,result)=>{
        if(err==undefined){
            if(result.rowCount==0){
                res.status(400).send("There isn't any order with this ID.");
            }else if(result.rowCount==1){
                res.status(200).json("Order is deleted")
            }
        }else{
            res.status(500).json({error:err})
        }
    })
})

//Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders.
app.delete("/customers/:id",(req,res)=>{
    const custId=parseInt(req.params.id)
    db.query("SELECT 1 FROM orders where customer_id=$1",[custId],(err,result)=>{
        if(err==undefined){
            if(result.rowCount>0){
                res.status(400).send(`You are not able to delete customer (${custId}) because there are some orders.`);
            }else{
                db.query("DELETE FROM customers WHERE id= $1",[custId],(err0,result)=>{
                    if (err==undefined){
                        if(result.rowCount==1){
                            res.status(200).json("Customer is deleted")
                    }else{
                        res.status(404).send(`Customer not found.`)  
                    }
                 }else{
                    res.status(500).json({error:err0})}
                 })
                }
        }else{
        res.status(500).json({error:err})
     }
    })
   })

   // Add a new GET endpoint `/customers/:customerId/orders`

   app.get("/customers/:id/orders", function(req, res) {
    const custId = parseInt(req.params.id);
    db.query("SELECT o.order_reference, o.order_date, p.product_name, a.unit_price, s.supplier_name, i.quantity " +
             "  FROM orders o JOIN " +
             "       order_items i ON (i.order_id = o.id) JOIN " +
             "       product_availability a ON (a.prod_id = i.product_id AND a.supp_id = i.supplier_id) JOIN " +
             "       products p ON (p.id = a.prod_id) JOIN " +
             "       suppliers s ON (s.id = a.supp_id) " +
             "  WHERE o.customer_id = $1 " +
             "  ORDER BY o.order_reference", [custId], (err, result) => {
      if (err == undefined) {
        res.status(200).json(result.rows);
      } else {
        res.status(500).json(err);
      }
    });
  });

app.listen(3000,()=>{
console.log('port is listening...')
})

