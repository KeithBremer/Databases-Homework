# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a database for an e-commerce app.

To submit this homework write the correct commands for each question here:
```sql


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
select name, address from customers where country ='United States';

2. Retrieve all the customers in ascending name sequence
select * from customers order by name ;

3. Retrieve all the products whose name contains the word `socks`
select * from products where product_name like '%socks%';

4. Retrieve all the products which cost more than 100 showing product id, name, unit price and supplier id.
select a.prod_id, p.product_name, a.unit_price, a.supp_id from products p join product_availability a on (a.prod_id = p.id) where a.unit_price >100 ;

5. Retrieve the 5 most expensive products
select * from product_availability order by unit_price DESC limit 5;

6. Retrieve all the products with their corresponding suppliers. The result should only contain the columns `product_name`, `unit_price` and `supplier_name`
select p.product_name, a.unit_price, s.supplier_name from products p join product_availability a on (a.prod_id = p.id) join suppliers s on (a.supp_id = s.id) ;

7. Retrieve all the products sold by suppliers based in the United Kingdom. The result should only contain the columns `product_name` and `supplier_name`.
select p.product_name, s.supplier_name from products p join product_availability a on(a.prod_id = p.id)  join suppliers s on (a.supp_id = s.id) where s.country = 'United Kingdom';

8. Retrieve all orders, including order items, from customer ID `1`. Include order id, reference, date and total cost (calculated as quantity * unit price).

select o.order_reference, o.order_date from  orders o join order_items i on (i.order_id = o.id)  join product_availability a on (a.prod_id = i.product_id) where o.customer_id = 1;  
////////////I don't understand what they exactly want from this question ////////////////

9. Retrieve all orders, including order items, from customer named `Hope Crosby`
select o.* from orders o join customers c on (o. customer_id = c.id) where c.name = 'Hope Crosby';
////// what do yo mean by including order items ////////////////////////////

10. Retrieve all the products in the order `ORD006`. The result should only contain the columns `product_name`, `unit_price` and `quantity`.
select p.product_name , a.unit_price, i.quantity from  orders o join order_items i on(i.order_id = o.id) join product_availability a on (i.supplier_id = a.supp_id) join products p on (p.id = a. prod_id)
where o.order_reference = 'ORD006';

11. Retrieve all the products with their supplier for all orders of all customers. The result should only contain the columns `name` (from customer), `order_reference`, `order_date`, `product_name`, `supplier_name` and `quantity`.
select c.name, o.order_reference, o.order_date, s.supplier_name , i.quantity 
from customers c join 
orders o on(c.id= o.customer_id) join
 order_items i on (o.id = i. order_id) join
   products p on (i.product_id = p.id) join
  suppliers s on (s.id =i.supplier_id);

12. Retrieve the names of all customers who bought a product from a supplier based in China.
select c.name from customers c join orders o on(c.id= o.customer_id) join
 order_items i on (o.id = i. order_id) join
 suppliers s on (s.id =i.supplier_id)
 where s.country = 'China';


13. List all orders giving customer name, order reference, order date and order total amount (quantity * unit price) in descending order of total.
select c.name, o.order_reference, o.order_date, sum (quantity * unit_price) as total
 from customers c join orders o on(c.id= o.customer_id) join 
 order_items i on (o.id = i. order_id) join
 product_availability a on (i.supplier_id = a.supp_id)
 group by c.name, o.order_reference, o.order_date 
  ORDER BY totaL DESC ;



