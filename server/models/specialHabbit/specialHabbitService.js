const { SpecialHabbit } = require("./specialHabbitSchema"); // model
const GenericService = require("../GenericService");
class specialHabbitServices extends GenericService {
  constructor() {
    super(SpecialHabbit);
  }
  findSkipSortLimit = async (find, skip = 0, sort = "_id", limit = 0) => {
    var result = await this.Model.find(find)
      .skip(skip)
      .sort(sort)
      .limit(limit);
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

module.exports = new specialHabbitServices();
