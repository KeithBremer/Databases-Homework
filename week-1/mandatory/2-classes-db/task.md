# Class Database

## Submission

Below you will find a set of tasks for you to complete to consolidate and extend your learning from this week. You will find it beneficial to complete the reading tasks before attempting some of these.

To submit this homework write the correct commands for each question here:

```sql
1.cyf_hotel=> select \* FROM rooms WHERE rate > 100.00;

2.cyf_hotel=> select \* FROM reservations where checkin_date = current_date;

3.  cyf_hotel=> select \*FROM customers WHERE city LIKE 'M%';

4,5. cyf_hotel=> insert INTO rooms (room_no, rate,room_type) values ('501','185.00','PENTHOUSE');
INSERT 0 1

6. cyf_hotel=> insert INTO rooms (room_no, rate,room_type) values ('503','143.00','PREMIER PLUS');
INSERT 0 1

7.cyf_hotel=> select COUNT (room_no) occupied from reservations where checkin_date = current_date -17;

```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Homework

If you haven't completed all the exercises from this lesson then do that first.

### Tasks

1.  Which rooms have a rate of more than 100.00?

cyf_hotel=> select \* FROM rooms WHERE rate > 100.00;
room_no | rate | room_type | no_guests
---------+--------+--------------+-----------
301 | 110.00 | PREMIER | 2
302 | 110.00 | PREMIER | 2
303 | 110.00 | PREMIER | 2
304 | 110.00 | PREMIER | 2
305 | 110.00 | PREMIER | 2
306 | 110.00 | PREMIER | 2
307 | 110.00 | PREMIER | 2
308 | 123.00 | PREMIER PLUS | 2
309 | 123.00 | PREMIER PLUS | 2
310 | 123.00 | PREMIER PLUS | 2
311 | 123.00 | PREMIER PLUS | 2
312 | 123.00 | PREMIER PLUS | 2
401 | 110.00 | PREMIER | 2
402 | 110.00 | PREMIER | 2
403 | 110.00 | PREMIER | 2
404 | 110.00 | PREMIER | 2
405 | 110.00 | PREMIER | 2
406 | 110.00 | PREMIER | 2
407 | 110.00 | PREMIER | 2
408 | 123.00 | PREMIER PLUS | 2
409 | 123.00 | PREMIER PLUS | 2
410 | 123.00 | PREMIER PLUS | 2
411 | 123.00 | FAMILY | 4
412 | 123.00 | FAMILY | 4
(24 rows)

2.  List the reservations that have a checkin date this month and are for more than three nights.

cyf_hotel=> select \* FROM reservations where checkin_date = current_date;
id | cust_id | room_no | checkin_date | checkout_date | no_guests | booking_date
----+---------+---------+--------------+---------------+-----------+--------------
90 | 66 | | 2020-09-15 | 2020-09-18 | 1 | 2020-09-09

3.  List all customers from cities that begin with the letter 'M'.
    cyf_hotel=> select \*FROM customers WHERE city LIKE 'M%';
    id | name | email | phone | address | city | postcode | country
    -----+---------------------+------------------------------+--------------------+--------------------------------------------+-------------+----------+-------------
    3 | Alice Evans | alice.evans001@hotmail.com | 0161 345 6789 | 3 High Road | Manchester | m13 4ef | UK
    4 | Mohammed Trungpa | mo.trungpa@hotmail.com | 0161 456 7890 | 25 Blue Road | Manchester | M25 6GH | UK
    6 | Nadia Sethuraman | nadia.sethuraman@mail.com | | 135 Green Street | Manchester | M10 4BG | UK
    8 | Martín Sommer | martin.sommer@dfgg.net | (91) 555 22 82 | C/ Romero, 33 | Madrid | 28016 | Spain
    | Marseille | 13008 | France
    14 | Peter Ferguson | peter.ferguson@mxnx.net | 03 9520 4555 | 636 St Kilda Road, Level 3 | Melbourne | 3004 | Australia-- More 54 | Jean Fresnière | jean.fresnière@uxsm.net | (514) 555-8054 | 43 rue St. Laurent | Montréal | H1J 1C3 | Canada-- More -- 89 | Laurence Lebihan | laurence.lebihan@xmzx.net | 91.24.4555 | 12, rue des Bouchers | Marseille | 13008 | France-- More -- 100 | Arnold Cruz | arnold.cruz@awqa.net | +63 2 555 3587 | 15 McCallum Street, NatWest Center #13-03 | Makati City | 1227 MM | Philippines-- Mor 105 | Michael Donnermeyer | michael.donnermeyer@lvpk.net | +49 89 61 08 9555 | Hansastr. 15 | Munich | 80686 | Germany-- More - 120 | Hanna Moos | hanna.moos@fmga.net | 0621-08555 | Forsterstr. 57 | Mannheim | 68306 | Germany-- More -(19 rows)

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
```
