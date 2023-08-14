const cds = require("@sap/cds");
const cors = require("cors");
const authorize = require("../middleware/authorize");
const swaggerUi = require("cds-swagger-ui-express");
const axios = require("axios");

const OPA_HOST = process.env.OPA_HOST || "localhost";
const OPA_PORT = process.env.OPA_PORT || "8181";

// Construct the OPA URL
const OPA_URL = `http://${OPA_HOST}:${OPA_PORT}/v1/policies`;

cds.on("bootstrap", (app) => {
  app.use(cors());

  // Add swagger UI
  app.use(swaggerUi());
 
  // Add custom route to fetch policies
  app.get("/api/policies", async (req, res) => {
    const pretty = req.query.pretty;

    try {
      const response = await axios.get(OPA_URL, {
        params: {
          pretty: pretty === "true", // ensure pretty is a boolean
        },
      });

      res.json(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
      res.status(500).send("Error fetching policies");
    }
  });

  // Setup authorization middleware
  app.use(authorize);

  // Generic error handler
  app.use(function (err, req, res, next) {
    console.error(err.stack); // Log error stack trace
    res.status(500).send("Oops! The server broke.");
  });

  
});

cds.on("served", async () => {
  console.log("Application is served");
});
