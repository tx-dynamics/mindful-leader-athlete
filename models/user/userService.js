const { User } = require("./userSchema"); // model
const GenericService = require("../GenericService");
class userServices extends GenericService {
  constructor() {
    super(User);
  }
  findSkipSortLimit = async (find, skip = 0, sort = "_id", limit = 0) => {
    var result = await this.Model.find(find).skip(skip).sort(sort).limit(limit);
    return result;
  };
  findPopulateSkipSortLimit = async (
    find,
    populate,
    skip = 0,
    sort = "_id",
    limit = 0
  ) => {
    var result = await this.Model.find(find)
      .populate(populate)
      .skip(skip)
      .sort(sort)
      .limit(limit);
    return result;
  };
}

module.exports = new userServices();
