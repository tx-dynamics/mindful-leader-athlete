const { Admin } = require("./adminSchema"); // model
const GenericService = require("../GenericService");
class adminServices extends GenericService {
  constructor() {
    super(Admin);
  }
}

module.exports = new adminServices();
