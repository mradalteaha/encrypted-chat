import axios from "axios";
import Constants from 'expo-constants';
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost
  .split(`:`)
  .shift()
  .concat(`:4000`)}`;

export default axios.create({
    baseURL: `${uri}`
})