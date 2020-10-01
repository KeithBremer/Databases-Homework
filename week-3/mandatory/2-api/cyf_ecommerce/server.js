const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const { Pool } = require("pg");
const db = new Pool({
  user: "iman_",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "iman1364",
  port: "5432",
});

//capitalize First Letter of query
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

app.get("/customers", (req, res) => {
  db.query("select * from Customers", (err, result) => {
    if (err == undefined) {
      console.log(result);
      res.status(200).json(result.rows);
    }
  });
});

//get a single customer by ID
app.get("/customers/:id", (req, res) => {
  const customer_Id = parseInt(req.params.id);
  db.query(
    "select * from Customers where id = $1",
    [customer_Id],
    (err, result) => {
      if (err == undefined) {
        console.log(result);
        res.status(200).json(result.rows[0]);
      }
    }
  );
});

//create a new customer
app.post("/customers", (req, res) => {
  const newName = req.body.name;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newCountry = req.body.country;

  db.query(
    "insert into customers(name, address, city, country) " +
      "values($1, $2, $3, $4)",
    [newName, newAddress, newCity, newCountry],
    (err, result) => {
      if (err == undefined) {
        res.status(200).json("customer created");
      } else {
        console.log({ Error: err });
      }
    }
  );
});

app.get("/suppliers", (req, res) => {
  db.query("select * from suppliers", (err, result) => {
    if (err == undefined) {
      console.log(result);
    }
  });
});

app.get("/products", (req, res) => {
  const product_Name = req.query.name;
  if (product_Name) {
    db.query(
      "select p.product_name, pa.unit_price, s.supplier_name " +
        "from products p join product_availability pa on(p.id = pa.prod_id) " +
        "join suppliers s on(s.id = pa.supp_id) " +
        "where product_name like '%'||$1||'%'",
      [capitalizeFirstLetter(product_Name)],
      (err, result) => {
        if (err == undefined) {
          console.log(result);
          res.status(200).json(result.rows);
        } else {
          console.log({ Error: err });
        }
      }
    );
  } else {
    db.query(
      "select p.product_name, pa.unit_price, s.supplier_name " +
        "from products p join product_availability pa on(p.id = pa.prod_id) " +
        "join suppliers s on(s.id = pa.supp_id)",
      (err, result) => {
        if (err == undefined) {
          console.log(result);
          res.status(200).send(result.rows);
        }
      }
    );
  }
});

//add new product
app.post("/products", (req, res) => {
  const newProduct = req.body.product_name;
  db.query(
    "insert into products(product_name) " + "values($1)",
    [newProduct],
    (err, result) => {
      if (err == undefined) {
        res.status(200).json("new product added!");
      } else {
        console.log({ Error: err });
      }
    }
  );
});

// find a customer by Id
app.get("/customers/:id", (req, res) => {
  const customer_id = parseInt(req.params.id);
  db.query(
    "select * from Customers where id = $1",
    [customer_id],
    (err, result) => {
      if (err == undefined) {
        console.log(result);
        res.json(result.rows);
      }
    }
  );
});

//create a new order for an existing customer
app.post("/customers/:customerId/orders", (req, res) => {
  const customerId = parseInt(req.params.customer_id);
  const orderReference = req.body.order_reference;
  const query =
    "insert into orders(order_date, order_reference, customer_id) values(current_date, $1, $2)";
  db.query(
    "SELECT * FROM customers WHERE id = $1",
    [customerId],
    (err, result) => {
      if (err == undefined) {
        //console.log("heloooo!");
        if (result.rowCount == 0) {
          res.status(400).send(`Customer (${customerId}) does not exist.`);
          return;
        }
      }
      console.log(err);
    }
  );

  db.query(query, [orderReference, customerId], (err, result) => {
    if (err == undefined) {
      newId = result.rows[0].id;
      res.status(200).json(`new order for customer ${newId} added!`);
    } else {
      console.log(err);
      res.status(400).json({ Error: err });
    }
  });
});

//update an existing customer
app.put("/customers/:id", function (req, res) {
  const customerId = parseInt(req.params.id);
  const customerName = req.body.name;
  const customerAddress = req.body.address;
  const customerCity = req.body.city;
  const custCountry = req.body.country;

  db.query(
    "SELECT * FROM customers WHERE id = $1",
    [customerId],
    (err, result) => {
      if (result.rowCount != 1) {
        res.status(400).send(`Customer (${customerId}) does not exist.`);
      } else {
        db.query(
          "UPDATE customers SET name = $1, " +
            "  address = $2, " +
            "  city = $3, " +
            "  country = $4 " +
            "  WHERE id = $5",
          [
            customerName,
            customerAddress,
            customerCity,
            custCountry,
            customerId,
          ],
          (err) => {
            if (err == undefined) {
              res.status(200).send(`Customer id:${customerId} updated.`);
            } else {
              res.status(500).json(err);
            }
          }
        );
      }
    }
  );
});

//create a new product availability
app.post("/availability/:prod_id", (req, res) => {
  const unitPrice = req.body.unit_price;
  const productId = parseInt(req.params.prod_id);
  const supplierId = req.body.supp_id;
  if (unitPrice > 0) {
    db.query(
      "insert into product_availability(prod_id, supp_id, unit_price) values($1, $2, $3)",
      [productId, supplierId, unitPrice],
      (err, result) => {
        if (result.rows.length <= 0) {
          res.json("please inter a valid product ID");
        } else if (err == undefined) {
          res.status(200).json("new price added!");
        } else {
          res.status(400).json({ Error: err });
          console.log({ Error: err });
        }
      }
    );
  } else if (unitPrice <= 0) {
    res.json("pleaes insert a positive price!");
  } else {
    res.status(400).json({ Error: err });
  }
});

//delete an existing order
app.delete("/orders/:id", function (req, res) {
  const orderId = parseInt(req.params.id);
  db.query(
    "delete from order_items WHERE order_id = $1",
    [orderId],
    (err, result) => {
      if (err == undefined) {
        db.query(
          "delete from orders WHERE id = $1",
          [orderId],
          (err, result) => {
            if (err == undefined) {
              if (result.rowCount == 0) {
                res.status(400).send("No order with that id found.");
              } else if ((result.rowCount = 1)) {
                res
                  .status(200)
                  .send(`Order number ${orderId} has been deleted.`);
              }
            } else {
              res.status(500).json(err);
            }
          }
        );
      } else {
        res.status(500).json(err);
      }
    }
  );
});

//delete an existing customer only if this customer doesn't have orders
app.delete("/customers/:id", function (req, res) {
  const custId = parseInt(req.params.id);
  db.query(
    "select * from orders where customer_id = $1",
    [custId],
    (error, result) => {
      if (error == undefined) {
        if (result.rowCount > 0) {
          res
            .status(400)
            .send(
              `Cannot delete customer (${custId}) : orders exist for that customer.`
            );
        } else {
          db.query(
            "DELETE FROM customers WHERE id = $1",
            [custId],
            (err, result) => {
              if (err == undefined) {
                if (result.rowCount == 1) {
                  res
                    .status(200)
                    .send(`Customer (${custId}) deleted successfully.`);
                } else {
                  res.status(404).send(`Customer id:${custId} not found.`);
                }
              } else {
                res.status(500).json(err); // error in DELETE
              }
            }
          );
        }
      } else {
        res.status(500).json(error); // error in SELECT
      }
    }
  );
});

//load all the orders along with the items in the orders of a specific customer
app.get("/customers/:id/orders", function (req, res) {
  const custId = parseInt(req.params.id);
  db.query(
    "SELECT o.id, o.order_reference, o.order_date, p.product_name, a.unit_price, " +
      "       s.supplier_name, i.quantity " +
      "  FROM orders o JOIN " +
      "       order_items i ON (i.order_id = o.id) JOIN " +
      "       product_availability a " +
      "           ON (a.prod_id = i.product_id AND a.supp_id = i.supplier_id) JOIN " +
      "       products p ON (p.id = a.prod_id) JOIN " +
      "       suppliers s ON (s.id = a.supp_id) " +
      "  WHERE o.customer_id = $1 " +
      "  ORDER BY o.order_reference",
    [custId],
    (err, result) => {
      if (err == undefined) {
        let orders = [];
        let order = {};
        let item = {};
        let ordId = 0;
        let ordRef = null;
        let ordDate = null;

        for (i = 0; i < result.rows.length; i++) {
          row = result.rows[i];
          if (ordId != row.id) {
            if (ordId != 0) {
              orders.push(order);
            }
            ordId = row.id;
            ordRef = row.order_reference;
            ordDate = row.order_date;
            order = { order_reference: ordRef, order_date: ordDate, items: [] };
          }
          item = {
            product_name: row.product_name,
            unit_price: row.unit_price,
            supplier_name: row.supplier_name,
            quantity: row.quantity,
          };
          order.items.push(item);
        }
        orders.push(order);
        res.status(200).json(orders);
      } else {
        res.status(500).json(err);
      }
    }
  );
});

app.listen(3000, () => {
  console.log("port in listening");
});
