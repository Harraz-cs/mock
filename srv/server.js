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
});

cds.on("served", async () => {
  console.log("Application is served");
});
