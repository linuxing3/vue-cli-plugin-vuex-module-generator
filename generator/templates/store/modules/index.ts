/* eslint-disable */
function uncapitalizeFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
}

let files = require["context"](".", false, /\.ts$/);
let modules = {};

files.keys().forEach(key => {
  if (key === "./index.ts") return;
  let moduleName = uncapitalizeFirstLetter(key.replace(/(\.\/|\.ts)/g, ""));
  modules[moduleName] = files(key).default;
});

console.log(modules);
export default modules;
