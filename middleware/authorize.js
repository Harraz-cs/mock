const fetch = require("node-fetch");

async function authz(req, res, next) {
  // Log the query object
  console.log("Received query object:", req.query);
  const role = req.headers["x-user-role"];

  // Construct the input object directly from the parsed query object
  const input = {
    method: req.method,
    path: req.path.split("/"),
    query: req.query,
    user: {
      role: role, // Including the role in the user object
    },
  };

  console.log("input: " + JSON.stringify(input));

  try {
    // Send the request to the authorization service
    const response = await fetch(
      "http://localhost:8181/v1/data/httpapi/authz/allow",
      {
        method: "POST",
        body: JSON.stringify({ input }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const { result } = await response.json();

    //print the result
    console.log("result: " + JSON.stringify(result));

    // Proceed if the authorization is successful
    if (result) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    console.error("Failed to authorize:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = authz;
