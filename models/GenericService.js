class GenericService {
    Model = null;
    constructor(Model) {
      this.Model = Model;
    }
  
    find = async (data = {}) => {
      var list = await this.Model.find(data);
      return list;
    };
  
    findOne = async (data) => {
      var result = await this.Model.findOne(data);
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
  
    findByIdAndRemove = async (_id) => {
      var result = await this.Model.findByIdAndRemove(_id);
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
  }
  
  module.exports = GenericService;
  