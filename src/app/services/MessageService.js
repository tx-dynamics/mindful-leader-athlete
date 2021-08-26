import axios from "axios";
//import localStorageService from "./localStorageService";
import { GenericService } from "./GenericService";
// var { GenericService } = require("./GenericService");
class MessageService extends GenericService {
  constructor() {
    super("/api/message");
  }

  getMessages = (roomId) => this.get("/api/message/" + roomId);
}

export default new MessageService();
