const fs = require("fs");
const path = require("path");

module.exports = (api, options, rootOptions) => {
  // 安装依赖包
  api.extendPackage({
    dependencies: {
      nedb: "^1.8.0",
      "nedb-promise": "^2.0.1"
    },
    devDependencies: {
      "@types/nedb": "^1.8.5"
    }
  });

  // 所有文件
  const files = {};
  // 拷贝模板
  const { moduleName, storeRootDir, routerRootDir, componentsRootDir } = options;
  const templatesRoot = "./templates";

  // 根目录 Store root directory
  // @/store/index.ts
  const storeRootIndexPath = path.join(storeRootDir, "index.ts");
  if (!fs.existsSync(storeRootIndexPath)) {
    files[storeRootIndexPath] = `${templatesRoot}/store/index.ts`;
  }

 // store model
  const storeModelPath = path.join(storeRootDir, "Model/BaseModel.ts");
  if (!fs.existsSync(storeModelPath)) {
    files[storeModelPath] = `${templatesRoot}/store/Model/BaseModel.ts`;
  }

 // store api
  const storeApiPath = path.join(storeRootDir, "api/NedbSDK.ts");
  if (!fs.existsSync(storeApiPath)) {
    files[storeApiPath] = `${templatesRoot}/store/api/NedbSDK.ts`;
  }

  // Store module
  // 如果模块已存在，直接退出
  // @/store/modules/activity.ts
  const moduleDirPath = path.join(storeRootDir, "modules");
  const moduleDirIndexPath = `${moduleDirPath}/${moduleName}.ts`;
  if (!fs.existsSync(moduleDirPath)) {
    // @/store/modules/activity.ts
    files[moduleDirIndexPath] = `${templatesRoot}/store/modules/${moduleName}.ts`;
  } else {
    console.warn(`Module ${moduleDirIndexPath} exists`);
    return;
  }
  // 存储器模块的模板文件 Modules templates
  // @store/modules/Base/index.ts ...
  if (!fs.existsSync(moduleDirPath, "Base")) {
    ["index", "actions", "mutations", "getters"]
      .forEach(template => {
        let fileName = `${template}.ts`;
        let filePath = path.join(moduleDirPath, "Base", fileName);
        console.log(filePath);
        // @/store/modules/Base/index
        files[filePath] = `${templatesRoot}/store/modules/Base/${fileName}`;
      })
  } else {
    console.warn(`Module ${moduleDirPath}/Base exists`);
    return;
  }


// Components
  // 如果组件已存在，直接退出
  // @/components/activity
  const componentsDirPath = path.join(componentsRootDir, moduleName);
  if (fs.existsSync(componentsDirPath)) {
    return;
  } else {
    ["Table", "Info" ]
      .forEach(template => {
        // Table.ts
        let fileName = `${template}.ts`;
        // @/components/activity/Table.ts
        let filePath = path.join(componentsDirPath, fileName);
        console.log(filePath);
        files[filePath] = `${templatesRoot}/components/module/${fileName}`;
      })
  }


 // 在api中调用模块文件并进行后期处理

  api.render(files);

  api.postProcessFiles(files => {
    // 编辑根模块，添加模块 Edit store's root module
    const storeRoot = files[storeRootPath];

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

      files[storeRootPath] = lines.join("\n");
    }
  });
};
