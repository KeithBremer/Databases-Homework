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

SELECT \* FROM rooms WHERE rate > 100;

2.  List the reservations that have a checkin date this month and are for more than three nights.

SELECT \* FROM reservationS
WHERE checkin_date between '2020-09-01' AND '2020-09-30'
AND checkout_date - checkin_date > 3;

3.  List all customers from cities that begin with the letter 'M'.

SELECT \* FROM customers WHERE Upper(city) LIKE 'M%';

Insert some new data into the room_types and rooms tables, querying after each stage to check the data, as follows:

4.  Make a new room type of PENTHOUSE with a default rate of £185.00

INSERT INTO room_types (room_type, def_rate) VALUES ('PENTHOUSE', 185.00);

5.  Add new rooms, 501 and 502 as room type PENTHOUSE and set the room rate of each to the default value (as in the new room type).

INSERT INTO rooms (room_no, rate, room_type, no_guests)
VALUES (501, 185.00, 'PENTHOUSE' NULL),
(502, 185.00, 'PENTHOUSE', NULL)

6.  Add a new room 503 as a PREMIER PLUS type similar to the other PREMIER PLUS rooms in the hotel but with a room rate of 143.00 to reflect its improved views over the city.

INSERT INTO rooms (room_no, rate, room_type, no_guests)
VALUES (503, 143.00, 'PREMIER PLUS' 2);

Using what you can learn about aggregate functions in the w3schools SQL classes (or other providers), try:

7.  The hotel manager wishes to know how many rooms were occupied any time during the previous month - find that information.

SELECT COUNT(distinct room_no) FROM reservations
WHERE checkin_date >= '2020-08-01' and checkout_date<= '2020-08-31';

8.  Get the total number of nights that customers stayed in rooms on the second floor (rooms 201 - 299).

SELECT sum(checkout_date - checkin_date) AS nights
FROM reservations
WHERE room_no BETWEEN 200 AND 299;

9.  How many invoices are for more than £300.00 and what is their grand total and average amount?

SELECT count(\*), sum(total), avg(total) FROM invoices WHERE total > 300.00;

10. Bonus Question: list the number of nights stay for each floor of the hotel (floor no is the hundreds part of room number, e.g. room **3**12 is on floor **3**)

SELECT FLOOR(room_no/100) AS floor,
sum(checkout_date - checkin_date) AS nights
FROM reservations
WHERE room_no IS NOT NULL
GROUP BY floor;
