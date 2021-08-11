const { UserHabbit } = require("./userHabbitSchema"); // model
const GenericService = require("../GenericService");
class userHabbitServices extends GenericService {
  constructor() {
    super(UserHabbit);
  }
  findSkipSortLimit = async (find, skip = 0, sort = "_id", limit = 0) => {
    var result = await this.Model.find(find).skip(skip).sort(sort).limit(limit);
    return result;
  };
}

module.exports = new userHabbitServices();
