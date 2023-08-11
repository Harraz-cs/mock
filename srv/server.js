const cds = require("@sap/cds");
const cors = require("cors");
const authorize = require("../middleware/authorize");

cds.on("bootstrap", (app) => {
  app.use(cors());

  // Setup authorization middleware
  app.use(authorize);

  // Generic error handler
  app.use(function (err, req, res, next) {
    console.error(err.stack); // Log error stack trace
    res.status(500).send("Oops! The server broke.");
  });

  // Add custom route to fetch policies
  app.get("/api/policies", async (req, res) => {
    const pretty = req.query.pretty;

    try {
      const response = await axios.get(process.env.OPA_URL + "/v1/policies", {
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
});

cds.on("served", async () => {
  console.log("Application is served");
});
