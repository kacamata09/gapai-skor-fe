// import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { getLocalStorageItem } from "./localStorage";

const apiUrl = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
  // baseURL: 'http://localhost:1111',
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getLocalStorageItem("accessToken");
    config.headers.Authorization =
      accessToken && accessToken !== "" ? `Bearer ${accessToken}` : undefined;
    return config;
  },
  (err) => Promise.reject(err)
);


const errorMessageExtractor = (error) => {
  console.error(error);

  let message = error.message || "Terjadi Kesalahan";
  return message;
};

const urlBuilder = (
  endPoint,
  pageSize = 10,
  pageNumber = 1,
  queryParams
) => {
  const searchParams = new URLSearchParams();

  for (const key in queryParams) {
    if (queryParams[key] !== "") {
      searchParams.append(key, queryParams[key]);
    }
  }

  const searchString = searchParams.toString();

  const endPointWithPage = `${endPoint}?limit=${pageSize}&number=${pageNumber}${
    searchString && searchString !== "" ? `&${searchString}` : ""
  }`;
  return endPointWithPage;
};

export default apiClient;

export { apiClient, errorMessageExtractor, urlBuilder };