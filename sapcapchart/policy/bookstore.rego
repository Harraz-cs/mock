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
