import axios from "axios";
//import localStorageService from "./localStorageService";
import { GenericService } from "./GenericService";
// var { GenericService } = require("./GenericService");
class CompanyService extends GenericService {
  constructor() {
    super("/api/company");
  }

  createCompany = (data) => this.post("/api/company", { data });
  getSingleCompany = (id) => this.get("/api/company/" + id);
  getAllCompanies = () => this.get("/api/company/");
  updateCompany = (id, data) => this.put("/api/company/" + id, data);
  deleteCompany = (id) => this.delete("/api/company/" + id);
}

export default new CompanyService();
