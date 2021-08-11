const userRoutes = require("./habbit-tracking-routes/user/userroutes");
const challangeRoutes = require("./habbit-tracking-routes/challange/challangeroutes");
const companyRoutes = require("./habbit-tracking-routes/company/companyRoutes");
const dashboardRoutes = require("./habbit-tracking-routes/dashboard/dashboardRoutes");

module.exports = function (app) {
  app.use("/api/user/", userRoutes);
  app.use("/api/challange/", challangeRoutes);
  app.use("/api/company/", companyRoutes);
  app.use("/api/dashboard/", dashboardRoutes);
};
