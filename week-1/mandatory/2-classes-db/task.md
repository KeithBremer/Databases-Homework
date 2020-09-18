# Class Database

## Submission

Below you will find a set of tasks for you to complete to consolidate and extend your learning from this week. You will find it beneficial to complete the reading tasks before attempting some of these.

To submit this homework write the correct commands for each question here:

```sql


```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Homework

If you haven't completed all the exercises from this lesson then do that first.

### Tasks

1.  Which rooms have a rate of more than 100.00?

```sql
select * from rooms where rate > 100.00;

```

2.  List the reservations that have a checkin date this month and are for more than three nights.

```sql
select * from reservations where checkin_date between '2020-09-01' and '2020-09-30' and (checkout_date - checkin_date) > 3;

```

3.  List all customers from cities that begin with the letter 'M'.

```sql
select * from customers where city like 'M%';

```

Insert some new data into the room_types and rooms tables, querying after each stage to check the data, as follows:

4.  Make a new room type of PENTHOUSE with a default rate of £185.00

```sql
insert into room_types (room_type, def_rate) values ('PENTHOUSE', 150.00);/

```

5.  Add new rooms, 501 and 502 as room type PENTHOUSE and set the room rate of each to the default value (as in the new room type).

```sql
insert into rooms(room_no, room_type, rate) values (501, 'PENTHOUSE', 150.00),
(502, 'PENTHOUSE', 150.00);

```

6.  Add a new room 503 as a PREMIER PLUS type similar to the other PREMIER PLUS rooms in the hotel but with a room rate of 143.00 to reflect its improved views over the city.

```sql
insert into rooms(room_no, room_type, rate) values (503, 'PREMIER PLUS', 143.00);

```

Using what you can learn about aggregate functions in the w3schools SQL classes (or other providers), try:

7.  The hotel manager wishes to know how many rooms were occupied any time during the previous month - find that information.

```sql
 select count (distinct room_no) from reservations where checkin_date >= '2020-08-01' and checkout_date <= '2020-08-31';

```

8.  Get the total number of nights that customers stayed in rooms on the second floor (rooms 201 - 299).

```sql
select sum (checkout_date - checkin_date) as total_nights from reservations
where room_no between 201 and 299;

```

9.  How many invoices are for more than £300.00 and what is their grand total and average amount?

```sql
select count(total), sum(total),round(avg(total)) from invoices where total > 300.00;

```

10. Bonus Question: list the number of nights stay for each floor of the hotel (floor no is the hundreds part of room number, e.g. room **3**12 is on floor **3**)

```sql
select floor(room_no/100) as floor,
sum (checkout_date - checkin_date) as nights
from reservations
group by floor order by floor;

```
