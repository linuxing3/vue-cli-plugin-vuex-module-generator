module.exports = [
  {
    type: "input",
    name: "storeRootDir",
    message: "Where's your store's root directory?",
    default: "./src/store",
  },
  {
    type: "input",
    name: "componentRootDir",
    message: "Where's your component's root directory?",
    default: "./src/components",
  },
  {
    type: "input",
    name: "routerRootDir",
    message: "Where's your router's root directory?",
    default: "./src/router",
  },
  {
    type: "input",
    name: "apiRootDir",
    message: "Where's your api's root directory, holds nedb and models?",
    default: "./src/api",
  },
  {
    type: "input",
    name: "moduleName",
    message: "What's your new module's name?",
    default: "activity",
  },
];
