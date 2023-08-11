// Get OPA host and port from environment variables
const OPA_HOST = process.env.OPA_HOST || "localhost"; // Default to localhost if not set
const OPA_PORT = process.env.OPA_PORT || "8181"; // Default to 8181 if not set

// Construct the OPA URL
const OPA_URL = `http://${OPA_HOST}:${OPA_PORT}/v1/data/httpapi/authz/allow`;

async function authz(req, res, next) {
  // Dynamically import necessary modules
  const fetch = (await import("node-fetch")).default;
  const http = await import("http");

  // For handling self-signed certificates during development
  const agent = new http.Agent({
    rejectUnauthorized: false,
  });

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

  console.log("input:", JSON.stringify(input));

  try {
    // Send the request to the authorization service
    const response = await fetch(OPA_URL, {
      method: "POST",
      body: JSON.stringify({ input }),
      headers: { "Content-Type": "application/json" },
      agent: agent,
    });

    const responseData = await response.text();
    console.log("OPA Response Raw:", responseData);

    try {
      const { result } = JSON.parse(responseData);
      console.log("OPA Response JSON:", JSON.stringify(result));

      // Proceed if the authorization is successful
      if (result) {
        next();
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (parseError) {
      console.error("Error parsing OPA response:", parseError);
      res.status(500).send("Error parsing OPA response");
    }
  } catch (error) {
    console.error("Failed to authorize:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = authz;
