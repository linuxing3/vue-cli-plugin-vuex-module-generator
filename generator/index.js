const fs = require("fs");
const path = require("path");

// Helper functions
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function uncapitalizeFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
}

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

  // 如果vue.config.js中有预设置，使用预设置，否则使用prompts输入设置
  const { moduleName, storeRootDir, routerRootDir, componentRootDir } =
    options.pluginOptions && options.pluginOptions.vuexModuleGenerator
      ? options.pluginOptions.vuexModuleGenerator
      : options;
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
  console.log("storeRootTypesPath is: " + storeRootTypesPath);
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

  const moduleDirModulePath = path.join(moduleDirPath, `${moduleName}.ts`);
  console.log("moduleDirModulePath is:" + moduleDirModulePath);
  if (!fs.existsSync(moduleDirModulePath)) {
    // to @/store/modules/activity.ts
    files[moduleDirModulePath] = `${templatesRoot}/store/modules/module.ts`;
  } else {
    console.warn("Store SubModule file exists");
  }

  const moduleDirIndexPath = path.join(moduleDirPath, `index.ts`);
  console.log("moduleDirIndexPath is:" + moduleDirIndexPath);
  if (!fs.existsSync(moduleDirIndexPath)) {
    // to @/store/modules/index.ts with require.context for auto import modules
    files[moduleDirIndexPath] = `${templatesRoot}/store/modules/index.ts`;
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
      // to @/store/rotuer/*
      files[filePath] = `${templatesRoot}/router/${fileName}`;
    });
  } else {
    console.warn(`Router ${routerBaseDir} exists`);
  }

  // Components
  // 如果组件已存在，直接退出
  // from @/components/activity/Table.vue
  const componentsDir =
    path.join(componentRootDir, moduleName) || componentRootDir;
  console.warn(`Checking Components Dir Path ${componentsDir} ...`);
  if (!fs.existsSync(componentsDir)) {
    ["Table", "Info"].forEach(template => {
      let fileName = `${template}.vue`;
      // @/components/activity/activityTable.vue
      let filePath = path.join(componentsDir, `${moduleName}${fileName}`);
      console.log("Components files generated in " + filePath);
      files[filePath] = `${templatesRoot}/components/module/${fileName}`;
    });
  } else {
    console.warn(`Components Module ${componentsDir} exists`);
  }

  // 拷贝模块文件到项目文件中
  console.log("文件准备完毕，拷贝到相应目录！");
  console.log(files);
  api.render(files);
  console.log("文件拷贝完毕，进行后续处理！");

  console.log("安装插件前，对模板文件进行后期处理");

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

  console.log(
    "安装插件后，对已生成模板文件进行处理，替换为示例名称为相应模块的名称！"
  );

  api.onCreateComplete(() => {
    filePaths = [
      `${storeRootDir}/modules/${moduleName}.ts`,
      `${componentRootDir}/${moduleName}/${moduleName}Table.vue`,
      `${componentRootDir}/${moduleName}/${moduleName}Info.vue`
    ];

    filePaths.forEach(filePath => {
      console.log("更新[" + filePath + "]文件中的模块名称");
      // 读取文件内容
      fileContent = fs.readFileSync(api.resolve(filePath), "utf8");
      // 动态替换模块名称
      fileContent = fileContent.replace(
        /Activtiy.*?/m,
        capitalizeFirstLetter(moduleName)
      );
      fileContent = fileContent.replace(
        /activtiy.*?/m,
        uncapitalizeFirstLetter(moduleName)
      );
      // 重新写入到对应文件中
      fs.writeFileSync(api.resolve(filePath), fileContent, "utf8");
    });
  });
};
