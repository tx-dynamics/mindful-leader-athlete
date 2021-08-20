const { Company } = require("./companySchema"); // model
const GenericService = require("../GenericService");
class companyService extends GenericService {
  constructor() {
    super(Company);
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

module.exports = new companyService();
