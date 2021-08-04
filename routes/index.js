
const userRoutes = require("./habbit-tracking-routes/user/userroutes");

module.exports = function (app) {

  app.use("/api/user/", userRoutes);

};
