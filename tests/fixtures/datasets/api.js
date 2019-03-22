import axios from "axios";

const getSuccess = async () => {
  return axios.get("http://httpbin.org/json");
};

const getFailure = async () => {
  return axios.get("http://httpbin.org/status/500");
};

const getWithParam = async (url) => {
  return axios.get(url);
}

export default {
  getSuccess,
  getFailure,
  getWithParam
};
