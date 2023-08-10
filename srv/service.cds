using cap_project from '../db/schema';

service BookService {
  entity Books as projection on cap_project.Books;
  entity Authors as projection on cap_project.Authors
  entity Persons as projection on cap_project.Persons;
}



