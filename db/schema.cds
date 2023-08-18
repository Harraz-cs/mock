namespace bookstore;

entity Authors {
  key AuthorID : Integer;
  name : String;
  bio : String;
  dateOfBirth : Date;
  Books : Association to many Books on Books.Author = $self;
}

entity Books {
  key BookID : Integer;
  title : String;
  genre : String;
  publicationYear : Date;
  price : Decimal;
  Author : Association to Authors;
  Orders : Composition of many Orders on Orders.Book = $self;
}

entity Orders {
  key OrderID : Integer;
  orderDate : DateTime;
  quantity : Integer;
  totalAmount : Decimal;
  Book : Association to Books;
  Customer : Association to Customers;
}

entity Customers {
  key CustomerID : Integer;
  firstName : String;
  lastName : String;
  email : String;
  address : String;
  Orders : Composition of many Orders on Orders.Customer = $self;
}

entity ContactInfo {
  key ID : Integer;
  Email : String;
  Phone : String;
  Address : String;
  author: Association to Authors;
}


