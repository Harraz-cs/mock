
const cds = require("@sap/cds");
const cors = require("cors");
const authorize = require("../middleware/authorize");
const swaggerUi = require("swagger-ui-express");
const swaggerUi2 = require("cds-swagger-ui-express");
const axios = require("axios");
const policy = require("./policies");


const OPA_HOST = process.env.OPA_HOST || "localhost";
const OPA_PORT = process.env.OPA_PORT || "8181";

const yaml = require("js-yaml");
const fs = require("fs");

// Construct the OPA URL to fetch specific polices by id. The id is the name of the policy file. eg bookstore.rego. 
const OPA_URL = `http://${OPA_HOST}:${OPA_PORT}/v1/policies/policies/bookstore.rego`;

cds.on("bootstrap", (app) => {
  app.use(cors());

  // Add swagger UI
  app.use(
    swaggerUi2({
      basePath: "/api-docs", // the root path to mount the middleware on
      apiPath: "", // the root path for the services (useful if behind a reverse proxy)
      diagram: true, // whether to render the YUML diagram
    })
  );

  // Load the OpenAPI specification
  const swaggerDocument = yaml.load(
    fs.readFileSync("./srv/OpenApiSpec.yaml", "utf8")
  );

  // Add swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Add custom route to fetch policies
  app.get("/api/policies", async (req, res) => {
    const pretty = req.query.pretty;
  
    try {
      const response = await axios.get(OPA_URL, {
        params: {
          pretty: pretty === "true", // ensure pretty is a boolean
        },
      });
  
      // Check if the result array exists and has at least one item
      if (
        !response.data ||
        !response.data.result ||
        response.data.result.length === 0
      ) {
        return res.status(400).send("Invalid policy data format");
      }
;
      // Get the raw policy string
      const rawPolicy = response.data.result.raw;
      const parsedPolicy = policy(rawPolicy);
      
      res.send(parsedPolicy);
    } catch (error) {
      res.status(400).send(error.message);
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

