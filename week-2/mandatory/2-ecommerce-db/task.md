# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a database for an e-commerce app.

To submit this homework write the correct commands for each question here:
```sql
1- select name, address,country from customers where country = 'United States';

2-  select * from customers order by name asc;

3- select * from products where product_name like '%socks%';

4- select pro.id, pro.product_name , pro_ava.unit_price , pro_ava.supp_id from products pro join product_availability pro_ava on (pro_ava.prod_id = pro.id) where pro_ava.unit_price > 100;

5- select pro.product_name, available.prod_id, available.supp_id, available.unit_price from product_availability available join products pro on (available.prod_id = pro.id) order by unit_price desc limit 5;

6- select pro.product_name , pro_avai.unit_price, supp.supplier_name from products pro join product_availability pro_avai on (pro_avai.prod_id = pro.id) join suppliers supp on (pro_avai.supp_id = supp.id);

7- select pro.product_name , supp.supplier_name from products pro join product_availability pro_avai on(pro_avai.prod_id = pro.id) join suppliers supp on(pro_avai.supp_id = supp.id) where supp.country = 'United Kingdom';

8- select  ord.id, ord.order_reference, ord.order_date, ord_i.quantity * pro_avai.unit_price as total_cost, ord.customer_id from orders ord join order_items ord_i on (ord_i.order_id = ord.id) join product_availability pro_avai on (pro_avai.prod_id = ord_i.product_id) where ord.customer_id = '1';

9- select  ord.* ,ord_i.*, c.name  from orders ord  join  order_items ord_i on (ord_i.order_id = ord.id) inner join customers c on (ord.customer_id = c.id) where c.name = 'Hope Crosby';

10- select pro.product_name , pro_avai.unit_price , ord_i.quantity from products pro join product_availability pro_avai on (pro_avai.prod_id = pro.id) join order_items ord_i on (pro.id = ord_i.product_id) join orders ord on (ord_i.order_id = ord.id)  where ord.order_reference = 'ORD006';

11- select c.name, ord.order_reference , ord.order_date, pro.product_name, supp.supplier_name , ord_i.quantity from customers c join orders ord on ( ord.customer_id 
= c.id) join order_items ord_i on (ord_i.order_id = ord.id) join suppliers supp on (ord_i.supplier_id = supp.id) join products pro on (ord_i.product_id = pro.id);

12- select c.name from customers c join orders ord on (ord.customer_id = c.id) join order_items ord_i on (ord_i.order_id = ord.id) join suppliers supp on (ord_i.supplier_id = supp.id) where supp.country = 'China';

13-  select c.name , ord.order_reference , ord.order_date, ord_i.quantity * pro_avai.unit_price  as total_amount from customers c join orders ord on (ord.customer_id 
=c.id) join order_items ord_i on (ord_i.order_id = ord.id) join product_availability pro_avai on (pro_avai.prod_id = ord_i.product_id) order by total_amount desc;

```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Setup

To prepare your environment for this homework, open a terminal and create a new database called `cyf_ecommerce`:

```sql
createdb cyf_ecommerce
```

Import the file [`cyf_ecommerce.sql`](./cyf_ecommerce.sql) in your newly created database:

```sql
psql -d cyf_ecommerce -f cyf_ecommerce.sql
```

Open the file `cyf_ecommerce.sql` in VSCode and examine the SQL code. Take a piece of paper and draw the database with the different relationships between tables (as defined by the REFERENCES keyword in the CREATE TABLE commands). Identify the foreign keys and make sure you understand the full database schema.

## Task

Once you understand the database that you are going to work with, solve the following challenge by writing SQL queries using everything you learned about SQL:

1. Retrieve all the customers' names and addresses who live in the United States
2. Retrieve all the customers in ascending name sequence
3. Retrieve all the products whose name contains the word `socks`
4. Retrieve all the products which cost more than 100 showing product id, name, unit price and supplier id.
5. Retrieve the 5 most expensive products
6. Retrieve all the products with their corresponding suppliers. The result should only contain the columns `product_name`, `unit_price` and `supplier_name`
7. Retrieve all the products sold by suppliers based in the United Kingdom. The result should only contain the columns `product_name` and `supplier_name`.
8. Retrieve all orders, including order items, from customer ID `1`. Include order id, reference, date and total cost (calculated as quantity * unit price).
9. Retrieve all orders, including order items, from customer named `Hope Crosby`
10. Retrieve all the products in the order `ORD006`. The result should only contain the columns `product_name`, `unit_price` and `quantity`.
11. Retrieve all the products with their supplier for all orders of all customers. The result should only contain the columns `name` (from customer), `order_reference`, `order_date`, `product_name`, `supplier_name` and `quantity`.
12. Retrieve the names of all customers who bought a product from a supplier based in China.
13. List all orders giving customer name, order reference, order date and order total amount (quantity * unit price) in descending order of total.

