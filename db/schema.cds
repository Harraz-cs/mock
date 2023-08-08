namespace cap_project;

entity Books {
  key ID: Integer;
  title: String;
  iban: String;
  price: Integer;
  author: Association to Authors;
}

entity Authors {
  key ID: Integer;
  totalSoldCopies: Integer;
  socialSecurityNumber: Association to Persons;
}

entity Persons {
  key ID: Integer;
  firstname: String;
  lastname: String;
  birthDate: String;
  address: String;
}
