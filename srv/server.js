// const { Service } = require("@sap/cds");
// const cds = require("@sap/cds");

// const allowedFields = ["ID", "title"];

// module.exports = cds.service.impl(async function () {
//   this.on("READ", "Books", async (req, next) => {
//     //passing thru the request
//     console.log("passing thru the request");

//     // Ensure that the columns property is defined
//     console.log(req.query);
//     if (!req.query.SELECT.columns) {
//       // Handle the limit of the fields to be returned
//       req.query.SELECT.columns = allowedFields.map((field) => ({
//         ref: [field],
//       }));
//       console.log("passing next");
//       return await next();
//     }

//     const expandIndex = req.query.SELECT.columns.findIndex(
//       ({ expand }) => expand
//     );
//     console.log("expandIndex: " + expandIndex);

//     // If there's no author to expand, continue with the default behavior
//     if (expandIndex === -1) return await next();

//     // Create a new columns array including only the allowed fields
//     req.query.SELECT.columns = allowedFields.map((field) => ({ ref: [field] }));

//     // Check if there's an $expand parameter in the request
//     if (req._queryOptions && req._queryOptions.$expand) {
//       // Split the $expand parameter value by ',' to get the list of properties to expand
//       const expandProperties = req._queryOptions.$expand.split(",");

//       // Iterate through the expand properties and include them in the query
//       expandProperties.forEach((property) => {
//         req.query.SELECT.columns.push({
//           ref: [property],
//           expand: [
//             // Include the fields from the related entity you want to expand here
//             { ref: ["ID"] },
//             { ref: ["totalSoldCopies"] },
//           ],
//         });
//       });
//     }

//     return await cds.tx(req).run(req.query);

//     // // Execute the modified query
//     const books = await cds.tx(req).run(req.query);
//     return books;
//   });
// });

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
  // const companyService = await cds.connect.to('CompanyService');  <-- To add multiple entity services custom handler to the cds service
  // anotherCustomHandler(companyService);

  console.log("Application is served");
});
