import axios from "axios";
//import localStorageService from "./localStorageService";
import { GenericService } from "./GenericService";
// var { GenericService } = require("./GenericService");
class ChallangeService extends GenericService {
  constructor() {
    super("/api/challange");
  }

  createChallange = (data) => this.post("/api/challange", { data });
  getSingleChallange = (id) => this.get("/api/challange/" + id);
  updateChallange = (id, data) => this.put("/api/challange/" + id, data);
  deleteChallange = (id) => this.delete("/api/challange/" + id);
}

export default new ChallangeService();
