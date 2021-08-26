import axios from "axios";
//import localStorageService from "./localStorageService";
import { GenericService } from "./GenericService";
// var { GenericService } = require("./GenericService");
class CompanyService extends GenericService {
  constructor() {
    super("/api/user");
  }
  adminLogin = (data) => this.post("/api/user/admin/login", data);
}

export default new CompanyService();
