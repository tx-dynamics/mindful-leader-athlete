import axios from "axios";
import axiosInstance from "./axiosInstance";
//import localStorageService from "./localStorageService";
import { GenericService } from "./GenericService";
// var { GenericService } = require("./GenericService");
class CompanyService extends GenericService {
  constructor() {
    super("/api/user");
  }
  adminLogin = (data) => this.post("/api/user/admin/login", data);
  usersQuery = (query, id) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(this.endPoint + "/query/" + id, { query })
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.data);
        });
    });
}

export default new CompanyService();
