package httpapi.authz

role_permissions = {
	"admin": {"*": {"*": ["*"]}},
	"customer": {"Books": {
		"title": ["$select"],
		"price": ["$select"],
        "ID": ["$select"],
		"*": ["$expand"],
	}},
	"guest": {"Authors": {
		"totalSoldCopies": ["$select"],
		"ID": ["$select"],
	}},
}

# Policy to handle GET requests for the bookstore
allow {
	input.method == "GET"
	input.path = ["", "odata", "v4", "bookstore", entity]
	role := input.user.role
	has_entity_permission(role, entity)
	count(input.query) > 0
	not query_violates_permissions(role, entity)
}

# Policy to allow access to metadata page
allow {
    input.method == "GET"
    input.path = ["", ""]
}

# Policy to handle POST for "Books" Entity
allow {
	input.method == "POST" 
	input.path = ["", "odata", "v4", "bookstore", "Books"]
	input.user.role == "admin"
}

# Policy to handle POST for "Authors" entity
allow {
	input.method == "POST"
	input.path = ["", "odata", "v4", "bookstore", "Authors"]
	input.user.role == "admin"
}

# Permission for accessing the metadata page
allow{
	input.method == "GET"
	last(input.path) == "$metadata"
}

# Permission to access opa "/policies"
allow{
	input.method == "GET"
	last(input.path) == "policies"
}

# Allow access to any path that ends with /bookstore
allow {
    input.method == "GET"
    last(input.path) == "bookstore"
}

# Allow access to any path that ends with /bookstore
allow {
    input.method == "GET"
    last(input.path) == "swagger"
}
