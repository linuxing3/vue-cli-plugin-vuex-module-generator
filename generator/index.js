const fs = require("fs");
const path = require("path");

module.exports = (api, options, rootOptions) => {
  // 确认使用typescript
  const usesTS = api.hasPlugin("typescript");
  if (!usesTS) {
    console.log("This plugin should be used with typescript");
    console.log("Please install it: vue add typescript ");
    api.extendPackage({
      devDependencies: {
        "@vue/cli-plugin-typescript": "^3.0.1"
      }
    });
  }
  // 确认使用electron
  const usesELECTRON = api.hasPlugin("electron-builder");
  if (!usesELECTRON) {
    console.log("This plugin should be used with electron");
    console.log("Please install it: vue add electron-builder ");
    api.extendPackage({
      devDependencies: {
        "vue-cli-plugin-electron-builder": "^1.0.0-rc.1"
      }
    });
  }
  // 安装依赖包
  api.extendPackage({
    dependencies: {
      nedb: "^1.8.0",
      "nedb-promise": "^2.0.1",
      "vue-router": "^3.0.1",
      vuex: "^3.0.1"
    },
    devDependencies: {
      "@types/nedb": "^1.8.5",
      "vuex-class": "^0.3.1",
      "vuex-pathify": "^1.1.3"
    }
  });

  // 拷贝模板
  const files = {};
  const { moduleName, storeRootDir, routerRootDir, componentRootDir } = options;
  const templatesRoot = "./templates";

  // 根目录 Store root directory
  // @/store/index.ts
  const storeRootIndexPath = path.join(storeRootDir, "index.ts");
  console.log("storeRootIndexPath is: " + storeRootIndexPath);
  console.log("--------------------------------------------------------");
  if (!fs.existsSync(storeRootIndexPath)) {
    files[storeRootIndexPath] = `${templatesRoot}/store/index.ts`;
  }
  // Store types
  // @/store/types.ts
  const storeRootTypesPath = path.join(storeRootDir, "types.ts");
  console.log("storeRootIndexPath is: " + storeRootTypesPath);
  console.log("--------------------------------------------------------");
  if (!fs.existsSync(storeRootTypesPath)) {
    files[storeRootTypesPath] = `${templatesRoot}/store/types.ts`;
  }

  // Store model
  // @/store/Model/*
  const storeModelPath = path.join(storeRootDir, "Model/BaseModel.ts");
  console.log("storeModelPath is: " + storeModelPath);
  console.log("--------------------------------------------------------");
  if (!fs.existsSync(storeModelPath)) {
    files[storeModelPath] = `${templatesRoot}/store/Model/BaseModel.ts`;
  }

  // Store api
  // @/store/api/*
  const storeApiPath = path.join(storeRootDir, "api/NedbSDK.ts");
  console.log("storeApiPath is:" + storeApiPath);
  if (!fs.existsSync(storeApiPath)) {
    files[storeApiPath] = `${templatesRoot}/store/api/NedbSDK.ts`;
  }

  // Store module
  // moduleDirIndexPath from @/store/modules/module.ts
  const moduleDirPath = path.join(storeRootDir, "modules");
  const moduleDirIndexPath = path.join(moduleDirPath, `${moduleName}.ts`);
  console.log("moduleDirIndexPath is:" + moduleDirIndexPath);
  if (!fs.existsSync(moduleDirIndexPath)) {
    // @/store/modules/activity.ts
    files[moduleDirIndexPath] = `${templatesRoot}/store/modules/module.ts`;
  } else {
    console.warn("Store Module Index file exists");
  }

  // 存储器模块的模板文件,包含对NEDB统一的CRUD操作，可被其他模块引用和扩展
  // Modules templates
  // moduleBaseDir from @store/modules/Base/*
  // Each file under the dir will be rendered, as base module to be extented
  const moduleBaseDir = path.join(moduleDirPath, "Base");
  console.warn(`Checking Module Dir Path ...`);
  console.log("--------------------------------------------------------");
  if (!fs.existsSync(moduleBaseDir)) {
    ["index", "actions", "mutations", "getters"].forEach(template => {
      let fileName = `${template}.ts`;
      let filePath = path.join(moduleBaseDir, fileName);
      console.log("module files generated in " + filePath);
      // @/store/modules/Base/index
      files[filePath] = `${templatesRoot}/store/modules/Base/${fileName}`;
    });
  } else {
    console.warn(`Store Module ${moduleBaseDir} exists`);
  }

  // 存储器插件的模板文件 Plugin templates
  // pluginBaseDir @/store/plugin/*
  const pluginBaseDir = path.join(storeRootDir, "plugin");
  console.warn(`Checking Plugin Dir Path ...`);
  console.log("--------------------------------------------------------");
  if (!fs.existsSync(pluginBaseDir)) {
    ["index", "persistentPlugin"].forEach(template => {
      let fileName = `${template}.ts`;
      let filePath = path.join(pluginBaseDir, fileName);
      console.log("Plugin files generated in " + filePath);
      // @/store/modules/Base/index
      files[filePath] = `${templatesRoot}/store/plugin/${fileName}`;
    });
  } else {
    console.warn(`Store plugin ${pluginBaseDir} exists`);
  }

  // 路由器的模板文件 Router templates
  // routerBaseDir from @/store/routers/*
  const routerBaseDir = routerRootDir || path.join(storeRootDir, "router");
  console.warn(`Checking Plugin Dir Path ...`);
  console.log("--------------------------------------------------------");
  if (!fs.existsSync(routerBaseDir)) {
    ["index", "path"].forEach(template => {
      let fileName = `${template}.ts`;
      let filePath = path.join(routerBaseDir, fileName);
      console.log("Plugin files generated in " + filePath);
      // @/store/modules/Base/index
      files[filePath] = `${templatesRoot}/router/${fileName}`;
    });
  } else {
    console.warn(`Router ${routerBaseDir} exists`);
  }

  // Components
  // 如果组件已存在，直接退出
  // @/components/activity
  const componentsDirPath =
    path.join(componentRootDir, moduleName) || componentRootDir;
  console.warn(`Checking Components Dir Path ${componentsDirPath} ...`);
  if (!fs.existsSync(componentsDirPath)) {
    ["Table", "Info"].forEach(template => {
      // Table.ts
      let fileName = `${template}.vue`;
      // @/components/activity/Table.ts
      let filePath = path.join(componentsDirPath, `${moduleName}${fileName}`);
      console.log("Components files generated in " + filePath);
      files[filePath] = `${templatesRoot}/components/module/${fileName}`;
    });
  } else {
    console.warn(`Components Module ${componentsDirPath} exists`);
  }

  // 在api中调用模块文件并进行后期处理

  api.render(files);

  // 安装插件前，对模板文件进行后期处理

  api.postProcessFiles(files => {
    // 编辑根模块，添加模块 Edit store's root module
    const storeRoot = files[storeRootIndexPath];

    if (storeRoot) {
      const lines = storeRoot.split(/\r?\n/g).reverse();

      // 按模块名称，添加引用 Add import line
      const lastImportIndex = lines.findIndex(line => line.match(/^import/));
      if (lastImportIndex !== -1) {
        lines[
          lastImportIndex
        ] += `\nimport ${moduleName} from './${moduleName}'`;
      }

      // 添加模块行Add module line
      lines.reverse();
      const modulesStartIndex = lines.findIndex(line =>
        line.match(/modules: *{/)
      );
      if (modulesStartIndex !== -1) {
        const spaces = lines[modulesStartIndex].indexOf("modules");
        const modulesEndIndex = lines.findIndex(
          (line, index) => index >= modulesStartIndex && line.match(/}/)
        );
        if (modulesEndIndex !== -1) {
          if (modulesEndIndex === modulesStartIndex) {
            const closingBraceIndex = lines[modulesStartIndex].indexOf("}");
            const start = lines[modulesStartIndex].substr(0, closingBraceIndex);
            const end = lines[modulesStartIndex].substr(closingBraceIndex);
            lines[modulesEndIndex] = `${start}\n${Array(spaces + 3).join(
              " "
            )}${moduleName}\n${Array(spaces + 1).join(" ")}${end}`;
          } else {
            lines[modulesEndIndex] = `${Array(spaces + 3).join(
              " "
            )}${moduleName}\n${lines[modulesEndIndex]}`;
            if (modulesEndIndex - modulesStartIndex > 1) {
              lines[modulesEndIndex - 1] += ",";
            }
          }
        }
      }
      // 返回新文件
      files[storeRootIndexPath] = lines.join("\n");
    }
  });

  // 安装插件后，对已生成模板文件进行处理
  api.onCreateComplete(() => {
    // Modify components files and contents
    let componentTable, componentInfo;
    componentTable = fs.readFileSync(
      api.resolve(`./src/components/${moduleName}/${moduleName}Table.ts`)
    );
    componentInfo = fs.readFileSync(
      api.resolve(`./src/components/${moduleName}/${moduleName}Info.ts`)
    );
    // 更改组件中的大写开头模块引用
    componentTable = componentTable.replace(
      /Activtiy/m,
      capitalizeFirstLetter(moduleName)
    );

    componentInfo = componentInfo.replace(
      /Activtiy/m,
      capitalizeFirstLetter(moduleName)
    );

    // 更改组件中的小写开头模块引用
    componentTable = componentTable.replace(
      /activtiy/m,
      unCapitalizeFirstLetter(moduleName)
    );
    componentInfo = componentInfo.replace(
      /activtiy/m,
      unCapitalizeFirstLetter(moduleName)
    );

    // 更改路由的路径文件
    let routerPath;
    routerPath = fs.readFileSync(api.resolve(`./src/router/path.ts`));

    routerPath = routerPath.replace(
      /activtiy/m,
      unCapitalizeFirstLetter(moduleName)
    );

    routerPath = routerPath.replace(
      /Activtiy/m,
      capitalizeFirstLetter(moduleName)
    );
  });
};

// Helper functions
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function unCapitalizeFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
}
