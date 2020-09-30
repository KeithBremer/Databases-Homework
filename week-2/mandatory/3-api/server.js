const express = require("express");
const app = express();

const { Pool } = require("pg");

const db = new Pool({
  user: "admin", // replace with you username
  host: "localhost",
  database: "cyf_ecommerce",
  password: "password",
  port: 5432,
});
app.use(express.json());

let serverError = "We have a server error, please contact site admin.";

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customers", (error, result) => {
    if (error) {
      console.log("pg error code:", error.code);
      res.status(500).json(serverError);
      throw error;
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.get("/customers/:customerID", (req, res) => {
  let id = parseInt(req.params.customerID);
  db.query("SELECT * FROM customers where id = $1", [id], (error, result) => {
    if (error) {
      console.log("pg error code:", error.code);
      res.status(500).json(serverError);
      throw error;
    } else {
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json("There is no customer with this ID");
      }
    }
  });
});

app.get("/customers/by-name/:name", (req, res) => {
  let name = req.params.name.toLowerCase();

  db.query(
    "SELECT * FROM customers where Lower(name) LIKE $1 || '%'",
    [name],
    (error, result) => {
      if (error) {
        console.log("pg error code:", error.code);
        res.status(500).json(serverError);
        throw error;
      } else {
        res.status(200).json(result.rows);
      }
    }
  );
});

app.get("/suppliers", (req, res) => {
  db.query("SELECT * FROM suppliers", (error, result) => {
    if (error) {
      console.log("pg error code:", error.code);
      res.status(500).json(serverError);
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.get("/products", (req, res) => {
  let name = req.query.name;
  if (name) {
    name.toLowerCase();
    db.query(
      "SELECT p.product_name, a.unit_price , s.supplier_name from products p join product_availability a on p.id = a.prod_id join suppliers s on s.id = a.supp_id where Lower(p.product_name) like '%'||$1||'%'",
      [name],
      (error, result) => {
        if (error) {
          console.log("pg error code:", error.code);
          res.status(500).json(serverError);
        } else {
          res.status(200).json(result.rows);
        }
      }
    );
  } else {
    db.query(
      "SELECT p.product_name, a.unit_price , s.supplier_name from products p join product_availability a on p.id = a.prod_id join suppliers s on s.id = a.supp_id",
      (error, result) => {
        if (error) {
          console.log("pg error code:", error.code);
          res.status(500).json(serverError);
        } else {
          res.status(200).json(result.rows);
        }
      }
    );
  }
});

app.post("/customers", (req, res) => {
  let name = req.body.name,
    address = req.body.address,
    city = req.body.city,
    country = req.body.country;
  let sql =
    "INSERT INTO customers (name, address, city, country) " +
    "VALUES ($1, $2, $3, $4) returning id";
  let attributes = [name, address, city, country];

  db.query(sql, attributes, (error, result) => {
    if (error) {
      console.log("pg error code:", error.code);
      res.status(500).json(serverError);
    } else {
      res
        .status(201)
        .json(`A new customer is created with the ID ${result.rows[0].id}`);
    }
  });
});

app.post("/products", (req, res) => {
  let product = req.body.productName;
  let sql = "insert into products (product_name)" + "values ($1) returning id";
  db.query(sql, [product], (error, result) => {
    if (error) {
      console.log("pg error code:", error.code);
      res.status(500).json(serverError);
    } else {
      res.status(201).json(`Product added with the ID ${result.rows[0].id}`);
    }
  });
});

app.post("/availability", (req, res) => {
  let price = parseInt(req.body.price),
    product = parseInt(req.body.product_id),
    supplier = parseInt(req.body.supplier_id);
  let sql_prod = "select id from products where id = $1 ",
    sql_supp = " select id from suppliers where id  = $1 ",
    sql_insert =
      "insert into product_availability (prod_id,supp_id,unit_price)" +
      "values ($1,$2,$3)";
  if (price > 0) {
    db.query(sql_supp, [supplier], (error, result) => {
      if (error) {
        console.log("pg error code:", error.code);
        res.status(500).json(serverError);
      } else if (result.rows.length > 0) {
        db.query(sql_prod, [product], (error, result) => {
          if (error) {
            console.log("pg error code:", error.code);
            res.status(500).json(serverError);
          } else if (result.rows.length > 0) {
            db.query(
              sql_insert,
              [product, supplier, price],
              (error, result) => {
                res.status(201).json("Product price added.");
              }
            );
          } else {
            res.status(404).json("Can't find a product with this ID");
          }
        });
      } else {
        res.status(404).json("Can't find a supplier with this ID");
      }
    });
  } else {
    res.status(400).json("The price needs to be larger than 0");
  }
});

app.post("/customers/:customerId/orders",(req,res)=>{
  let id = parseInt(req.params.customerId),
  sql_orders = "insert into orders (order_date, order_reference, customer_id)"+
    "values (current_date,$1,$2)",
  sql_customers = "select * from customers where id = $1",
  sql_orderNumber = "select order_reference from orders order by id DESC limit 1"

})
app.listen(3000, function () {
  console.log("Server is listening on port 3000.");
});
