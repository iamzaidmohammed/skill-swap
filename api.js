import axios from "axios";

const API = axios.create({
  // baseURL: "http://10.0.2.2:5000/api", // For Android Emulator
  baseURL: "http://172.20.10.2:5000/api", // For iOS simulator
});

export default API;
