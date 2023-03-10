import axios from "axios";
import {
  FETCH_COMPONENTS_ENDPOINT,
  FETCH_PRODUCTS_ENDPOINT,
  FETCH_USER_ENDPOINT,
  LOGIN_USER_ENDPOINT,
  USER_PIN_ENDPOINT,
  FETCH_CATALOG_ENDPOINT,
  FETCH_STOCK_SUPPLIES_ENDPOINT,
  FETCH_ORDERS_ENDPOINT,
  FETCH_FLORISTS_ENDPOINT,
  FETCH_COURIERS_ENDPOINT,
  FETCH_STORES_ENDPOINT,
  FETCH_STOCK_MOVEMENTS_ENDPOINT,
  FETCH_STOCK_WRITESOFF_ENDPOINT
} from "./Constants";

export const loginUserApiCall = async ({ login, password }) => {
  const response = await axios.post(LOGIN_USER_ENDPOINT, {
    login,
    password,
  });
  return response.data;
};

export const fetchUserInfoApiCall = async ({ token }) => {
  const response = await axios.post(FETCH_USER_ENDPOINT, {
    token,
  });
  return response.data;
};

export const fetchProductsApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_PRODUCTS_ENDPOINT);
  return response.data;
};

export const fetchComponentsApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_COMPONENTS_ENDPOINT);
  return response.data;
};

export const fetchCatalogItemsApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_CATALOG_ENDPOINT);
  return response.data;
};

export const fetchStockSuppliesApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_STOCK_SUPPLIES_ENDPOINT);
  return response.data;
};

export const fetchStockMovementsApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_STOCK_MOVEMENTS_ENDPOINT);
  return response.data;
};

export const fetchStockWritesOffApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_STOCK_WRITESOFF_ENDPOINT);
  return response.data;
};

export const checkUserPinApiCall = async ({ token, pin }) => {
  const response = await axios.post(USER_PIN_ENDPOINT, {
    token,
    pin,
  });
  return response.data;
};

export const fetchOrdersApiCall = async ({ token, floristId }) => {
  const params = {
    floristId,
  };
  // map object to query string
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const response = await axios.get(FETCH_ORDERS_ENDPOINT + "?" + query);
  return response.data;
};

export const fetchFloristsApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_FLORISTS_ENDPOINT);
  return response.data;
};

export const fetchCouriersApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_COURIERS_ENDPOINT);
  return response.data;
};

export const fetchStoresApiCall = async ({ token }) => {
  const response = await axios.get(FETCH_STORES_ENDPOINT);
  return response.data;
};
