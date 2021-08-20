const { Message } = require("./messageSchema"); // model
const GenericService = require("../GenericService");
class messageServices extends GenericService {
  constructor() {
    super(Message);
  }
  findSkipSortLimit = async (find, skip = 0, sort = "_id", limit = 0) => {
    var result = await this.Model.find(find).skip(skip).sort(sort).limit(limit);
    return result;
  };
}

module.exports = new messageServices();
