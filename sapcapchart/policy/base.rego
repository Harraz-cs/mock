package httpapi.authz

default allow = false

# Utility rule to get the last element of an array
last(array) = array[count(array) -1]

# Returns true if the entity violates the permissions
entity_violates_permissions(role, entity) {
	not has_entity_permission(role, entity)
}

# Returns true if any part of the query violates the permissions
query_violates_permissions(role, entity) {
	operations := ["$filter", "$select", "$expand", "$orderby", "$top", "$skip", "$count", "$search", "$format"]
	operation := operations[_]
	properties := split(input.query[operation], ",")
	property := properties[_]
	not has_operation_permission(role, entity, operation, property)
}

# Checks if a role has a specific permission
has_operation_permission(role, entity, operation, property) {
	role_permissions[role][entity][property][_] == operation
}

has_operation_permission(role, _, _, _) {
	role_permissions[role]["*"]["*"][_] == "*"
}

has_operation_permission(role, entity, operation, _) {
	role_permissions[role][entity]["*"][_] == operation
}

has_operation_permission(role, _, operation, _) {
	role_permissions[role]["*"]["*"][_] == operation
}

# Checks if a role has permission to access an entity
has_entity_permission(role, entity) {
	role_permissions[role][entity]
}

has_entity_permission(role, _) {
	role_permissions[role]["*"]
}
