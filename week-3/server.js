const express = require("express");
const app = express();
const { Pool } = require('pg');
const bodyParser = require("body-parser");
app.use(bodyParser.json());
let supplierIdArr;
let productIdArr;
let customersIdArr;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'allatif977A',
    port: 5432
});
pool.query('SELECT * FROM suppliers', (error, result) => {
    supplierIdArr= result.rows.map(r =>r.id);})

    pool.query('SELECT * FROM products', (error, result) => {
         productIdArr= result.rows.map(r =>r.id);})

pool.query('SELECT * FROM customers', (error, result) => {
            customersIdArr= result.rows.map(r =>r.id);})
   
app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/customers/by_name/:name", function(req, res) {
    const cudtomerName=req.params.name.toLowerCase();
    pool.query("SELECT * FROM customers where lower(name) like '%'||$1||'%'",[cudtomerName], (error, result) => {
        res.json(result.rows);
    });
});

app.post("/suppliers" ,function (req,res){
    const newName=req.body.name;
    const newCountry=req.body.country;

    pool.query("SELECT 1 FROM suppliers WHERE supplier_name=$1", [newName],
            (err, result) => {
      if (result.rowCount > 0) {      // note the use of result.rowCount
        return res
          .status(400)
          .send("A supplier with that name  already exists!");
      } else {
    pool.query("insert into suppliers (supplier_name,country )"+
    "values($1,$2) returning id",[newName ,newCountry],(error,result)=> {
        if ((error)== undefined){
            //res.send("New customer added.");
            //res.json(result.rows[0].id);
            res.send("New supplier added.");
        }
        else {
        res.status(400).send("wrong request "+error)
    console.log(error);}
    });
}})
});

// delete order item
app.delete("/order_items/:id" ,function (req,res){
    const orderId=parseInt( req.params.id);

    pool.query("delete from order_items  where  id=$1"
 ,[orderId],(error)=> {
        if ((error)== undefined){
            
            res.send("order_items "+orderId+" deleted.");
        }
    });
});
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});
// app.get("/products", function(req, res) {
//     pool.query('select p.product_name,pa.unit_price,s.supplier_name'+
//     ' from products p join product_availability pa on(p.id=pa.prod_id)'+
//     'join suppliers s on (pa.supp_id=s.id) ;', (error, result) => {
//         res.json(result.rows);
//     });
// });


//Homework

//filter the list of products

app.get("/products", function(req, res) {
    const searchProduct = req.query.name;
    console.log(searchProduct);
    if (searchProduct!=undefined)
    pool.query("select p.product_name,pa.unit_price,s.supplier_name"+
    ' from products p join product_availability pa on(p.id=pa.prod_id)'+
    "join suppliers s on (pa.supp_id=s.id) where lower(p.product_name) like '%'||$1||'%'",[searchProduct.toLowerCase()], (error, result) => {
        res.json(result.rows);
    })
        else
        pool.query('select p.product_name,pa.unit_price,s.supplier_name'+
    ' from products p join product_availability pa on(p.id=pa.prod_id)'+
    'join suppliers s on (pa.supp_id=s.id) ;', (error, result) => {
        res.json(result.rows);
    });

    });
    //new GET endpoint `/customers/:customerId`

    app.get("/customers/:customerId", function(req, res) {
        const cudtomerId=parseInt(req.params.customerId);
        pool.query('SELECT * FROM customers where id =$1',[cudtomerId], (error, result) => {
            res.json(result.rows[0]);
        });
    });
//new POST endpoint `/customers`

    app.post("/customers" ,function (req,res){
        const newName=req.body.name;
        const newCity=req.body.city;
        const newAdd=req.body.address;
        const newCountry=req.body.country;

        pool.query("insert into customers (name,city ,address,country)"+
        "values($1,$2,$3,$4) returning id",[newName ,newCity ,newAdd,newCountry],(error,result)=> {
            if ((error)== undefined){
                //res.send("New customer added.");
                res.json(result.rows[0].id);
                //res.send("New customer added.");
            }
            else {
            res.status(400).send("wrong request "+error)
}
        });
    });
    
    // new POST endpoint `/products`
    app.post("/products" ,function (req,res){
        const newName=req.body.name;

        pool.query("insert into products (product_name)"+
        "values($1) returning id",[newName ],(error,result)=> {
            if ((error)== undefined){
                //res.send("New customer added.");
                res.json(result.rows[0].id);
                //res.send("New customer added.");
            }
            else {
            res.status(400).send("wrong request "+error)
}
        });
    });
    
    //new POST endpoint `/availability`
    app.post("/availability" ,function (req,res){
        const productId=parseInt( req.body.productId);
        const supplierId=parseInt(req.body.supplierId);
        const price=parseInt(req.body.price);
        if (price>0 && productIdArr.includes(productId) && supplierIdArr.includes(supplierId)){
        pool.query("insert into product_availability "+
        "values($1,$2,$3) ",[productId,supplierId,price ],(error,result)=> {
            if ((error)== undefined){
                res.send("New product_availability added.");
               // res.json(result.rows[0]);
                //res.send("New customer added.");
            }
            else {
            res.status(400).send("wrong request "+error)
}
        });
    }
    else
    res.status(400).send("the price must be positive and the id of the product and the suppliere must be existed  ")
    });
    

    app.post("/customers/:customerId/orders" ,function (req,res){
        const orderDate= req.body.orderDate;
        const orderRef=req.body.orderRef;
        const customerId=parseInt(req.params.customerId);
        if (customersIdArr.includes(customerId) ){
        pool.query("insert into orders (order_date,order_reference,customer_id) "+
        "values($1,$2,$3) ",[orderDate,orderRef,customerId ],(error,result)=> {
            if ((error)== undefined){
                res.send("New order added.");
               // res.json(result.rows[0]);
                //res.send("New customer added.");
            }
            else {
            res.status(400).send("wrong request "+error)
}
        });
    }
    else
    res.status(400).send("The  id of the customer  must be existed  ")
    });
    

    //PUT endpoint `/customers/:customerId`
    app.put("/customers/:customerId" ,function (req,res){
        const customerId=parseInt( req.params.customerId);
        const newName=req.body.name;
        const newCity=req.body.city;
        const newAdd=req.body.address;
        const newCountry=req.body.country;
        if (customersIdArr.includes(customerId) ){
                    pool.query("update customers set name=$1 ,city =$2,address=$3 ,country=$4"+
        "where id =$5"
     ,[newName,newCity ,newAdd,newCountry,customerId],(error)=> {
            if ((error)== undefined){
                
                res.send("customer "+customerId+" updated.");
            }
        });
    }else
    res.status(400).send("This id "+customerId  +" is not  existed  ")
    });

    //Delete order
    app.delete("/orders/:orderId" ,function (req,res){
        const orderId=parseInt( req.params.orderId);
    
        pool.query("delete from order_items  where  order_id=$1"
     ,[orderId],(error)=> {
            if ((error)== undefined){
                pool.query("delete from orders  where  id=$1"
     ,[orderId],(error)=> {
            if ((error)== undefined){
                
                res.send("order "+orderId+"  is deleted.");
            }
        });
             
            }
        });
        
    });

    //get all orders of specific customer
    app.get("/customers/:customerId/orders", function(req, res) {
        const cudtomerId=parseInt(req.params.customerId);
        pool.query(' select o.order_reference,o.order_date,p.product_name,oi.quantity,s.supplier_name,pa.unit_price  '+
        ' from orders o  join order_items oi  on(o.id=oi.order_id)'+
        ' join product_availability pa on(oi.product_id=pa.prod_id and oi.supplier_id=pa.supp_id)'+
        ' join products p  on(p.id=pa.prod_id)'+
        ' join suppliers s on(s.id=pa.supp_id)'+

        ' where o.customer_id=$1 ',[cudtomerId], (error, result) => {
            res.json(result.rows);
        });
    });

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});