import axios from "axios";
let axiosInstance = axios.create({
  baseURL: "https://mindful-leader-athlete.herokuapp.com/",
  // baseURL: "http://localhost:5005/",
  // withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});
// axiosInstance.defaults.headers.common["x-auth-token"] = localStorage.getItem(
//   "jwt_token"
// )
//   ? localStorage.getItem("jwt_token").toString()
//   : "";

// axiosInstance.defaults.headers.common["companyId"] = localStorage.getItem(
//   "companyId"
// )
//   ? localStorage.getItem("companyId").toString()
//   : "";

// axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
// axiosInstance.interceptors.response.use(
//   response => successHandler(response),
//   error => errorHandler(error)
// );
const errorHandler = (error) => {
  return Promise.reject({ ...error });
};

const successHandler = (response) => {
  return response;
};
export default axiosInstance;
