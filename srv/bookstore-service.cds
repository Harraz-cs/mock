using bookstore as db from '../db/schema';

service BookstoreService {
  entity Authors as projection on db.Authors;
  entity Books as projection on db.Books;
  entity Orders as projection on db.Orders;
  entity Customers as projection on db.Customers;
  entity ContactInfo as projection on db.ContactInfo;
}
