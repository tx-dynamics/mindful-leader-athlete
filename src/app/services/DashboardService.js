import axios from "axios";
import { GenericService } from "./GenericService";
// var { GenericService } = require("./GenericService");
class DashboardService extends GenericService {
  constructor() {
    super("/api/dashboard");
  }

  companyDepartments = (data) =>
    this.post("/api/dashboard/companyDepartments", data);
  companyIndividuals = (data) => this.post("/api/dashboard/individual", data);
  getSingledashboard = (id) => this.get("/api/dashboard/" + id);
  updatedashboard = (id, data) => this.put("/api/dashboard/" + id, data);
  deletedashboard = (id) => this.delete("/api/dashboard/" + id);
}

export default new DashboardService();
