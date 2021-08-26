class GenericService {
  Model = null;
  constructor(Model) {
    this.Model = Model;
  }

  find = async (data = {}) => {
    var list = await this.Model.find(data).lean();
    return list;
  };

  findOne = async (data) => {
    var result = await this.Model.findOne(data).lean();
    return result;
  };
  findById = async (data) => {
    var result = await this.Model.findById(data);
    return result;
  };
  findByIdAndUpdate = async (id, data) => {
    var result = await this.Model.findByIdAndUpdate(id, data);
    return result;
  };

  findOneAndUpdate = async (id, data) => {
    var result = await this.Model.findOneAndUpdate(id, data);
    return result;
  };

  findByIdAndRemove = async (_id) => {
    var result = await this.Model.findByIdAndRemove(_id);
    return result;
  };

  findOneAndRemove = async (data) => {
    var result = await this.Model.findOneAndRemove(data);
    return result;
  };

  save = async (result) => {
    var s = new this.Model(result);
    s = await s.save();
    result = s;
    // console.log({ id: s._id, fixed: s.fixed });
    // console.log(s.fixed);
    return result;
  };
  countDocuments = async () => {
    var result = this.Model.countDocuments();

    return result;
  };

  findAndPopulate = async (data = {}, onPopulate, condition, option) => {
    const result = await this.Model.find(data).populate(
      onPopulate,
      null,
      condition
    );
    return result;
  };
  findAndSelect = async (data = {}, select) => {
    const result = await this.Model.find(data).select(select).lean();
    return result;
  };
  findOneAndSelect = async (data = {}, select) => {
    const result = await this.Model.findOne(data).select(select).lean();
    return result;
  };
}

module.exports = GenericService;
