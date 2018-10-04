/* eslint-disable */
import { uncapitalizeFirstLetter } from "../../../index";

let files = require["context"](".", false, /\.ts$/);
let modules = {};

files.keys().forEach(key => {
  if (key === "./index.ts") return;
  let moduleName = uncapitalizeFirstLetter(key.replace(/(\.\/|\.ts)/g, ""));
  modules[moduleName] = files(key).default;
});

console.log(modules);
export default modules;
