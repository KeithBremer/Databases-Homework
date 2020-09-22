const express = require("express")
const app=express()
const {Pool}=require('pg')
const db= new Pool({
        user:'hedyeh',
        host:'localhost',
        database:'cyf_ecommerce',
        password:'hedyeh1365',
        port:'5432'
    }
);

app.get("/customers",function(req,res){
    db.query("select * from customers",function (err,result){
        if(err==undefined){
            console.log(result)
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

app.get("/products",function(req,res){
    db.query("select p.product_name, a.unit_price, s.supplier_name from "+
     " products p join product_availability a on(p.id=a.prod_id)"+
     " join suppliers s on (s.id=a.supp_id)",function (err,result){
        if(err==undefined){
            console.log(result)
        }
    })
})


app.listen(3000,()=>{
console.log('port is listening...')
})

