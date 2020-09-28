# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a database for an e-commerce app.

To submit this homework write the correct commands for each question here:
```sql
--1
select name,address from customers where country ='United States';
--2
select * from customers order by name;
--3
select * from products  where product_name like '%socks%';
--4
select p.* ,pa.unit_price,pa.supp_id from products p join product_availability pa on(p.id=pa.prod_id)  where pa.unit_price>100;
--5
select p.* from products p join product_availability pa on(p.id=pa.prod_id)  order by pa.unit_price desc limit 5;
--6
select p.product_name,pa.unit_price,s.supplier_name from products p join product_availability pa on(p.id=pa.prod_id)join suppliers s on (pa.supp_id=s.id) ;
--7
select p.product_name,s.supplier_name from products p join product_availability pa on(p.id=pa.prod_id)join suppliers s on (pa.supp_id=s.id) where s.country='United Kingdom' ;
--8 
 select o.id,o.order_reference,o.order_date,oi.quantity* pa.unit_price as total  from orders o  join order_items oi  on(o.id=oi.order_id) join product_availability pa on(oi.product_id=pa.prod_id) where o.customer_id=1 ;
--9
select o.*,oi.* from orders o  join order_items oi  on(o.id=oi.order_id) join customers c on(o.customer_id=c.id) where c.name='Hope Crosby' ; 
--10
select p.product_name,pa.unit_price,oi.quantity from product_availability pa join order_items oi  on(pa.prod_id=oi.product_id) join products p on(oi.product_id=p.id)join orders o on(o.id=oi.order_id) where o.order_reference='ORD006'and oi.supplier_id=pa.supp_id ;
--11
select c.name,o.order_reference,o.order_date, p.product_name,s.supplier_name,oi.quantity from orders o  join order_items oi  on(o.id=oi.order_id) join customers c on(o.customer_id=c.id)  join products p on(oi.product_id=p.id)join suppliers s on (oi.supplier_id=s.id) ;
--12
select distinct c.name from customers c join orders o on (o.customer_id=c.id)join order_items oi on(o.id=oi.order_id) join suppliers s on(s.id=oi.supplier_id) where s.country='China'
--13
select c.name,o.order_reference,o.order_date,sum(oi.quantity*pa.unit_price) as total_order from orders o  join order_items oi  on(o.id=oi.order_id) join customers c on(o.customer_id=c.id) join product_availability pa on(oi.product_id=pa.prod_id) group by o.id, c.name order by total_order desc;
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

