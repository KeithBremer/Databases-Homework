# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a database for an e-commerce app.

To submit this homework write the correct commands for each question here:

```sql


1.select name ,address from customers where country='United States';
2.select name from customers order by name asc;
3.select * from  products where product_name ilike '%sock%';
4.select p.product_name ,pa.prod_id ,pa.unit_price,pa.supp_id
    from products p join  product_availability pa
    on (p.id=pa.prod_id)
    where pa.unit_price>100;
5. select p.id,p.product_name ,pa.unit_price
        from products p join  product_availability  pa
        on p.id=pa.prod_id
        order by unit_price
         desc limit 5;
6.select p.product_name ,pa.unit_price, s.supplier_name
        from products p join suppliers s
        on p.id=s.id
        join product_availability
        pa on pa.prod_id=p.id;
7. select p.product_name ,s.supplier_name
        from products p join suppliers s
        on p.id=s.id
        where s.country='United Kingdom';
8.select pa.unit_price ,o.id,o.order_date ,o.order_reference ,o.customer_id,
        oi.quantity,pa.unit_price/oi.quantity as unit_price
        from product_availability
         pa join orders o on pa.prod_id =o.id
         join order_items oi  on o.id =oi.id
         where o.customer_id=1;
9.select c.name ,p.product_name ,o.order_date ,o.order_reference
        from customers c join products p on p.id=c.id
        join orders o on p.id=o.customer_id
        where c.name='Hope Crosby';
10.select o.order_reference ,p.product_name ,pa.unit_price
        from orders o join products p on o.id=p.id
        join product_availability pa on pa.prod_id=p.id
        join order_items oi on oi.order_id=o.id
        where o.order_reference='ORD006';
11.


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
8. Retrieve all orders, including order items, from customer ID `1`. Include order id, reference, date and total cost (calculated as quantity \* unit price).
9. Retrieve all orders, including order items, from customer named `Hope Crosby`
10. Retrieve all the products in the order `ORD006`. The result should only contain the columns `product_name`, `unit_price` and `quantity`.
11. Retrieve all the products with their supplier for all orders of all customers. The result should only contain the columns `name` (from customer), `order_reference`, `order_date`, `product_name`, `supplier_name` and `quantity`.
12. Retrieve the names of all customers who bought a product from a supplier based in China.
13. List all orders giving customer name, order reference, order date and order total amount (quantity \* unit price) in descending order of total.
