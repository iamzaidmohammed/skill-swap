import axios from "axios";
// import { Platform } from "react-native";

// const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "172.20.10.2";

const API = axios.create({
  baseURL: `http://172.20.10.2:5000/api`,
  // baseURL: `http://${defaultHost}:5000/api`,
  timeout: 10000,
});

export default API;
