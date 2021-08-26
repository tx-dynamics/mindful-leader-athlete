import axiosInstance from "./axiosInstance";
export class GenericService {
  endPoint = "";

  constructor(apiPrefix) {
    this.endPoint = apiPrefix;
  }
  get = (url) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .get(url)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  post = (url, data) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(url, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  put = (url, data) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .put(url, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  delete = (url) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .delete(url)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });

  paginate = (page = 1, per_page = 10) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .get(this.endPoint + "?page=" + page + "&per_page=" + per_page)
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.data);
        });
    });

  deleteRecord = (_id) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .delete(this.endPoint + "/" + _id)
        .then((res) => resolve(res.data))
        .catch((err) => {
          reject(err);
        });
    });

  addRecord = (data) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(this.endPoint, data)
        .then((res) => resolve(res.data))
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  updateRecord = (_id, data) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .put(this.endPoint + "/" + _id, data)
        .then((res) => resolve(res.data))
        .catch((err) => {
          reject(err);
        });
    });
  getById = (_id) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .get(this.endPoint + "/" + _id)
        .then((res) => resolve(res.data))
        .catch((err) => {
          reject(err);
        });
    });
  getRecordBySlug = (slug) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .get(this.endPoint + "/slug/" + slug)
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.data);
        });
    });
  query = (query) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(this.endPoint + "/query", { query })
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.data);
        });
    });

  getAllRecords = () =>
    new Promise((resolve, reject) => {
      axiosInstance
        .get(this.endPoint + "/all")
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.data);
        });
    });
}

export let genericService = new GenericService();
// export default GenericService;

// export GenericService = GenericService
// module.exports.GenericService = GenericService;
// module.exports.genericService = genericService;
