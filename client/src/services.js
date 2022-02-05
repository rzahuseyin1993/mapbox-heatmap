import axios from "axios";
import { BASE_URL } from "./settings.js";

export const getFeatures = async () => {

  var result = null;
    
  let url = `${BASE_URL}/json-server/features`;

  await axios.get(url).then((response) => {
      result = response.data;
  }).catch((err) => {
    result = {
      status: "failed",
      message: "No internet connection",
    };
  });

  return result;

}

export const addFeature = async (params) => {

  var result = null;
    
  let url = `${BASE_URL}/json-server/feature/add`;

  await axios.post(url, params).then((response) => {
      result = response.data;
  }).catch((err) => {
    result = {
      status: "failed",
      message: "No internet connection",
    };
  });

  return result;

}

export const updateFeature = async (params) => {

  var result = null;
    
  let url = `${BASE_URL}/json-server/feature/update`;

  await axios.put(url, params).then((response) => {
      result = response.data;
  }).catch((err) => {
    result = {
      status: "failed",
      message: "No internet connection",
    };
  });

  return result;

}

export const deleteFeature = async (params) => {
  var result = null;
    
  let url = `${BASE_URL}/json-server/feature/delete`;

  await axios.delete(url, params).then((response) => {
      result = response.data;
  }).catch((err) => {
    result = {
      status: "failed",
      message: "No internet connection",
    };
  });

  return result;

}