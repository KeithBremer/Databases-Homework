# Class Database

## Submission

Below you will find a set of tasks for you to complete to consolidate and extend your learning from this week.  You will find it beneficial to complete the reading tasks before attempting some of these.

To submit this homework write the correct commands for each question here:

```sql
1. SELECT * FROM rooms WHERE rate>100;

2. SELECT *, (checkout_date-checkin_date) AS night FROM reservations 
        WHERE (extract(month from checkin_date)) = (extract(month from current_date)) 
        AND (extract(year from checkin_date)) = (extract(year from current_date)) 
        AND checkout_date-checkin_date>2;

3. SELECT * FROM customers WHERE city LIKE 'M%';

4. INSERT INTO room_types VALUES ('PENTHOUSE', 185.00);

5. INSERT INTO rooms (room_no, room_type, rate) 
        VALUES 
        (501, 'PENTHOUSE', (SELECT def_rate FROM room_types WHERE room_type='PENTHOUSE')), 
        (502, 'PENTHOUSE', (SELECT def_rate FROM room_types WHERE room_type='PENTHOUSE'));

6. INSERT INTO rooms (room_no, rate, room_type, no_guests) 
    VALUES (503, 143.00, 'PREMIER PLUS', (select no_guests from rooms where room_type='PREMIER PLUS' limit 1));

7. Display Which rooms, How many different checkin, How many nights were occupied during last month; 
   
    SELECT room_no, count(room_no) AS different_times, count(checkout_date-checkin_date) AS nights_total FROM reservations WHERE checkin_date>=date_trunc('month', now()-'1 month'::interval) AND checkout_date<now() GROUP BY room_no;

    Display How many rooms and how many nights were occupied during last month;
    
    SELECT count(room_no) AS room_total, sum(nights_total) AS nights_ttotal FROM 
        (SELECT room_no, count(room_no) as different_times, count(checkout_date-checkin_date) as nights_total from reservations 
        where checkin_date>=date_trunc('month', now()-'1 month'::interval) and checkout_date<now() group by room_no) as detailed_table;


8. SELECT sum (checkout_date-checkin_date) AS num_nights FROM reservations WHERE room_no BETWEEN 200 AND 300;

9. SELECT count(id) AS num_invoices, sum(total) AS total_invoices, avg(total) AS avg_invoices FROM invoices WHERE total>300;

10.  SELECT * FROM 
        (SELECT sum(checkout_date-checkin_date) as FIRST_FLOOR FROM reservations WHERE room_no between 100 and 200) as F, 
        (SELECT sum(checkout_date-checkin_date) as SECOND_FLOOR FROM reservations WHERE room_no between 200 and 300) as S, 
        (SELECT sum(checkout_date-checkin_date) as THIRD_FLOOR FROM reservations WHERE room_no between 300 and 400) as T, 
        (SELECT sum(checkout_date-checkin_date) as FOURTH_FLOOR FROM reservations WHERE room_no between 300 and 400) as FO;


```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Homework

If you haven't completed all the exercises from this lesson then do that first.

### Tasks
1.  Which rooms have a rate of more than 100.00?

2.  List the reservations that have a checkin date this month and are for more than three nights.

3.  List all customers from cities that begin with the letter 'M'.

Insert some new data into the room_types and rooms tables, querying after each stage to check the data, as follows:

4.  Make a new room type of PENTHOUSE with a default rate of £185.00
5.  Add new rooms, 501 and 502 as room type PENTHOUSE and set the room rate of each to the default value (as in the new room type).
6.  Add a new room 503 as a PREMIER PLUS type similar to the other PREMIER PLUS rooms in the hotel but with a room rate of 143.00 to reflect its improved views over the city.

Using what you can learn about aggregate functions in the w3schools SQL classes (or other providers), try:

7.  The hotel manager wishes to know how many rooms were occupied any time during the previous month - find that information.
8.  Get the total number of nights that customers stayed in rooms on the second floor (rooms 201 - 299).
9.  How many invoices are for more than £300.00 and what is their grand total and average amount?
10.  Bonus Question: list the number of nights stay for each floor of the hotel (floor no is the hundreds part of room number, e.g. room **3**12 is on floor **3**)
